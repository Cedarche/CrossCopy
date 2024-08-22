import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { auth, database, ref, onValue, remove } from '../firebase';
import { motion, LayoutGroup } from 'framer-motion';
import { FiX, FiChevronDown, FiChevronUp, FiBook } from 'react-icons/fi';
import { BsClipboard2, BsClipboard2Check } from 'react-icons/bs';
import { CiViewTimeline } from 'react-icons/ci';
import { htmlToText } from 'html-to-text';
import ReactQuill from 'react-quill';
import axios from 'axios';
import Linkify from 'react-linkify';
import { Heading, Button, ButtonContainer } from './HomeElements';

const Chevron = styled(FiChevronDown)`
  display: block;
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  cursor: pointer;
`;
const ChevronUp = styled(FiChevronUp)`
  display: block;
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  cursor: pointer;
`;

function History({ mobile, history, setHistory }) {
  const handleClearHistory = async () => {
    const user = auth.currentUser;

    if (user && window.confirm('Are you sure you want to delete your paste history?')) {
      try {
        // Delete the history from the database
        const historyRef = ref(database, `users/${user.uid}/history`);
        await remove(historyRef);

        // Update the local state
        setHistory([]);
      } catch (error) {
        console.error('Failed to clear history:', error);
      }
    }
  };

  return (
    <>
      <HistoryContainer
        key="history"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <LayoutGroup>
          {history &&
            history.map((item, index) => (
              <motion.div layout key={index}>
                <HistoryItemList key={index} item={item} />
              </motion.div>
            ))}
        </LayoutGroup>
        {history && history.length === 0 && (
          <div
            style={{
              display: 'flex',
              width: '100%',
              height: '100%',
              alignItems: 'center',
              // justifyContent: 'center',
              paddingTop: '70px',
              flexDirection: 'column',
            }}
          >
            <CiViewTimeline size={25} style={{ marginBottom: '10px', lineWidth: '1px' }} />
            <span style={{ fontSize: '13px' }}>Your paste history will appear here </span>
          </div>
        )}
      </HistoryContainer>
      {mobile && (
        <Heading style={{ marginLeft: '0px' }}>
          History
          <ButtonContainer>
            <Button onClick={handleClearHistory}>Clear</Button>
          </ButtonContainer>
        </Heading>
      )}
    </>
  );
}

export default History;

function HistoryItemList({ item }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const itemRef = useRef(null);

  useEffect(() => {
    if (itemRef.current) {
      setIsOverflowing(itemRef.current.offsetHeight < itemRef.current.scrollHeight);
    }
  }, [item]);

  const handleClick = () => {
    setIsExpanded(!isExpanded);
  };

  const handleDelete = (e) => {
    e.stopPropagation(); // Prevent triggering click events on parent elements

    const user = auth.currentUser;
    if (user) {
      const historyRef = ref(database, `users/${user.uid}/history/${item.originalTimestamp}`);
      remove(historyRef);
    }
  };

  const handleCopy = (e) => {
    e.stopPropagation(); // Prevent triggering click events on parent elements
    setIsCopied(true);
    const plainText = htmlToText(item.text);

    navigator.clipboard
      .writeText(plainText)
      .then(() => {
        console.log('Text copied to clipboard');
      })
      .catch((err) => {
        console.error('Could not copy text: ', err);
      });
    setInterval(() => setIsCopied(false), 5000);
  };

  return (
    <HistoryItemContainer ref={itemRef} isExpanded={isExpanded} layout>
      <motion.div layout="position">
        <TopLine>
          <DateHeading>{item.timestamp}</DateHeading>
          <div>
            {isCopied ? <ClipboardCheck /> : <Clipboard onClick={handleCopy} />}

            <Close onClick={(e) => handleDelete(e, item.timestamp)} />
          </div>
        </TopLine>

        <TextContainer>
          <Linkify>{htmlToText(item.text)}</Linkify>
        </TextContainer>

        {/* <StyledQuill value={item.text} readOnly={true} /> */}
      </motion.div>
      {isOverflowing && (
        <>
          <GradientOverlay onClick={handleClick} />

          {isExpanded ? <ChevronUp onClick={handleClick} /> : <Chevron onClick={handleClick} />}
        </>
      )}
    </HistoryItemContainer>
  );
}

const HistoryContainer = styled(motion.div)`
  width: 100%;
  height: 100%;
  overflow: auto;
  /* padding: 20px; */
  box-sizing: border-box;
  /* Hide scrollbar for Chrome, Safari and Opera */
  &::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for Firefox */
  scrollbar-width: none;
  -ms-overflow-style: none; /* IE and Edge */
`;

const HistoryItemContainer = styled(motion.div)`
  position: relative;
  border: 1px solid transparent;
  border-bottom: 1px solid #7e7e7e;
  padding: 12px;
  max-height: ${(props) => (props.isExpanded ? 'auto' : '150px')};
  overflow: hidden;
  &::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for Firefox */
  scrollbar-width: none;
  -ms-overflow-style: none; /* IE and Edge */
  @media screen and (max-width: 420px) {
    padding: 10px;
  }
  padding-bottom: ${(props) => (props.isExpanded ? '40px' : '20px')};
`;

const TextContainer = styled.div`
  height: 100%;
  color: #d3d3d3; /* white text with 80% opacity */
  /* font-family: 'Courier', 'Courier', 'Monaco', 'Menlo', 'Consolas'; */
  font-size: 11px;
  font-weight: 500;
  /* padding-bottom: 100px; */
  border: none;
  padding: 8px 0px;
  /* padding-right: 8px; */
  overflow: auto;
  &::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for Firefox */
  scrollbar-width: none;
  -ms-overflow-style: none; /* IE and Edge */
`;

const GradientOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50px;
  cursor: pointer;
  background: linear-gradient(to bottom, rgba(36, 36, 36, 0) 0%, rgba(36, 36, 36, 1) 100%);
`;

const TopLine = styled.div`
  display: flex;
  flex: 1;
  width: 100%;
  align-items: center;
  justify-content: space-between;
`;

const DateHeading = styled.h2`
  font-size: 14px;
  padding: 0px;
  margin: 0px;
  font-weight: 500;
  line-height: 16px;
  color: #ccfffe;
`;

const Clipboard = styled(BsClipboard2)`
  margin-top: 4px;
  margin-right: 8px;
  color: grey;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    color: #646cff;
    cursor: pointer;
  }
`;

const Close = styled(FiX)`
  cursor: pointer;
  color: grey;
  &:hover {
    color: #932d37;
    cursor: pointer;
  }
`;

const ClipboardCheck = styled(BsClipboard2Check)`
  margin-top: 4px;
  margin-right: 8px;
  color: #15ff00;
  /* cursor: pointer; */
`;

export const StyledQuill = styled(ReactQuill)`
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
    color: #d3d3d3; /* white text with 80% opacity */
    /* font-family: 'Courier', 'Courier', 'Monaco', 'Menlo', 'Consolas'; */
    font-size: 12px;
    font-weight: 500;
    /* padding-bottom: 100px; */
    border: none;
    padding: 8px 0px;
    /* color: white; */
  }
  .ql-container {
    height: 100%;
    border: none;
    padding: 0px;
  }
`;
