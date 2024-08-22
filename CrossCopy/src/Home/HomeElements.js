import styled from 'styled-components';
import { BsClipboard2, BsClipboard2Check } from 'react-icons/bs';
import { motion, AnimatePresence } from 'framer-motion';
import ReactQuill from 'react-quill';

export const Container = styled(motion.div)`
  display: flex;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  flex: 1;
  background: #242424;
  flex-direction: column;
  flex: 1;
  width: 100%;
  /* min-height: 100%; */
  max-height: 100vh;
  /* border: 1px solid pink; */
  align-items: center;
  overflow: hidden;
  /* justify-content: center; */
  &::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for Firefox */
  scrollbar-width: none;
  -ms-overflow-style: none; /* IE and Edge */
`;

export const SubContainer = styled(motion.div)`
  display: flex;
  /* width: 60%; */
  width: 1150px;
  height: 82%;
  border: 1px solid #cadaef; // Light blue border
  border-radius: 4px;
  background: #3b3b3bc0; // Dark background
  /* background: #77777759; // Dark background */
  flex-direction: row;
  overflow: auto;
  transition: all 0.2s; // Smooth transition for hover effect
  box-shadow: 3px 3px 0px rgba(0, 234, 255, 0.2), 6px 6px 0px rgba(0, 234, 255, 0.2); // Light "glowing" box shadow
  /* backdrop-filter: blur(20px); */
  /* Hide scrollbar for Chrome, Safari and Opera */
  &::-webkit-scrollbar {
    display: none;
  }
  z-index: 2;
  /* Hide scrollbar for Firefox */
  scrollbar-width: none;
  -ms-overflow-style: none; /* IE and Edge */

  @media screen and (max-width: 1200px) {
    transition: 0.8s all ease;
    flex-direction: column;
    min-width: 90%;
    height: 85%;
    max-width: 1150px;
  }

  @media screen and (max-width: 1500px) {
    transition: 0.8s all ease;
    /* width: 70%; */
    max-width: 1150px;
  }

  @media screen and (max-width: 1280px) and (max-height: 700px) {
    max-width: 1000px;
  }
`;

export const TextSide = styled(motion.div)`
  display: flex;
  flex: 2;
  height: 100%;
  border-right: 1px solid #cadaef;
  /* padding: 20px; */
  flex-direction: column;
  align-items: flex-start;
  overflow-x: hidden;
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
  }
  /* Hide scrollbar for Firefox */
  scrollbar-width: none;
  -ms-overflow-style: none; /* IE and Edge */

  @media screen and (max-width: 960px) {
    transition: 0.8s all ease;
    min-height: 400px;
  }
`;

export const FileSide = styled(motion.div)`
  display: flex;
  flex: 1;
  height: 100%;
  /* padding: 20px; */
  flex-direction: column;
  align-items: flex-start;
  overflow-x: hidden;
  overflow-y: auto;


  .
`;

export const Heading = styled(motion.div)`
  position: sticky;
  top: 0px;
  box-sizing: border-box;
  display: flex;

  font-weight: 600;
  border-bottom: 1px solid #cadaef;
  width: 100%;
  text-align: left;
  padding: 10px;
  height: 43px;
  align-items: center;
  color: #66ffff;
  flex-direction: row;
  justify-content: space-between;

  @media screen and (max-width: 2000px) {
    border-top: 1px solid #cadaef;
    font-size: 13px;
  }
`;

export const ButtonContainer = styled(motion.div)`
  display: flex;
`;

export const Button = styled.button`
  margin-left: 10px;
  padding: 2px 10px;
  box-sizing: border-box;
  border: none;
  background: #66ffff;
  color: #242424;
  cursor: pointer;
  border-radius: 4px;
  font-weight: 400;
  font-size: 12px;
  transition: all 0.3s ease;

  &:hover {
    color: #${(props) => (props.share === 'true' ? '#646cff' : '#242424')};

    cursor: pointer;
  }
`;

export const QuillContainer = styled(motion.div)`
  display: flex;
  flex: 1;
  height: 100%;
  width: 100%;
`;

export const StyledQuill = styled(ReactQuill)`
  flex: 1;
  width: 100%;
  max-width: 100%;
  max-height: 100%;
  border: none;
  color: white;

  &::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for Firefox */
  scrollbar-width: none;
  -ms-overflow-style: none; /* IE and Edge */
  .ql-toolbar {
    display: ${(props) => (props.showToolbar ? 'block' : 'none')};
  }
  .ql-editor {
    height: 100%;
    color: rgba(255, 255, 255, 1); /* white text with 80% opacity */
    white-space: nowrap; /* Prevents text wrapping */

    font-family: 'Avenir', 'Courier', 'Monaco', 'Menlo', 'Consolas';
    font-size: 12px;
    font-weight: 500;
    padding-bottom: 100px;
    border: none;
    /* color: white; */
  }
  .ql-container {
    height: 100%;
    border: none;
  }
`;

export const Header = styled.h1`
  color: #66ffff;
  font-size: 40px;
  text-shadow: 3px 3px 0px rgba(0, 234, 255, 0.1), 6px 6px 0px rgba(0, 234, 255, 0.1);
  /* -webkit-text-stroke: 1px black; */

  @media screen and (max-width: 420px) {
    font-size: 30px;
  }

  @media screen and (max-width: 1280px) and (max-height: 700px) {
    font-size: 25px;
  }
`;

export const Clipboard = styled(BsClipboard2)`
  margin-right: 5px;
  color: black;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    color: #646cff;
    cursor: pointer;
  }
`;

export const ClipboardCheck = styled(BsClipboard2Check)`
  transition: all 0.2s;
  margin-right: 5px;
  color: #137d00;
`;

export const BottomContainer = styled(motion.div)`
  display: flex;
  width: 100%;
  max-height: 20px;
  margin-top: 10px;
  max-width: 1150px;
  align-items: center;
  justify-content: center;

  @media screen and (max-width: 1200px) {
    transition: 0.8s all ease;
    /* flex-direction: column; */
    min-width: 90%;
    height: 85%;
    max-width: 1150px;
  }

  @media screen and (max-width: 1500px) {
    transition: 0.8s all ease;
    /* width: 70%; */
    max-width: 1150px;
  }

  @media screen and (max-width: 1450px) and (max-height: 700px) {
    margin-top: 50px;
  }
`;

export const BottomButton = styled.button`
  margin-left: 10px;
  padding: 2px 10px;
  box-sizing: border-box;
  border: none;
  background: none;
  color: #fff;
  cursor: pointer;
  border-radius: 4px;
  font-weight: 400;
  font-size: 10px;
  transition: all 0.3s ease;

  &:hover {
    color: #646cff;
  }
`;
