import React, { useState, useEffect, useRef, lazy } from 'react';
import { debounce } from 'lodash';
import { motion, AnimatePresence } from 'framer-motion';

// const History = lazy(() => import('./History'));
import History from './History';
import axios from 'axios';
import { auth, database, ref, set, onValue } from '../firebase';
import {
  Heading,
  ButtonContainer,
  Button,
  QuillContainer,
  StyledQuill,
  Header,
  Clipboard,
  ClipboardCheck,
} from './HomeElements';

const API_URL = import.meta.env.VITE_API_URL;

function TextSection({ mobile, history, setHistory }) {
  const [text, setText] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const textRef = useRef(); // Create a ref to store the current text

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const userRef = ref(database, `users/${user.uid}`);
      onValue(userRef, async (snapshot) => {
        const data = snapshot.val();

        if (data && data.text) {
          setText(data.text);
        }
      });
    }
  }, []);

  const handleTextChange = debounce((value) => {
    const oldTextLength = text.length;
    const newTextLength = value.length;
    const difference = Math.abs(newTextLength - oldTextLength);

    setText(value);
    setIsCopied(false);
    const user = auth.currentUser;
    if (user) {
      // Only update the text field
      set(ref(database, `users/${user.uid}/text`), value);

      // Check if the plain text is not empty, does not contain only whitespace, and does not contain '<br>'
      console.log('Adding to history!');

      // Send the text to the history endpoint
      if (difference > 30) {
        axios
          .post(`${API_URL}/user/${user.uid}/history`, { text: value })
          .then((response) => {
            console.log(response.data.message);
          })
          .catch((error) => {
            console.log('Error updating history.');
          });
      }
    }
  }, 500); // Debounce time of 500ms

  const handleClearContent = () => {
    setText('');
  };

  const handleCopyContent = () => {
    setIsCopied(true);

    // Access the Quill instance
    const quillInstance = textRef.current.getEditor();
    // Get the text from the editor
    const plainText = quillInstance.getText();

    navigator.clipboard
      .writeText(plainText)
      .then(() => {
        console.log('Text copied to clipboard');
      })
      .catch((err) => {
        console.error('Could not copy text: ', err);
      });

    setTimeout(() => {
      setIsCopied(false);
    }, 5000);
  };

  return (
    <>
      {!mobile && (
        <Heading>
          {showHistory ? 'History' : 'Text'}
          <ButtonContainer>
            {!mobile && (
              <Button onClick={() => setShowHistory(!showHistory)}>
                {showHistory ? 'Editor' : 'History'}
              </Button>
            )}

            {!showHistory && <Button onClick={handleClearContent}>Clear</Button>}
            {!showHistory && (
              <Button onClick={handleCopyContent} style={{ display: 'flex', alignItems: 'center' }}>
                {isCopied ? <ClipboardCheck /> : <Clipboard />} Copy
              </Button>
            )}
          </ButtonContainer>
        </Heading>
      )}

      <AnimatePresence mode="sync">
        {showHistory ? (
          <History history={history} setHistory={setHistory} />
        ) : (
          <QuillContainer>
            <StyledQuill ref={textRef} value={text} onChange={handleTextChange} />
          </QuillContainer>
        )}
      </AnimatePresence>
      {mobile && (
        <Heading>
          {showHistory ? 'History' : 'Text'}
          <ButtonContainer>
            {!showHistory && <Button onClick={handleClearContent}>Clear</Button>}
            <Button onClick={handleCopyContent} style={{ display: 'flex', alignItems: 'center' }}>
              {' '}
              {isCopied ? <ClipboardCheck /> : <Clipboard />} Copy
            </Button>
          </ButtonContainer>
        </Heading>
      )}
    </>
  );
}

export default TextSection;
