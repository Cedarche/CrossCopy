import React, { useState, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import 'react-quill/dist/quill.snow.css'; // import the styles
import TextSection from './Text';
const FileDropzone = lazy(() => import('./Files'));
const Settings = lazy(() => import('./Settings'));
const History = lazy(() => import('./History'));

export default function HomePage() {
  const [selected, setSelected] = useState('Text');

  function componentSwtich(component) {
    switch (component) {
      case 'Text':
        return <TextSection />;
      case 'History':
        return <History />;
      case 'Files':
        return <FileDropzone />;
      case 'Settings':
        return <Settings />;
      default:
        return setErrorMessage('An error occurred');
    }
  }

  return (
    <SubContainer
      key="subcontainer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
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
  padding-bottom: 3px;

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
  color: #ffffff;
  cursor: pointer;
  border: ${(props) => (props.selected === props.id ? '1px solid #646cff' : 'none')};

  border-radius: 4px;
  font-weight: 400;
  font-size: 12px;

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
