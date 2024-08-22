import { useState, useEffect, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import {
  ref as dbRef,
  set,
  push,
  remove,
} from 'firebase/database';
import { storage, auth, database } from '../firebase';
import axios from 'axios';

export const useFileDropzone = (paidUser, files, setFiles) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileProgresses, setFileProgresses] = useState({});
  const [totalFiles, setTotalFiles] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [downloadInProgress, setDownloadInProgress] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [fileURL, setFileURL] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [isOpen, setOpen] = useState(false);

  const fileContainerRef = useRef(null);
  const FILES_URL = import.meta.env.VITE_FILES_URL;

  useEffect(() => {
    if (Object.keys(fileProgresses).length > 0) {
      const totalProgress = Object.values(fileProgresses).reduce(
        (total, progress) => total + progress,
        0
      );
      setUploadProgress(totalProgress / Object.keys(fileProgresses).length);

      const filesRendered =
        fileContainerRef.current &&
        fileContainerRef.current.children.length > 0;

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

  const onDrop = async (acceptedFiles) => {
    setLoading(true);
    setError(null);
    setTotalFiles(acceptedFiles.length);

    const maxFileSize = paidUser ? 2147483648 : 209715200;
    const maxCumulativeSize = paidUser ? 2000 * 1024 * 1024 : 500 * 1024 * 1024;

    const tooBigFiles = acceptedFiles.filter((file) => file.size > maxFileSize);
    const totalSize = acceptedFiles.reduce(
      (total, file) => total + file.size,
      0
    );
    const errorFiles = acceptedFiles.filter((file) => file.size === 96);

    const currentFilesSize = files.reduce(
      (total, file) => total + file.size,
      0
    );

    if (tooBigFiles.length > 0 || totalSize > maxFileSize) {
      setError({
        message: `Please upload files smaller than ${
          paidUser ? '2GB' : '200MB'
        }.`,
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

    if (totalSize > maxFileSize) {
      setError({
        message: `Total size of all uploaded files must be smaller than ${
          paidUser ? '2GB' : '200MB'
        }.`,
      });
      setLoading(false);
      return;
    }

    if (currentFilesSize + totalSize > maxCumulativeSize) {
      setError({
        message: `The total size of uploaded files exceeds the 500MB limit.${
          paidUser ? '2GB' : '500MB'
        }.`,
      });
      setLoading(false);
      return;
    }

    await uploadFiles(acceptedFiles);
  };

  const uploadFiles = async (acceptedFiles) => {
    for (const file of acceptedFiles) {
      const sanitizedFileName = file.name.replace(/[.#$[\]]/g, '_');
      const fileStorageRef = storageRef(
        storage,
        `uploads/${auth.currentUser.uid}/${sanitizedFileName}`
      );

      const uploadTask = uploadBytesResumable(fileStorageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const fileProgress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setFileProgresses((prev) => ({
            ...prev,
            [sanitizedFileName]: fileProgress,
          }));
        },
        (error) => {
          console.error('Error uploading file:', error);
          setError(error);
          setLoading(false);
        },
        async () => {
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
    }
  };

  const removeFile = async (file) => {
    try {
      const fileStorageRef = storageRef(
        storage,
        `uploads/${auth.currentUser.uid}/${file.name}`
      );
      const fileDbRef = dbRef(
        database,
        `uploads/${auth.currentUser.uid}/${file.name}`
      );

      await remove(fileDbRef);
      await deleteObject(fileStorageRef);

      setFiles((prevFiles) => prevFiles.filter((f) => f.name !== file.name));
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  const removeAllFiles = async () => {
    try {
      const deletePromises = files.map(async (file) => {
        const fileStorageRef = storageRef(
          storage,
          `uploads/${auth.currentUser.uid}/${file.name}`
        );
        const fileDbRef = dbRef(
          database,
          `uploads/${auth.currentUser.uid}/${file.name}`
        );

        await remove(fileDbRef);
        await deleteObject(fileStorageRef);
      });

      await Promise.all(deletePromises);

      setFiles([]);
    } catch (error) {
      console.error('Error deleting all files:', error);
    }
  };

  const downloadFiles = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        setDownloadInProgress(true);
        const sFiles = selectedFiles.map((file) => ({
          ...file,
          path: `uploads/${user.uid}/${file.name}`,
        }));

        const response = await axios.post(
          `${FILES_URL}/user/${user.uid}/zipped`,
          { files: sFiles }
        );

        const { data } = response;
        if (data.zipUrl) {
          const link = document.createElement('a');
          link.href = data.zipUrl;
          link.download = 'files.zip';
          link.click();
        }
      } catch (error) {
        console.error('Error downloading files:', error);
      } finally {
        setDownloadInProgress(false);
      }
    }
  };

  const shortenUrl = async (alteredKey) => {
    try {
      const response = await axios.post('https://api-ssl.bitly.com/v4/shorten', {
        long_url: `https://crosscopy.dev/shared/${alteredKey}`,
      }, {
        headers: {
          Authorization: `Bearer 869543bef6fa765330ed2c169da6b4773a252e8e`,
          'Content-Type': 'application/json',
        },
      });

      return response.data.link;
    } catch (error) {
      console.error('Error shortening URL:', error);
    }
  };

  const handleShareClick = async (filesToShare, e) => {
    e.preventDefault();

    const newRef = push(dbRef(database, `shared`));

    const filesWithTimestamp = {
      ...filesToShare,
      uploadTimestamp: Date.now(),
      uid: auth.currentUser.uid,
      shareCode: Math.floor(Math.random() * 100000 + 1),
    };

    try {
      await set(newRef, filesWithTimestamp);

      const uniqueKey = newRef.key;
      const alteredKey = uniqueKey.replace(/-/g, '');

      const shortenedUrl = await shortenUrl(alteredKey);

      setFileURL(shortenedUrl);

      if (mobile) {
        setOpen(true);
      } else {
        setShowModal(true);
      }
    } catch (error) {
      console.error('Error sharing files:', error);
    }
  };

  const handleNativeShare = () => {
    if (navigator.share && fileURL) {
      navigator.share({
        title: 'Share files',
        text: 'Check out these files!',
        url: fileURL,
      }).then(() => {
        console.log('Successful share');
      }).catch((error) => {
        console.error('Error sharing', error);
      });
    } else {
      setShowModal(true);
    }
  };

  return {
    loading,
    error,
    uploadProgress,
    fileProgresses,
    selectedFiles,
    downloadInProgress,
    showModal,
    fileURL,
    showSettings,
    isOpen,
    fileContainerRef,
    setError,
    setOpen,
    setShowSettings,
    setSelectedFiles,
    onDrop,
    removeFile,
    removeAllFiles,
    downloadFiles,
    handleShareClick,
    handleNativeShare,
  };
};
