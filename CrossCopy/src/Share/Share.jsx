import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { storage, auth, Signout, trackViews } from "../firebase";
import { FiFilePlus, FiShare, FiDownloadCloud } from "react-icons/fi";

import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FiAlertTriangle, FiCheckCircle } from "react-icons/fi";
import axios from "axios";

import { Container, Header } from "../Home/HomeElements";
import { getDatabase, ref, get } from "firebase/database";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import {
  FileItem,
  InfoContainer,
  FilesContainer,
  FileDataContainer,
  FileName,
  CenterContainer,
  Spinner,
  spinner,
  ProgressBarContainer,
  DownloadBar,
  Modal,
} from "../Home/FilesElements";
import AuthModal from "../Auth/AuthModal";
import ErrorModal from "./ErrorModal";
import {
  Heading,
  ButtonContainer,
  Button,
  BottomButton,
  BottomContainer,
} from "../Home/HomeElements";

const FILES_URL = import.meta.env.VITE_FILES_URL;

export default function Share() {
  const [downloadInProgress, setDownloadInProgress] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showErrorModal, setErrorShowModal] = useState(false);
  const [isLoginError, setIsLoginError] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [files, setFiles] = useState([]);
  const [sharedUid, setShareUid] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadTime, setUploadTime] = useState(null);
  const [remainingTime, setRemainingTime] = useState(null);

  const navigate = useNavigate();
  const { uniqueKey } = useParams();
  const cancelTokenSourceRef = useRef(null);

  const updateRemainingTime = () => {
    if (uploadTime) {
      const MILLISECONDS_IN_AN_HOUR = 3600000;
      const MILLISECONDS_IN_A_MINUTE = 60000;

      const expirationTime = uploadTime + 72 * MILLISECONDS_IN_AN_HOUR;
      const remainingTimeMs = expirationTime - Date.now();

      const remainingHours = Math.floor(
        remainingTimeMs / MILLISECONDS_IN_AN_HOUR
      );
      const remainingMinutes = Math.floor(
        (remainingTimeMs % MILLISECONDS_IN_AN_HOUR) / MILLISECONDS_IN_A_MINUTE
      );

      const formattedTime = `${String(remainingHours).padStart(
        2,
        "0"
      )}hrs ${String(remainingMinutes).padStart(2, "0")}min`;
      setRemainingTime(formattedTime);
    }
  };

  useEffect(() => {
    updateRemainingTime();
    const timerId = setInterval(updateRemainingTime, 60000);

    return () => {
      clearInterval(timerId);
    };
  }, [uploadTime]);

  useEffect(() => {
    trackViews("SharedFiles");

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        setShowModal(false);
      } else {
        setUser(null);
      }
    });

    if (uniqueKey) {
      setLoading(true);
      const db = getDatabase();
      const textKey = "-" + uniqueKey;
      const sharedFilesRef = ref(db, `shared/${textKey}`);

      get(sharedFilesRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            let paramFiles = snapshot.val();

            const extractedFiles = Object.values(paramFiles).filter(
              (item) =>
                typeof item === "object" && item.name && item.size && item.url
            );

            setFiles(extractedFiles);
            if (paramFiles.uid) {
              setShareUid(paramFiles.uid);
            }
            if (paramFiles.uploadTimestamp) {
              setUploadTime(paramFiles.uploadTimestamp);
            }
            // setFiles(paramFiles);
            setLoading(false);
          } else {
            console.log(error);
            console.error("No data available");
            setError(
              "No data available. Shared files are only available for 72hrs."
            );
            setLoading(false);
          }
        })
        .catch((error) => {
          console.error(error);
          setError("Somethign went wrong...");
        });
      return () => unsubscribe();
    }
  }, [auth.currentUser]);

  const downloadFiles = async () => {
    if (selectedFiles.length > 0) {
      cancelTokenSourceRef.current = axios.CancelToken.source();
      try {
        setDownloadInProgress(true);
        const sFiles = selectedFiles.map((file) => ({
          name: file.name,
          path: `uploads/${sharedUid}/${file.name}`,
        }));
        const response = await axios.post(
          `${FILES_URL}/user/zipped`,
          {
            files: sFiles,
            sharedUid: sharedUid,
          },
          {
            cancelToken: cancelTokenSourceRef.current.token, // Use the cancel token from the reference
          }
        );
        const { data } = response;
        if (data.zipUrl) {
          // If the server returns a URL for the zip file, download it
          const link = document.createElement("a");
          link.href = data.zipUrl;
          link.download = "files.zip";
          link.click();
        }

        // Set download as complete only if it was not canceled
        setDownloadComplete(true);
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("Download was canceled:", error.message);
        } else {
          console.log(error);
          setError("Something went wrong...");
        }
      } finally {
        setError(null);
        setDownloadInProgress(false);
      }
    } else {
      console.log("Something went wrong");
      setErrorShowModal(true);
    }
  };

  const handleCancelDownload = () => {
    // Call the cancel method on the token stored in the reference
    if (cancelTokenSourceRef.current) {
      cancelTokenSourceRef.current.cancel("Download canceled by the user.");
    }
  };

  const handleFileSelection = (file) => {
    setDownloadComplete(false);
    if (selectedFiles.find((f) => f.name === file.name)) {
      setSelectedFiles(selectedFiles.filter((f) => f.name !== file.name));
    } else {
      setSelectedFiles([...selectedFiles, file]);
    }
  };

  const handleSelectAll = () => {
    setSelectedFiles([...files]);
  };

  return (
    <AnimatePresence mode="wait">
      {showModal && (
        <Modal
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowModal(false);
            }
          }}
        >
          <AuthModal onClose={() => setShowModal(false)} />
        </Modal>
      )}
      {showErrorModal && (
        <Modal
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setErrorShowModal(false);
            }
          }}
        >
          <ErrorModal
            onClose={() => setErrorShowModal(false)}
            showAuth={setShowModal}
          />
        </Modal>
      )}

      <Container
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <H1 onClick={() => navigate("/home")}>CROSS COPY</H1>
        <DownloadContainer>
          <Heading style={{ marginLeft: "0px" }}>
            Shared with you
            <ButtonContainer>
              {selectedFiles.length > 0 && (
                <Button onClick={downloadFiles}>Download</Button>
              )}
              <Button onClick={handleSelectAll}>Select All</Button>
            </ButtonContainer>
          </Heading>
          <ProgressBarContainer>
            <DownloadBar
              animate={{ width: downloadInProgress ? "100%" : "0%" }}
              transition={{ duration: 0.5, yoyo: Infinity }}
              downloadProgress={downloadInProgress ? 100 : 0}
            />
          </ProgressBarContainer>
          {error ? (
            <CenterContainer
              style={{ flexDirection: "column", marginTop: 0, height: "50px" }}
            >
              <FiAlertTriangle size={35} color={"#ff9100"} />
              {isLoginError ? (
                <SubHeader>
                  Please{" "}
                  <a
                    href="https://crosscopy.dev"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    login
                  </a>{" "}
                  first then try again.
                </SubHeader>
              ) : (
                <SubHeader>{error}</SubHeader>
              )}
            </CenterContainer>
          ) : files.length > 0 ? (
            <FilesContainer style={{ height: "100%" }}>
              <LayoutGroup>
                <AnimatePresence>
                  {files.map((file, index) => (
                    <FileI
                      file={file}
                      index={index}
                      selectedFiles={selectedFiles}
                      handleFileSelection={handleFileSelection}
                      // handleShareClick={handleShareClick}
                      key={file.name}
                    />
                  ))}
                </AnimatePresence>
              </LayoutGroup>
              <BottomSection>
                Shared files will be available for {remainingTime}.
              </BottomSection>
            </FilesContainer>
          ) : (
            <FilesContainer
              style={{
                height: "80px",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Spinner animate={spinner.loop} />
            </FilesContainer>
          )}

          <AnimatePresence mode="wait">
            {downloadInProgress && (
              <DownloadInfoContainer
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <SubHeader>Downloading selected files...</SubHeader>
                <InfoHeader>
                  Please wait, this may take some time depending on file sizes.
                </InfoHeader>
                <Spinner animate={spinner.loop} />
                <BottomButton
                  style={{
                    marginLeft: "0px",
                    marginTop: "12px",
                    color: "#ff5404",
                  }}
                  onClick={handleCancelDownload} // Call the cancel function when the button is clicked
                >
                  Cancel
                </BottomButton>
              </DownloadInfoContainer>
            )}
            {downloadComplete && (
              <DownloadInfoContainer
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <SubHeader>Download complete.</SubHeader>
                <InfoHeader></InfoHeader>

                <FiCheckCircle size={35} color={"#66ff00"} />
                <BottomButton
                  onClick={() => setDownloadComplete(false)}
                  style={{
                    marginLeft: "0px",
                    marginTop: "8px",
                    color: "#66ffff",
                  }}
                >
                  Dismiss
                </BottomButton>
              </DownloadInfoContainer>
            )}
          </AnimatePresence>
        </DownloadContainer>
        <BottomContainer
          style={{
            width: "100%",

            flexDirection: "row",
          }}
        >
          {user ? (
            <BottomButton
              onClick={() => Signout("Are you sure you want to sign out?")}
            >
              Sign out
            </BottomButton>
          ) : (
            <BottomButton onClick={() => setShowModal(true)}>
              Sign in / Sign up
            </BottomButton>
          )}

          <BottomButton onClick={() => navigate("/privacy")}>
            Privacy Policy
          </BottomButton>
        </BottomContainer>
      </Container>
    </AnimatePresence>
  );
}

