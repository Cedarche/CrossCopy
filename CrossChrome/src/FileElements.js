import styled, { keyframes, css } from 'styled-components';
import { motion } from 'framer-motion';
import { FiX, FiFilePlus } from 'react-icons/fi';

export const FileItem = styled(motion.button)`
  position: relative; // Add relative positioning here
  z-index: 1;
  display: flex;
  flex: 1;
  justify-content: space-between;
  align-items: center;
  width: 95%;
  min-height: 48px;
  max-height: 48px;

  border: ${(props) => (props.isSelected ? '1px solid #ff6464' : '1px solid #767575')};
  outline: ${(props) => (props.isSelected ? ' 4px auto #646cff;' : 'none')};
  border-radius: 4px;
  margin-bottom: 8px;
  padding: 8px;
  background-color: #3b3b3b;
  color: #cadaef;
  font-size: 10px;
  margin: 4px;
  cursor: pointer;
  overflow: hidden;

  transition: opacity 0.3s ease;
`;

export const InfoContainer = styled(motion.div)`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;

  padding: 5px 0px;
`;

export const FileDataContainer = styled(motion.div)`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export const Close = styled(FiX)`
  cursor: pointer;
  color: #fff

  &:hover {
    color: #932d37;
    cursor: pointer;
  }
`;

export const CloseButton = styled.div`
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

export const FilesContainer = styled(motion.div)`
  display: flex;
  width: 100%;
  align-items: center;
  flex-direction: column;
  padding-top: 4px;
  overflow: auto;
  &::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for Firefox */
  scrollbar-width: none;
  -ms-overflow-style: none; /* IE and Edge */
`;

export const FileName = styled.span`
  font-size: 11.5px;
  overflow-wrap: break-word;
  word-break: break-all;

  text-align: left;

  inline-size: 250px;
`;
export const DropzoneContainer = styled(motion.div)`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
  border-width: 2px;
  border-radius: 2px;
  margin-top: -2px;
  padding: 10px;
  background-color: #3b3b3b;
  color: #bdbdbd;
  outline: none;
  transition: border 0.24s ease-in-out;
  min-height: 70px;
`;
export const AddFileContainer = styled(motion.div)`
  display: flex;
  flex: 1;
  min-width: 100%;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  flex-direction: ${(props) => (props.smallBox ? 'row' : 'column')};
  padding-top: ${(props) => (props.smallBox ? '0px' : '10px')};
  font-size: 12px;
  cursor: pointer;
  border: 1px solid transparent;

  border: 1px dashed lightgrey;
  border-radius: 2px;
  &:hover {
    background: #4c4c4c;
  }
`;
export const AddFileIcon = styled(FiFilePlus)``;

export const CenterContainer = styled(motion.div)`
  display: flex;
  box-sizing: border-box;
  flex: 1;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  min-height: 70px;
  flex-direction: column;

  overflow-x: hidden;
  &::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for Firefox */
  scrollbar-width: none;
  -ms-overflow-style: none; /* IE and Edge */
`;

export const Spinner = styled(motion.div)`
  border: 2px solid rgba(0, 0, 0, 0.1);
  width: 20px;
  height: 20px;
  border-left-color: #66ffff;
  border-radius: 50%;
`;

export const spinner = {
  loop: {
    rotate: 360,
    transition: {
      duration: 1,
      ease: 'linear',
      repeat: Infinity,
    },
  },
};

export const ProgressBarContainer = styled.div`
  width: 100%;
  height: 2px;
  /* background-color: #fe0000; */
  margin-top: 0px;
  /* margin-top: -2px; */
`;

export const ProgressBar = styled(motion.div)`
  background-color: ${(props) => (props.uploadProgress > 0 ? '#00ff00' : 'transparent')};
  height: 2px;
  width: 0;
`;

export const BContainer = styled(motion.div)`
  flex: 1;
  display: flex;
  border-top: 1px solid #434343;
  z-index: 2;
  align-items: flex-end;
  width: 100%;
  box-sizing: border-box;

  padding: 8px;
  background-color: #3b3b3b;
  color: #bdbdbd;
  outline: none;
  transition: border 0.24s ease-in-out;
`;

export const DButton = styled(motion.button)`
  display: flex;
  flex: 1;
  height: 30px;
  max-height: 30px;
  /* height: 80%; */
  background-color: #434343;
  border: 1px solid #959595;
  font-size: 11px;
  margin: 2px 2px;
  align-items: center;
  justify-content: center;
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
  background-color: ${(props) => (props.downloadProgress > 0 ? '#ff00d9' : 'transparent')};
  height: ${(props) => (props.downloadProgress > 0 ? '1px' : '0')};
  margin-top: -1px;
  width: 0;
  transition: background-color 0.2s ease;
  ${(props) =>
    props.downloadProgress > 0 &&
    css`
      animation: ${progress} 1.5s linear infinite;
    `}
`;

export const SubHeader = styled.h3`
  font-size: 14px;
  color: #dadada;
  text-align: center;
  margin-top: 10px;
  margin-bottom: 10px;
  font-weight: 400;
`;
