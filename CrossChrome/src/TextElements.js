import { motion } from 'framer-motion';
import styled from 'styled-components';
import ReactQuill from 'react-quill';
import { BsClipboard2, BsClipboard2Check } from 'react-icons/bs';
import { FiXCircle, FiLogOut } from 'react-icons/fi';

export const Container = styled(motion.div)`
  display: flex;
  position: relative;
  flex: 1;
  max-height: 400px;
  width: 100%;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  margin-bottom: 0px;
`;
export const SubContainer = styled(motion.div)`
  display: flex;
  flex: 1;
  max-height: 400px;
  width: 100%;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  margin-bottom: 0px;
`;

export const ButtonContainer = styled(motion.div)`
  display: flex;
  width: 100%;
  padding-left: 20px;
  margin-right: 20px;
  height: 30px;
  align-items: center;
  border-bottom: 1px solid transparent;
  border-image: radial-gradient(circle, #b9b9b9 50%, #242424 100%) 1;
`;

export const Button = styled.button`
  margin-left: 10px;
  margin-right: 10px;
  display: flex;
  flex: ${(props) => (props.selected === props.id ? '1' : 'none')};
  padding: 4px 10px;

  border: none;
  background: none;
  color: #ffffff;
  cursor: pointer;
  border: ${(props) => (props.selected === props.id ? '1px solid #646cff' : 'none')};

  border-radius: 4px;
  font-weight: 400;
  font-size: 12px;

  transition: all 0.3s ease;
  &:hover {
    background: #4c4c4c;
    /* color: black; */
  }
`;

export const QuillContainer = styled(motion.div)`
  display: flex;
  flex: 1;
  height: 100%;
  width: 100%;
  margin-top: 2px;
`;

export const StyledQuill = styled(ReactQuill)`
  flex: 1;
  width: 100%;
  max-width: 100%;
  max-height: 100%;

  color: white;
  margin-bottom: 0px;

  .ql-toolbar {
    display: none;
  }
  .ql-editor {
    height: 100%;
    color: rgba(255, 255, 255, 1); /* white text with 80% opacity */
    /* border: 1px solid blue; */

    font-family: 'Avenir', 'Courier', 'Monaco', 'Menlo', 'Consolas';
    font-size: 13px;
    opacity: 1;
    font-weight: 400;

    border: none;

    padding: 5px 8px;
    padding-bottom: 100px;

    white-space: nowrap; /* Prevents text wrapping */

    overflow: auto; /* Allows horizontal scrolling when the text overflows */

    &::-webkit-scrollbar {
      display: none;
    }

    /* Hide scrollbar for Firefox */
    scrollbar-width: 10px;
    -ms-overflow-style: none; /* IE and Edge */
  }
  .ql-container {
    height: 100%;
    border: none;
  }
`;

export const BottomBar = styled.div`
  display: flex;
  position: absolute;
  bottom: 0;

  z-index: 1;
  width: 100%;
  /* height: 20px; */
  background: #3b3b3b;
  padding: 3px;
  border: 1px solid #6b6b6b;
  align-items: center;
  justify-content: flex-end;
`;

export const Clipboard = styled(BsClipboard2)`
  margin-right: 5px;
  color: #a9a9a9;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    color: #646cff;
    cursor: pointer;
  }
`;

export const ClipboardCheck = styled(BsClipboard2Check)`
  margin-right: 5px;
  color: #15ff00;
  /* cursor: pointer; */
`;

export const LogOut = styled(FiLogOut)`
  margin-right: 5px;
  color: #a9a9a9;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    color: #646cff;
    cursor: pointer;
  }
`;
export const Clear = styled(FiXCircle)`
  margin-right: 5px;
  color: #a9a9a9;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    color: #c9152a;
    cursor: pointer;
  }
`;
