import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { FiFilePlus, FiDownloadCloud } from 'react-icons/fi';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { storage, auth } from '../firebase';
import { FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';
import {
  ref as storageRef,
  getDownloadURL,
  uploadBytesResumable,
  deleteObject,
} from 'firebase/storage';
import { API_URL } from './URL';
import {
  FileItem,
  InfoContainer,
  Close,
  DropzoneContainer,
  FilesContainer,
  FileDataContainer,
  FileName,
  AddFileContainer,
  CenterContainer,
  Spinner,
  spinner,
  ProgressBarContainer,
  ProgressBar,
  BContainer,
  DButton,
  DownloadBar,
  SubHeader,
} from './FileElements';

const FileDropzone = ({}) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileProgresses, setFileProgresses] = useState({});
  const [totalFiles, setTotalFiles] = useState(0);
  const [smallBox, setSmallBox] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [downloadInProgress, setDownloadInProgress] = useState(false);
  const [warning, setWarning] = useState(null);

  useEffect(() => {
    if (uploadProgress > 0) {
      window.onbeforeunload = () =>
        'Your upload is still in progress. Are you sure you want to close?';
    } else {
      window.onbeforeunload = null;
    }
  }, [uploadProgress]);

  const fetchFiles = () => {
    setSelectedFiles([]);
    axios
      .get(`${API_URL}/uploads/${auth.currentUser.uid}`)
      .then((response) => {
        const newFiles = Object.values(response.data);

        if (newFiles.length >= 3) {
          setSmallBox(true);
        }

        // Only update the files state variable if the files have changed
        if (JSON.stringify(newFiles) !== JSON.stringify(files)) {
          setFiles(newFiles);
        }
      })
      .catch((error) => {
        // Handle error
        setError(true);
        // console.log(error);
        setFiles([]);
      });
  };

  useEffect(() => {
    setSelectedFiles([]);
  }, [files]);

  useEffect(() => {
    fetchFiles();
  }, [auth.currentUser]);

  useEffect(() => {
    if (Object.keys(fileProgresses).length > 0) {
      const totalProgress = Object.values(fileProgresses).reduce(
        (total, progress) => total + progress,
        0
      );
      setUploadProgress(totalProgress / Object.keys(fileProgresses).length);

      if (
        Object.keys(fileProgresses).length === totalFiles &&
        totalProgress / Object.keys(fileProgresses).length === 100
      ) {
        setTimeout(() => {
          setUploadProgress(0);
          setFileProgresses({});
          fetchFiles();
          setLoading(false);
        }, 1000);
      }
    }
  }, [fileProgresses, totalFiles]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      setLoading(true);
      setError(null); // Reset the error state when new files are dropped
      setWarning(false);
      setTotalFiles(acceptedFiles.length);

      const tooBigFiles = acceptedFiles.filter((file) => file.size > 209715200); // 200MB in bytes
      const warningFiles = acceptedFiles.filter((file) => file.size > 20971520); // 20MB in bytes
      const errorFiles = acceptedFiles.filter((file) => file.size === 96);

      if (tooBigFiles.length > 0) {
        setError({
          message: 'Please upload files smaller than 200MB.',
        });
        setLoading(false);
        return;
      }

      if (errorFiles.length > 0) {
        setError({
          message: 'Sorry, file type not accepted.',
        });
        setLoading(false);
        return;
      }

      if (warningFiles.length > 0) {
        console.log('Warning ');
        console.log(acceptedFiles[0].size);
        setWarning(true);
      }

      acceptedFiles.forEach((file) => {
        const sanitizedFileName = file.name.replace(/[.#$[\]]/g, '_');
        const fileStorageRef = storageRef(
          storage,
          `uploads/${auth.currentUser.uid}/${sanitizedFileName}`
        );

        const uploadTask = uploadBytesResumable(fileStorageRef, file);

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const fileProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setFileProgresses((prev) => ({ ...prev, [sanitizedFileName]: fileProgress }));
          },
          (error) => {
            // console.error('Error uploading file:', error);
            setError({ message: 'Something went wrong, please try again.' });
            setLoading(false);
          },
          async () => {
            // console.log('Upload complete!');

            const url = await getDownloadURL(fileStorageRef);

            // Call the new API endpoint instead of directly writing to the database
            axios
              .post(`${API_URL}/uploads/${auth.currentUser.uid}/${sanitizedFileName}`, {
                name: sanitizedFileName,
                size: file.size,
                url: url,
              })
              .then((response) => {
                // console.log(response.data.message);
                fetchFiles();
              })
              .catch((error) => {
                console.log('Error updating database.');
              });
          }
        );
      });
    },
  });

  const removeFile = (file) => {
    axios
      .delete(`${API_URL}/uploads/${auth.currentUser.uid}/${file.name}`)
      .then(() => {
        setFiles((prevFiles) => prevFiles.filter((f) => f.name !== file.name));
      })
      .catch((error) => {
        console.log('Error deleting file');
      });
  };

  const removeSelected = () => {
    if (window.confirm('Are you sure you want to delete these files?')) {
      setSelectedFiles([]);
      const deletePromises = selectedFiles.map((file) => {
        setFiles((prevFiles) => prevFiles.filter((f) => f.name !== file.name));
        removeFile(file);
      });

      Promise.all(deletePromises).catch((error) => {
        console.log('Error deleting selected files');
      });
    }
  };

  const handleFileSelection = (file) => {
    if (selectedFiles.find((f) => f.name === file.name)) {
      setSelectedFiles(selectedFiles.filter((f) => f.name !== file.name));
    } else {
      setSelectedFiles([...selectedFiles, file]);
    }
  };

  const selectAll = () => {
    setSelectedFiles([...files]);
  };

  // In your Chrome extension
  const downloadFiles = async () => {
    const user = auth.currentUser;
    let sFiles = [];
    if (user) {
      try {
        setDownloadInProgress(true);
        sFiles = selectedFiles.map((file) => ({
          ...file,
          path: `uploads/${user.uid}/${file.name}`,
        }));

        // Create a string of file names separated by commas
        const fileNames = sFiles.map((file) => file.name).join(',');

        // Open your web app in a new tab with the file names as URL parameters
        chrome.tabs.create({ url: `https://crosscopy.dev/download?files=${fileNames}` });
      } catch (error) {
        console.log('Something went wrong...');
        console.log(error);
      } finally {
        setDownloadInProgress(false);
      }
    }
  };

  return (
    <>
      <motion.div
        key="files"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          display: 'flex',
          flex: 1,
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          overflowY: 'auto',
        }}
      >
        <ProgressBarContainer>
          <ProgressBar
            animate={{ width: `${uploadProgress}%` }}
            transition={{ duration: 0.5 }}
            uploadProgress={uploadProgress}
          />
          <DownloadBar
            animate={{ width: downloadInProgress ? '100%' : '0%' }}
            transition={{ duration: 0.5, yoyo: Infinity }}
            downloadProgress={downloadInProgress ? 100 : 0}
          />
        </ProgressBarContainer>
        <LayoutGroup>
          {files.length > 0 && (
            <FilesContainer>
              <LayoutGroup>
                <AnimatePresence>
                  {files.map((file, index) => (
                    <FileI
                      file={file}
                      index={index}
                      removeFile={removeFile}
                      key={file.name}
                      handleFileSelection={handleFileSelection}
                      selectedFiles={selectedFiles}
                    />
                  ))}
                </AnimatePresence>
              </LayoutGroup>
            </FilesContainer>
          )}
          {loading ? (
            <CenterContainer layout>
              <Spinner animate={spinner.loop} />
              <SubHeader style={{ fontSize: '10px' }}>
                Please don't close this window. <br />
              </SubHeader>
              {warning && (
                <SubHeader style={{ fontSize: '10px' }}>
                  Large files can be uploaded in the background{' '}
                  <a style={{ textDecoration: 'none' }} href="https://crosscopy.dev">
                    here.
                  </a>
                </SubHeader>
              )}
            </CenterContainer>
          ) : error ? (
            <CenterContainer layout>
              <FiAlertTriangle size={35} color={'#ff9100'} />
              <SubHeader>{error.message}</SubHeader>
              <DButton onClick={() => setError(null)}>Try again</DButton>
            </CenterContainer>
          ) : selectedFiles.length > 0 ? (
            <BContainer
              key="buttons"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <DButton
                style={{ backgroundColor: '#e44141', flex: 0.3 }}
                onClick={() => (removeSelected(), setSelectedFiles([]))}
              >
                Delete
              </DButton>
              <DButton style={{ backgroundColor: '#484848', flex: 0.5 }} onClick={selectAll}>
                Select All
              </DButton>
              <DButton onClick={downloadFiles}>Download Selected</DButton>
            </BContainer>
          ) : (
            <DropzoneContainer
              {...getRootProps()}
              layout
              transition={{ duration: 0.1 }}
              key="zone"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <AddFileContainer smallBox={smallBox}>
                <input {...getInputProps()} />
                <FiFilePlus
                  size={smallBox ? '20px' : '25px'}
                  style={{ strokeWidth: 1, marginRight: `${smallBox ? '8px' : '0px'}` }}
                />
                <p>Drag and drop, or click to select files</p>
              </AddFileContainer>
            </DropzoneContainer>
          )}
        </LayoutGroup>
      </motion.div>
    </>
  );
};

