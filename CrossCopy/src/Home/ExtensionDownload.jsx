import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { storage, auth, database } from '../firebase';
import { useLocation } from 'react-router-dom';
import { FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';
import axios from 'axios';
import { Container, Header, BottomButton } from './HomeElements';
import { motion } from 'framer-motion';
import { CenterContainer, Spinner, spinner } from './FilesElements';

const FILES_URL = import.meta.env.VITE_FILES_URL;

export default function ExtensionDownload() {
  const [downloadInProgress, setDownloadInProgress] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);
  const [isLoginError, setIsLoginError] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add a loading state
  const [authLoading, setAuthLoading] = useState(true);

  const cancelTokenSourceRef = useRef(null);

  const location = useLocation();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setAuthLoading(false);
      setLoading(false); // Set loading to false once Firebase returns the user's auth status
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (authLoading) return;
    const query = new URLSearchParams(location.search);
    const fileNames = query.get('files') ? query.get('files').split(',') : [];
    if (fileNames.length > 0 && user) {
      setError('');
      setIsLoginError(false);
      setDownloadComplete(false);
      setDownloadInProgress(true);
      downloadFiles(fileNames);
    } else if (!user) {
      setError('Please login first then try again.');
      setIsLoginError(true);
    } else {
      setError('No files to download.');
    }
  }, [user, loading, authLoading]);

  function renderErrorMessage() {
    if (error.length > 0) {
      if (isLoginError) {
        return (
          <SubHeader>
            Please{' '}
            <a href="https://crosscopy.dev" target="_blank" rel="noopener noreferrer">
              login
            </a>{' '}
            first then try again.
          </SubHeader>
        );
      } else {
        return <SubHeader>{error}</SubHeader>;
      }
    }
    return null;
  }

  const downloadFiles = async (fileNames) => {
    if (user) {
      cancelTokenSourceRef.current = axios.CancelToken.source();

      try {
        const sFiles = fileNames.map((name) => ({
          name,
          path: `uploads/${user.uid}/${name}`,
        }));
        console.log(sFiles);
        const response = await axios.post(
          `${FILES_URL}/user/${user.uid}/zipped`,
          {
            files: sFiles,
          },
          {
            cancelToken: cancelTokenSourceRef.current.token, // Use the cancel token from the reference
          }
        );
        const { data } = response;
        if (data.zipUrl) {
          // If the server returns a URL for the zip file, download it
          const link = document.createElement('a');
          link.href = data.zipUrl;
          link.download = 'files.zip';
          link.click();
        }
        setDownloadComplete(true);
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log('Download was canceled:', error.message);
          setError('Download cancelled. Reload the page to try again.');
        } else {
          console.log(error);
          setError('Something went wrong...');
        }
      } finally {
        setDownloadInProgress(false);
      }
    }
  };

  const handleCancelDownload = () => {
    // Call the cancel method on the token stored in the reference
    if (cancelTokenSourceRef.current) {
      cancelTokenSourceRef.current.cancel('Download canceled by the user.');
    }
  };

  if (loading) {
    return (
      <Container initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <Header style={{ fontSize: '30px' }}>CROSS COPY</Header>
        <DownloadContainer>
          <DownloadInfoContainer>
            <Spinner animate={spinner.loop} />
          </DownloadInfoContainer>
        </DownloadContainer>
      </Container>
    );
  }

  return (
    <Container initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Header style={{ fontSize: '30px' }}>CROSS COPY</Header>
      <DownloadContainer initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        {error.length > 0 && (
          <CenterContainer style={{ flexDirection: 'column', marginTop: 0, height: '50px' }}>
            <FiAlertTriangle size={35} color={'#ff9100'} />
            {renderErrorMessage()}
          </CenterContainer>
        )}
        {downloadInProgress && user && !error.length && (
          <DownloadInfoContainer>
            <SubHeader>Downloading selected files...</SubHeader>
            <InfoHeader>Please wait, this may take some time depending on file sizes.</InfoHeader>
            <div>
              <Spinner animate={spinner.loop} />
            </div>

            <BottomButton
              style={{ marginLeft: '0px', marginTop: '12px', color: '#ff5404' }}
              onClick={handleCancelDownload} // Call the cancel function when the button is clicked
            >
              Cancel
            </BottomButton>
          </DownloadInfoContainer>
        )}
        {downloadComplete && (
          <div>
            <SubHeader>Download complete.</SubHeader>
            <InfoHeader>You can now close this page.</InfoHeader>
            <CenterContainer style={{ flexDirection: 'column', marginTop: 0, height: '50px' }}>
              <FiCheckCircle size={35} color={'#66ff00'} />
            </CenterContainer>
          </div>
        )}
      </DownloadContainer>
    </Container>
  );
}

const DownloadContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 400px;
  height: 150px;
  border: 1px solid #cadaef; // Light blue border
  border-radius: 4px;
  background: #3b3b3b; // Dark background
`;

const DownloadInfoContainer = styled(motion.div)`
  display: flex;
  /* flex: 0.5; */
  min-height: 100px;
  padding-bottom: 20px;
  flex: 1;

  flex-direction: column;
  align-items: center;

  justify-content: center;
`;

const SubHeader = styled.h2`
  font-size: 16px;
  color: #dadada;
  text-align: center;
  margin-top: 20px;
  margin-bottom: 0px;
`;

const InfoHeader = styled.h4`
  font-size: 11px;
  color: #9a9a9a;
  text-align: center;
  margin-top: 0px;
  font-weight: 400;
`;
