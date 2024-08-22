import React, { useState, Suspense, lazy, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import 'react-quill/dist/quill.snow.css'; // import the styles
import TextSection from './TextSection';
import FileDropzone from './Files';

// const Settings = lazy(() => import('./Settings'));
import Settings from './Settings';
import History from './History';
// const History = lazy(() => import('./History'));

export default function MobileHomePage({ mobile, files, setFiles, paidUser, history, setHistory }) {
  const [selected, setSelected] = useState('Text');
  // const [files, setFiles] = useState([]);
  // const [paidUser, setPaidUser] = useState(false);
  // const [history, setHistory] = useState([]);

  function componentSwtich(component) {
    switch (component) {
      case 'Text':
        return <TextSection mobile={mobile} />;
      case 'History':
        return <History mobile={mobile} history={history} setHistory={setHistory} />;
      case 'Files':
        return (
          <FileDropzone mobile={mobile} files={files} setFiles={setFiles} paidUser={paidUser} />
        );
      case 'Settings':
        return <Settings />;
      default:
        console.log('An error occurred');
        return setErrorMessage('An error occurred');
    }
  }

  return (
    <SubContainer
      key="subcontainer"
      // initial={{ opacity: 0 }}
      // animate={{ opacity: 1 }}
      // exit={{ opacity: 0 }}
    >
      <ButtonContainer>
        <Button
          onClick={() => setSelected('Text')}
          selected={selected}
          id={'Text'}
          style={{ marginRight: '2.5px' }}
        >
          Text
        </Button>
        <Button
          onClick={() => setSelected('History')}
          selected={selected}
          id={'History'}
          style={{ marginRight: '2.5px' }}
        >
          History
        </Button>
        <Button
          onClick={() => setSelected('Files')}
          selected={selected}
          id={'Files'}
          style={{ marginLeft: '2.5px', marginRight: '2.5px' }}
        >
          Files
        </Button>
        <Button
          onClick={() => setSelected('Settings')}
          selected={selected}
          id={'Settings'}
          style={{ marginLeft: '2.5px' }}
        >
          Settings
        </Button>
      </ButtonContainer>
      <Suspense
        fallback={<SpinnerContainer>{/* <Spinner animate={spinner.loop} /> */}</SpinnerContainer>}
      >
        <AnimatePresence mode="sync">{componentSwtich(selected)}</AnimatePresence>
      </Suspense>
    </SubContainer>
  );
}

export const SubContainer = styled(motion.div)`
  display: flex;
  width: 60%;
  height: 82%;
  border: 1px solid #cadaef; // Light blue border
  border-radius: 4px;
  /* background: #3b3b3b; // Dark background */
  background: #3b3b3b; // Dark background

  flex-direction: row;
  overflow: auto;
  transition: all 0.2s; // Smooth transition for hover effect
  box-shadow: 3px 3px 0px rgba(0, 234, 255, 0.2), 6px 6px 0px rgba(0, 234, 255, 0.2); // Light "glowing" box shadow
  z-index: 5;
  /* Hide scrollbar for Chrome, Safari and Opera */
  &::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for Firefox */
  scrollbar-width: none;
  -ms-overflow-style: none; /* IE and Edge */

  @media screen and (max-width: 1200px) {
    transition: 0.8s all ease;
    flex-direction: column;
    min-width: 95%;
    height: 85%;
  }

  @media screen and (max-width: 1500px) {
    transition: 0.8s all ease;
    width: 70%;
  }

  @media screen and (max-width: 420px) {
    min-width: 95%;
    height: 88%;
  }
`;

export const ButtonContainer = styled(motion.div)`
  display: flex;
  width: 100%;
  /* padding-left: 20px; */
  /* margin-right: 20px; */
  height: 30px;
  align-items: center;
  padding-bottom: 4px;
  padding-top: 3px;

  border-bottom: 1px solid #6b6b6b;
`;

export const Button = styled.button`
  margin-left: 5px;
  margin-right: 5px;
  display: flex;
  flex: ${(props) => (props.selected === props.id ? '1' : 'none')};
  padding: 4px 10px;

  border: none;
  background: #474747;
  background: #66ffff;
  background: ${(props) => (props.selected === props.id ? ' #474747' : '#66ffff')};
  color: #ffffff;
  color: #242424;
  color: ${(props) => (props.selected === props.id ? ' #ffffff' : '#242424')};
  cursor: pointer;
  border: ${(props) => (props.selected === props.id ? '1px solid #646cff' : 'none')};

  border-radius: 4px;
  font-weight: 400;
  font-size: 13px;

  transition: all 0.3s ease;
  &:hover {
    background: #5a5a5a;
  }
`;

const SpinnerContainer = styled.div`
  display: flex;
  flex: 1;
  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

const Spinner = styled(motion.div)`
  border: 2px solid rgba(0, 0, 0, 0.1);
  width: 25px;
  height: 25px;
  border-left-color: #66ffff;
  border-radius: 50%;
`;

const spinner = {
  loop: {
    rotate: 360,
    transition: {
      duration: 1,
      ease: 'linear',
      repeat: Infinity,
    },
  },
};