export default FileDropzone;

function truncateFileName(fileName) {
  // Split the file name into name and extension
  const splitName = fileName.split('.');
  const extension = splitName.pop();
  let name = splitName.join('.');

  // If the name is longer than 30 characters, truncate it
  if (name.length > 35) {
    name = `${name.substring(0, 32)}(...)`;
  }

  // Return the truncated name with the extension
  return `${name}.${extension}`;
}

const FileI = ({ file, index, removeFile, handleFileSelection, selectedFiles, ...props }) => {
  return (
    <FileItem
      key={`${file.name}-${selectedFiles.includes(file) ? 'selected' : 'unselected'}`}
      layout
      // initial={{ y: -10, opacity: 0 }}
      // animate={{ y: 0, opacity: 1 }}
      exit={{ x: -40, opacity: 0, overflow: 'hidden' }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onClick={() => handleFileSelection(file)}
      isSelected={selectedFiles.includes(file)}
    >
      <InfoContainer>
        <FileName>{truncateFileName(file.name.replace(/_/g, '.'))}</FileName>
        <FileDataContainer>
          <span
            style={{ fontSize: '10px', paddingRight: '4px', fontWeight: 400, color: 'lightblue' }}
          >
            {' '}
            {file.size / 1000 < 1000
              ? (file.size / 1000).toFixed(2) + 'KB'
              : (file.size / 1000000).toFixed(2) + 'MB'}
          </span>
          <span>|</span>
          <span style={{ fontSize: '10px', paddingLeft: '4px', fontWeight: 300, color: '#00f7ff' }}>
            {formatTimestamp(file.uploadTimestamp)}
          </span>
        </FileDataContainer>
      </InfoContainer>
      <a href={file.url} target="_blank" rel="noopener noreferrer">
        <FiDownloadCloud
          size={16}
          style={{ marginRight: '8px', marginTop: '4px', strokeWidth: 1, color: '#26ff00' }}
        />
      </a>
      <Close
        style={{ strokeWidth: 1 }}
        size={20}
        onClick={() => {
          removeFile(file);
        }}
      />
    </FileItem>
  );
};

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let seconds = date.getSeconds();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;
  seconds = seconds < 10 ? '0' + seconds : seconds;
  const strTime =
    (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) +
    '/' +
    (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) +
    '/' +
    date.getFullYear() +
    ', ' +
    hours +
    ':' +
    minutes +
    ':' +
    seconds +
    ' ' +
    ampm;
  return strTime;
};
