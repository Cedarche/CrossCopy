import styled, { keyframes, css } from "styled-components";
import { motion } from "framer-motion";
import { FiX, FiSettings } from "react-icons/fi";

export const SwipeContainer = styled(motion.div)`
  position: relative;
  width: 100%;
  display: flex;
  /* border: 1px solid white; */
  justify-content: center;
  align-items: center;
`;

export const FileItem = styled(motion.div)`
  position: relative; // Add relative positioning here
  z-index: 1;
  display: flex;
  flex: 1;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  min-height: 60px;
  max-height: 60px;
  border: 1px solid #cadaef;
  border: ${(props) =>
    props.isSelected ? "1px solid #646cff" : "1px solid #cadaef"};
  /* outline: ${(props) =>
    props.isSelected ? " 4px auto #646cff;" : "none"}; */
  border-radius: 4px;
  margin-bottom: 10px;
  padding: 8px;
  /* background-color: #3b3b3b; */
  background: #3b3b3bc0; // Dark background

  color: #cadaef;
  font-size: 12px;
  margin: 4px;
  /* cursor: pointer; */
  box-shadow: rgba(50, 50, 93, 0.25) 0px 6px 12px -2px,
    rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;
  /* box-shadow: 2px 2px 2px; */
  box-sizing: border-box;
  transition: all 0.3s ease;
  &:hover {
    background-color: #4c4c4c;
  }
`;

export const InfoContainer = styled(motion.div)`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  cursor: pointer;
  color: #dedede;

  padding: 5px 0px;
`;

export const Close = styled(FiX)`
  cursor: pointer;
  /* color: ${(props) => (props.visible ? "ff0000" : "grey")}; */
  color: #fff
  transition: all 0.3s ease;

  &:hover {
    color: #d20015;
    cursor: pointer;
  }
`;

export const SettingsIcon = styled(FiSettings)`
  cursor: pointer;
  margin-left: 8px;
  color: #fff;
  transition: all 0.3s ease;

  &:hover {
    color: #646cff;
    cursor: pointer;
  }
`;

export const CloseButton = styled(motion.div)`
  position: absolute;
  /* height: 100%; */
  border-radius: 4px;
  background: #ee5e5e;
  width: 200px;
  top: 5px;
  text-align: right;

  bottom: 5px;
  right: 11px;
  padding-right: 20px;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  font-size: 14px;
`;

export const DropzoneContainer = styled(motion.div)`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 100%;
  box-sizing: border-box;
  border-width: 2px;
  border-radius: 2px;
  margin-top: -2px;
  padding: 10px;
  background-color: #3b3b3b;
  background: #3b3b3bc0; // Dark background

  color: #bdbdbd;
  outline: none;
  transition: border 0.24s ease-in-out;
  min-height: 200px;
`;

export const FilesContainer = styled(motion.div)`
  display: flex;
  width: 100%;
  align-items: center;
  position: relative;
  flex-direction: column;
  padding-top: 4px;
  padding: 4px 8px;
  box-sizing: border-box;
  overflow: auto;
  overflow-x: hidden;
  &::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for Firefox */
  scrollbar-width: none;
  -ms-overflow-style: none; /* IE and Edge */
`;

export const FileName = styled.span`
  text-align: left;
  color: #dedede;
  font-size: 12.5px;
  /* inline-size: 250px; */
`;

export const FileDataContainer = styled(motion.div)`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export const AddTextContainer = styled(motion.div)`
  display: flex;
  flex: 1;
  min-width: 100%;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding-top: 30px;
  font-size: 12px;
  cursor: pointer;
  border: 1px solid transparent;

  border: 1px dashed lightgrey;
  border-radius: 4px;
  transition: all 0.3s ease;

  &:hover {
    background: #4c4c4c;
  }
`;

export const CenterContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  flex: 1;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;

  overflow-x: hidden;
`;

export const SubHeader = styled.h2`
  font-size: 14px;
  color: #dadada;
  text-align: center;
  margin-top: 20px;
  margin-bottom: 10px;
`;

export const ErrorButton = styled.button`
  font-size: 12px;
`;

export const Spinner = styled(motion.div)`
  border: 2px solid rgba(0, 0, 0, 0.1);
  width: 25px;
  height: 25px;
  border-left-color: #66ffff;
  border-radius: 50%;
`;

export const spinner = {
  loop: {
    rotate: 360,
    transition: {
      duration: 1,
      ease: "linear",
      repeat: Infinity,
    },
  },
};

export const ProgressBarContainer = styled(motion.div)`
  width: 100%;
  height: 2px;
  margin-top: 0px;
`;

export const ProgressBar = styled(motion.div)`
  background-color: ${(props) =>
    props.uploadProgress > 0 ? "#00ff00" : "transparent"};
  height: ${(props) => (props.uploadProgress > 0 ? "2px" : "0")};
  width: 0;
  transition: background-color 0.3s ease;
`;

const progress = keyframes`
  0% {
    width: 0;
    opacity: 1;
  }
  50% {
    width: 100%;
    opacity: 1;
  }
  100% {
    width: 100%;
    opacity: 0;
  }
`;
export const DownloadBar = styled(motion.div)`
  background-color: ${(props) =>
    props.downloadProgress > 0 ? "#f700ff" : "transparent"};
  height: ${(props) => (props.downloadProgress > 0 ? "2px" : "0")};
  width: 0;
  transition: background-color 0.3s ease;
  ${(props) =>
    props.downloadProgress > 0 &&
    css`
      animation: ${progress} 1.5s linear infinite;
    `}
`;

export const Modal = styled(motion.div)`
  position: fixed;
  z-index: 2;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ShareContainer = styled(motion.div)`
  display: flex;

  /* flex: 1; */
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 30px;
  border: 1px solid #26b8c3;
  border-radius: 12px;
`;

export const ShareText = styled(motion.h4)`
  font-size: 14px;
  color: #dadada;
  text-align: center;
  margin-top: 20px;
  margin-bottom: 0px;
`;
