import React from "react";
import { FiDownloadCloud, FiShare2 } from "react-icons/fi";
import {
  FileItem,
  InfoContainer,
  Close,
  FileDataContainer,
  FileName,
} from "./FilesElements";

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
      exit={{ x: -20, opacity: 0, overflow: "hidden" }} // tweaked exit animation
      onClick={() => handleFileSelection(file)}
      isSelected={selectedFiles.includes(file)}
    >
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

      <FiShare2
        onClick={(e) => handleShareClick([file], e)}
        size={17}
        style={{
          marginRight: "12px",
          marginTop: "0px",
          zIndex: 5,
          strokeWidth: 1,
          color: "#00ffee",
          cursor: "pointer",
        }}
      />

      <a href={file.url} target="_blank" rel="noopener noreferrer">
        <FiDownloadCloud
          size={17}
          style={{
            marginRight: "8px",
            marginTop: "4px",
            zIndex: 3,
            strokeWidth: 1,
            color: "#26ff00",
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
