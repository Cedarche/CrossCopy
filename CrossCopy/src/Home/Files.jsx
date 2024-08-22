import React from "react";
import { useDropzone } from "react-dropzone";
import { FiFilePlus, FiAlertTriangle } from "react-icons/fi";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";

import { Heading, ButtonContainer, Button } from "./HomeElements";
import ShareModal from "../Share/Sharemodal";
import Settings from "./Settings";
import Sheet from "react-modal-sheet";
import QRCode from "react-qr-code";
import { FileI } from "./FileItem";
import { useFileDropzone } from "../Hooks/useFileDropzone";

import {
  SubHeader,
  Close,
  SettingsIcon,
  DropzoneContainer,
  FilesContainer,
  AddTextContainer,
  CenterContainer,
  ErrorButton,
  Spinner,
  spinner,
  ProgressBarContainer,
  ProgressBar,
  DownloadBar,
  Modal,
  ShareContainer,
  ShareText,
} from "./FilesElements";

const FileDropzone = ({ mobile, files, setFiles, paidUser }) => {
  const {
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
  } = useFileDropzone(paidUser, files, setFiles);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

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
        <Heading style={{ marginLeft: "0px" }}>
          {showSettings ? "Settings" : "Files"}
          <ButtonContainer style={{ alignItems: "center" }}>
            {selectedFiles.length > 0 && (
              <Button onClick={(e) => handleShareClick(selectedFiles, e)}>
                Share
              </Button>
            )}
            {selectedFiles.length > 0 && (
              <Button onClick={downloadFiles}>Download</Button>
            )}
            {files.length > 0 && (
              <Button onClick={() => removeAllFiles()}>Clear All</Button>
            )}
            <SettingsIcon onClick={() => setShowSettings(!showSettings)} />
          </ButtonContainer>
        </Heading>
      )}
      {showSettings ? (
        <Settings />
      ) : (
        <div
          style={{
            display: "flex",
            flex: 1,
            justifyContent: "center",
            flexDirection: "column",
            width: "100%",
            overflowY: "auto",
          }}
        >
          <ProgressBarContainer>
            <ProgressBar
              animate={{ width: `${uploadProgress}%` }}
              transition={{ duration: 0.5 }}
              uploadProgress={uploadProgress}
            />
            <DownloadBar
              animate={{ width: downloadInProgress ? "100%" : "0%" }}
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
                      handleFileSelection={(f) =>
                        setSelectedFiles((prev) =>
                          prev.find(
                            (selectedFile) => selectedFile.name === f.name
                          )
                            ? prev.filter(
                                (selectedFile) => selectedFile.name !== f.name
                              )
                            : [...prev, f]
                        )
                      }
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
                <FiAlertTriangle size={35} color={"#ff9100"} />

                <SubHeader>{error.message}</SubHeader>
                <ErrorButton onClick={() => setError(null)}>
                  Try again
                </ErrorButton>
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
        <>
          <Heading style={{ marginLeft: "0px" }}>
            Files
            <ButtonContainer>
              {selectedFiles.length > 0 && (
                // <Button onClick={(e) => handleShareClick(selectedFiles, e)}>Share</Button>
                <Button onClick={(e) => handleShareClick(selectedFiles, e)}>
                  Share
                </Button>
              )}
              {selectedFiles.length > 0 && (
                <Button onClick={downloadFiles}>Download</Button>
              )}
              {files.length > 0 && (
                <Button onClick={() => removeAllFiles()}>Clear All</Button>
              )}
            </ButtonContainer>
          </Heading>
          <Sheet
            isOpen={isOpen}
            onClose={() => {
              setOpen(false), setSelectedFiles([]);
            }}
            snapPoints={[400, 0]}
          >
            <Sheet.Container
              style={{ backgroundColor: "#3b3b3b", paddingRight: 2 }}
            >
              <Sheet.Header />
              <Sheet.Content
                style={{
                  display: "flex",
                  width: "100%",
                  flex: 1,
                  alignItems: "center",
                  // justifyContent: "center",
                }}
              >
                <ShareContainer onClick={handleNativeShare}>
                  {fileURL ? (
                    <>
                      {" "}
                      <QRCode
                        size={200}
                        style={{
                          height: "auto",
                          maxWidth: "100%",
                          color: "blue",
                          // width: "100%",
                        }}
                        value={fileURL && fileURL}
                        bgColor="#3b3b3b"
                        fgColor="#ffffff"
                        // viewBox={`0 0 256 256`}
                      />
                      <ShareText>
                        Scan QR code or tap to share natively
                      </ShareText>
                    </>
                  ) : (
                    <div
                      style={{
                        height: 180,
                        width: 180,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Spinner animate={spinner.loop} />
                    </div>
                  )}
                </ShareContainer>
              </Sheet.Content>
            </Sheet.Container>
            <Sheet.Backdrop />
          </Sheet>
        </>
      )}
    </>
  );
};

export default FileDropzone;
