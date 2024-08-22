import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import styled from 'styled-components';
import Linkify from 'react-linkify';
// import { auth, database, ref, onValue, remove } from '../firebase';
import { motion, LayoutGroup } from 'framer-motion';
import { FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { BsClipboard2, BsClipboard2Check } from 'react-icons/bs';
import { htmlToText } from 'html-to-text';
import ReactQuill from 'react-quill';

import { auth } from '../firebase';
import { API_URL } from './URL';
import axios from 'axios';

const Chevron = styled(FiChevronDown)`
  display: block;
  position: absolute;
  bottom: 2px;
  left: 50%;
  transform: translateX(-50%);
  cursor: pointer;
  color: #9c9c9c;
`;
const ChevronUp = styled(FiChevronUp)`
  display: block;
  position: absolute;
  bottom: 2px;
  left: 50%;
  transform: translateX(-50%);
  cursor: pointer;
  color: #9c9c9c;
`;

export default function History() {
  const [history, setHistory] = useState([]);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    const strTime =
      (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) +
      '/' +
      (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) +
      '/' +
      date.getFullYear() +
      ', ' +
      hours +
      ':' +
      minutes +
      ':' +
      seconds +
      ' ' +
      ampm;
    return strTime;
  };

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      axios
        .get(`${API_URL}/user/${user.uid}/history`)
        .then((response) => {
          const data = response.data;

          if (data) {
            // Sort the history by timestamp in descending order (most recent first)
            data.sort((a, b) => b.timestamp - a.timestamp);
            // Format the timestamp
            data.forEach((item) => {
              item.timestamp = formatTimestamp(item.timestamp);
            });
            setHistory(data);
          }
        })
        .catch((error) => {
          // console.log('Failed to fetch history:'); // Handle any errors
        });
    }
  }, []);
  return (
    <HistoryContainer
      key="history"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <LayoutGroup>
        {history.map((item, index) => (
          <motion.div layout key={index}>
            <HistoryItemList key={index} item={item} />
          </motion.div>
        ))}
      </LayoutGroup>
    </HistoryContainer>
  );
}

function HistoryItemList({ item, ...props }) {
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
        // console.log('Text copied to clipboard');
      })
      .catch((err) => {
        // console.error('Could not copy text: ', err);
      });
    setInterval(() => setIsCopied(false), 5000);
  };

  return (
    <HistoryItemContainer {...props} ref={itemRef} data-isexpanded={isExpanded} layout>
      <motion.div layout="position">
        <TopLine>
          <DateHeading>{item.timestamp}</DateHeading>
          <div>
            {isCopied ? <ClipboardCheck /> : <Clipboard onClick={handleCopy} />}

            <Close onClick={(e) => handleDelete(e, item.timestamp)} />
          </div>
        </TopLine>

        <TextContainer data-isexpanded={isExpanded}>
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
  /* height: 100%; */
  overflow: auto;
  /* padding: 20px; */
  box-sizing: border-box;
  display: flex;
  position: relative;
  flex: 1;
  flex-direction: column;
  overflow: auto;
  margin-bottom: 0px;

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
  padding: 6px;
  max-height: ${(props) => (props['data-isexpanded'] ? 'auto' : '80px')};
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
  padding-bottom: ${(props) => (props['data-isexpanded'] ? '70px' : '10px')};
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
  margin-bottom: ${(props) => (props['data-isexpanded'] ? '20px' : '0px')};

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
  font-size: 12px;
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
