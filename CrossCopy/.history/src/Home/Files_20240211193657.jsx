import React, { useState, useEffect, useRef, lazy } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiFilePlus, FiDownloadCloud, FiShare2, FiAlertTriangle } from 'react-icons/fi';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { storage, auth, database } from '../firebase';
import axios from 'axios';
import { API_URL, FILES_URL } from '../URL';
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  uploadBytesResumable,
} from 'firebase/storage';
import { ref as dbRef, set, push, remove, onValue, onDisconnect } from 'firebase/database';
import { useSwipeable } from 'react-swipeable';
import { Heading, ButtonContainer, Button } from './HomeElements';
import ShareModal from '../Share/Sharemodal';
import Settings from './Settings';
// const Settings = lazy(() => import('./Settings'));

import {
  SwipeContainer,
  FileItem,
  InfoContainer,
  SubHeader,
  Close,
  SettingsIcon,
  DropzoneContainer,
  FilesContainer,
  FileDataContainer,
  FileName,
  AddTextContainer,
  CenterContainer,
  ErrorButton,
  Spinner,
  spinner,
  ProgressBarContainer,
  ProgressBar,
  DownloadBar,
  Modal,
} from './FilesElements';

const FileDropzone = ({ mobile, setOpenFiles, files, setFiles, paidUser }) => {
  // const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // const [paidUser, setPaidUser] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileProgresses, setFileProgresses] = useState({});
  const [totalFiles, setTotalFiles] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [downloadInProgress, setDownloadInProgress] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [fileURL, setFileURL] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  const fileContainerRef = useRef(null);

  useEffect(() => {
    if (Object.keys(fileProgresses).length > 0) {
      const totalProgress = Object.values(fileProgresses).reduce(
        (total, progress) => total + progress,
        0
      );
      setUploadProgress(totalProgress / Object.keys(fileProgresses).length);

      // Check if all files have been uploaded and rendered
      const filesRendered =
        fileContainerRef.current && fileContainerRef.current.children.length > 0;
      if (
        filesRendered &&
        Object.keys(fileProgresses).length === totalFiles &&
        totalProgress / Object.keys(fileProgresses).length === 100
      ) {
        setLoading(false);
        setUploadProgress(0);
        setFileProgresses({});
      }
    }
  }, [fileProgresses, totalFiles, files]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      setLoading(true);
      setError(null); // Reset the error state when new files are dropped
      setTotalFiles(acceptedFiles.length);
      

      const maxFileSize = paidUser ? 2147483648 : 209715200; // 2GB for paid, 200MB for free users
      const maxCumulativeSize = paidUser ? 2000 * 1024 * 1024 : 500 * 1024 * 1024; // 500MB

      const tooBigFiles = acceptedFiles.filter((file) => file.size > maxFileSize);
      const totalSize = acceptedFiles.reduce((total, file) => total + file.size, 0);
      const errorFiles = acceptedFiles.filter((file) => file.size === 96);

      // Calculate the cumulative size of files already uploaded
      const currentFilesSize = files.reduce((total, file) => total + file.size, 0);

      if (tooBigFiles.length > 0 || totalSize > maxFileSize) {
        setError({
          message: `Please upload files smaller than ${paidUser ? '2GB' : '200MB'}.`,
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

      // Check if the total size exceeds 200MB
      if (totalSize > maxFileSize) {
        setError({
          message: `Total size of all uploaded files must be smaller than ${
            paidUser ? '2GB' : '200MB'
          }.`,
        });
        setLoading(false);
        return;
      }

      // Check if the cumulative size (including existing files) exceeds 500MB
      if (currentFilesSize + totalSize > maxCumulativeSize) {
        setError({
          message: `The total size of uploaded files exceeds the 500MB limit.${
            paidUser ? '2GB' : '500MB'
          }.`,
        });
        setLoading(false);
        return;
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
            console.error('Error uploading file:', error);
            setError(error);
            setLoading(false);
          },
          async () => {
            console.log('Upload complete!');

            const url = await getDownloadURL(fileStorageRef);

            const fileDbRef = dbRef(
              database,
              `uploads/${auth.currentUser.uid}/${sanitizedFileName}`
            );

            set(fileDbRef, {
              name: sanitizedFileName,
              size: file.size,
              url: url,
              uploadTimestamp: Date.now(),
            });
          }
        );
      });
    },
  });

  const removeFile = (file) => {
    // Create a reference to the file to delete
    const fileStorageRef = storageRef(storage, `uploads/${auth.currentUser.uid}/${file.name}`);
    const fileDbRef = dbRef(database, `uploads/${auth.currentUser.uid}/${file.name}`);

    // Delete the file
    setFiles((prevFiles) => prevFiles.filter((f) => f.name !== file.name));
    remove(fileDbRef)
      .then(() => {
        // File deleted successfully from Firebase Storage
        console.log('File deleted successfully from Storage');

        // Now delete the file metadata from the database
        return deleteObject(fileStorageRef);
      })
      .then(() => {
        // File metadata deleted successfully from the database

        setLoading(false);
        setUploadProgress(0);
        setFileProgresses({});

        // Now remove the file from the state
        setFiles((prevFiles) => prevFiles.filter((f) => f.name !== file.name));
      })
      .catch((error) => {
        // Uh-oh, an error occurred!
        console.error('Error deleting file:', error);
      });
  };

  const removeAllFiles = () => {
    if (window.confirm('Are you sure you want to delete all files?')) {
      // User clicked "OK"
      // Loop through all files and delete them
      const deletePromises = files.map((file) => {
        // Create a reference to the file to delete
        const fileStorageRef = storageRef(storage, `uploads/${auth.currentUser.uid}/${file.name}`);
        const fileDbRef = dbRef(database, `uploads/${auth.currentUser.uid}/${file.name}`);

        // Delete the file
        return remove(fileDbRef)
          .then(() => {
            // File deleted successfully from Firebase Storage
            console.log('File deleted successfully from Storage');

            // Now delete the file metadata from the database
            return deleteObject(fileStorageRef);
          })
          .then(() => {
            // File metadata deleted successfully from the database
            console.log('File metadata deleted successfully from the database');
          })
          .catch((error) => {
            // Uh-oh, an error occurred!
            console.error('Error deleting file:', error);
          });
      });

      Promise.all(deletePromises)
        .then(() => {
          // After all files have been deleted, clear the files state
          setFiles([]);
        })
        .catch((error) => {
          console.error('Error deleting all files:', error);
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
        console.log(sFiles);
        const response = await axios.post(`${FILES_URL}/user/${user.uid}/zipped`, {
          files: sFiles,
        });
        const { data } = response;
        if (data.zipUrl) {
          // If the server returns a URL for the zip file, download it
          const link = document.createElement('a');
          link.href = data.zipUrl;
          link.download = 'files.zip';
          link.click();
        }
      } catch (error) {
        console.log(error);
      } finally {
        setDownloadInProgress(false);
      }
    }
  };

  const shortenUrl = async (alteredKey) => {
    try {
      const resp = await axios({
        method: 'POST',
        url: 'https://api-ssl.bitly.com/v4/shorten',
        headers: {
          Authorization: '869543bef6fa765330ed2c169da6b4773a252e8e',
          'Content-Type': 'application/json',
        },
        data: {
          long_url: `https://crosscopy.dev/shared/${alteredKey}`,
        },
      });
      console.log(resp.data.link);
      return resp.data.link;
    } catch (err) {
      // Handle Error Here
      console.error(err);
    }
  };

  const handleShareClick = async (filesToShare, e) => {
    e.preventDefault();

    const newRef = push(dbRef(database, `shared`));
    console.log(filesToShare);

    // Add the current timestamp to each shared object
    const filesWithTimestamp = {
      ...filesToShare,
      uploadTimestamp: Date.now(),
      uid: auth.currentUser.uid,
      shareCode: Math.floor(Math.random()*100000+1)
    };

    try {
      await set(newRef, filesWithTimestamp);

      const uniqueKey = newRef.key;
      const alteredKey = uniqueKey.replace(/-/g, '');

      const shortenedUrl = await shortenUrl(alteredKey);

      const shareData = {
        title: 'Share files',
        text: 'Check out these files!',
        url: shortenedUrl, // Use the shortened URL here
      };
      if (uniqueKey) {
        setFileURL(shareData.url);
      }

      if (navigator.share && uniqueKey) {
        navigator
          .share({
            title: shareData.title,
            text: shareData.text,
            url: shareData.url,
          })
          .then(() => {
            console.log('Successful share');
          })
          .catch((error) => {
            console.log('Error sharing', error);
          });
      } else {
        setShowModal(true); // Ensure this is set after fileURL is set
      }
    } catch (error) {
      console.error('Something went wrong sharing', error);
    }
  };

  return (
    <>
      {showModal && fileURL && (
        <Modal
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowModal(false);
            }
          }}
        >
          <ShareModal onClose={() => setShowModal(false)} url={fileURL} />
        </Modal>
      )}
      {!mobile && (
        <Heading style={{ marginLeft: '0px' }}>
          {showSettings ? 'Settings' : 'Files'}
          <ButtonContainer style={{ alignItems: 'center' }}>
            {selectedFiles.length > 0 && (
              <Button onClick={(e) => handleShareClick(selectedFiles, e)}>Share</Button>
            )}
            {selectedFiles.length > 0 && <Button onClick={downloadFiles}>Download</Button>}
            {files.length > 0 && <Button onClick={() => removeAllFiles()}>Clear All</Button>}
            <SettingsIcon onClick={() => setShowSettings(!showSettings)} />
          </ButtonContainer>
        </Heading>
      )}
      {showSettings ? (
        <Settings />
      ) : (
        <div
          style={{
            display: 'flex',
            flex: 1,
            justifyContent: 'center',
            flexDirection: 'column',
            width: '100%',
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
              <FilesContainer ref={fileContainerRef}>
                <AnimatePresence>
                  {files.map((file, index) => (
                    <FileI
                      file={file}
                      index={index}
                      removeFile={removeFile}
                      handleFileSelection={handleFileSelection}
                      selectedFiles={selectedFiles}
                      handleShareClick={handleShareClick}
                      key={file.name}
                    />
                  ))}
                </AnimatePresence>
              </FilesContainer>
            )}
            {loading ? (
              <CenterContainer layout>
                <Spinner animate={spinner.loop} />
              </CenterContainer>
            ) : error ? (
              <CenterContainer layout>
                <FiAlertTriangle size={35} color={'#ff9100'} />

                <SubHeader>{error.message}</SubHeader>
                <ErrorButton onClick={() => setError(null)}>Try again</ErrorButton>
              </CenterContainer>
            ) : (
              <DropzoneContainer {...getRootProps()} layout>
                <AddTextContainer>
                  <input {...getInputProps()} />
                  <FiFilePlus size={40} style={{ strokeWidth: 1 }} />
                  <p>Drag and drop, or click to select files</p>
                </AddTextContainer>
              </DropzoneContainer>
            )}
          </LayoutGroup>
        </div>
      )}

      {mobile && (
        <Heading style={{ marginLeft: '0px' }}>
          Files
          <ButtonContainer>
            {!mobile && <Button onClick={() => setOpenFiles(false)}>Text</Button>}
            {selectedFiles.length > 0 && (
              <Button onClick={(e) => handleShareClick(selectedFiles, e)}>Share</Button>
            )}
            {selectedFiles.length > 0 && <Button onClick={downloadFiles}>Download</Button>}
            {files.length > 0 && <Button onClick={() => removeAllFiles()}>Clear All</Button>}
          </ButtonContainer>
        </Heading>
      )}
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
  if (name.length > 28) {
    name = `${name.substring(0, 25)}(...)`;
  }

  // Return the truncated name with the extension
  return `${name}.${extension}`;
}

export const FileI = ({
  file,
  index,
  removeFile,
  handleFileSelection,
  selectedFiles,
  handleShareClick,
  ...props
}) => {
  return (
    <FileItem
      key={file.name}
      // initial={{ opacity: 0 }}
      // animate={{ opacity: 1 }}
      // transition={{ duration: 0.3, delay: index * 0.1 }}
      exit={{ x: -20, opacity: 0, overflow: 'hidden' }} // tweaked exit animation
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

      <FiShare2
        onClick={(e) => handleShareClick([file], e)}
        size={17}
        style={{
          marginRight: '12px',
          marginTop: '0px',
          zIndex: 5,
          strokeWidth: 1,
          color: '#00ffee',
          cursor: 'pointer',
        }}
      />

      <a href={file.url} target="_blank" rel="noopener noreferrer">
        <FiDownloadCloud
          size={17}
          style={{
            marginRight: '8px',
            marginTop: '4px',
            zIndex: 3,
            strokeWidth: 1,
            color: '#26ff00',
          }}
        />
      </a>
      <Close
        style={{ strokeWidth: 1, zIndex: 3 }}
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