function truncateFileName(fileName) {
  // Split the file name into name and extension
  const splitName = fileName.split(".");
  const extension = splitName.pop();
  let name = splitName.join(".");

  // If the name is longer than 30 characters, truncate it
  if (name.length > 28) {
    name = `${name.substring(0, 25)}(...)`;
  }

  // Return the truncated name with the extension
  return `${name}.${extension}`;
}

const FileI = ({ file, index, handleFileSelection, selectedFiles }) => {
  const isSelected = selectedFiles.includes(file);

  return (
    <FileItem
      layout
      transition={{ duration: 0.3 }}
      key={file.name}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ x: -40, opacity: 0, overflow: "hidden" }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      isSelected={selectedFiles.includes(file)}
    >
      <a href={file.url} target="_blank" rel="noopener noreferrer">
        <InfoContainer>
          <FileName>{truncateFileName(file.name.replace(/_/g, "."))}</FileName>
          <FileDataContainer>
            <span
              style={{
                fontSize: "10px",
                paddingRight: "4px",
                fontWeight: 400,
                color: "lightblue",
              }}
            >
              {" "}
              {file.size / 1000 < 1000
                ? (file.size / 1000).toFixed(2) + "KB"
                : (file.size / 1000000).toFixed(2) + "MB"}
            </span>
            <span>|</span>
            <span
              style={{
                fontSize: "10px",
                paddingLeft: "4px",
                fontWeight: 300,
                color: "#00f7ff",
              }}
            >
              {formatTimestamp(file.uploadTimestamp)}
            </span>
          </FileDataContainer>
        </InfoContainer>
      </a>

      <Circle
        onClick={() => handleFileSelection(file)}
        isSelected={selectedFiles.includes(file)}
      />
    </FileItem>
  );
};

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let seconds = date.getSeconds();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;
  const strTime =
    (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) +
    "/" +
    (date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1) +
    "/" +
    date.getFullYear() +
    ", " +
    hours +
    ":" +
    minutes +
    ":" +
    seconds +
    " " +
    ampm;
  return strTime;
};

const DownloadContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 90%;

  height: auto;
  min-height: 600px;
  border: 1px solid #cadaef; // Light blue border
  border-radius: 4px;
  background: #3b3b3b; // Dark background
  @media screen and (max-width: 2000px) {
    max-width: 370px;
  }
`;

const H1 = styled(Header)`
  cursor: pointer;
  font-size: 30px;
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

const Circle = styled.div`
  width: 17px;
  height: 17px;
  border-radius: 50%;
  border: 1px solid lightgrey;
  background: ${(props) => (props.isSelected ? "#62ff00" : "#3b3b3b")};
  margin-right: 8px;
  margin-top: 4px;
  cursor: pointer;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 6px 12px -2px,
    rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;
  transition: all 0.3s ease;

  &:hover {
    background-color: #62ff00;
    scale: 1.1;
  }
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

const BottomSection = styled(motion.div)`
  display: flex;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  padding: 5px;
`;
