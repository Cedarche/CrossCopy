import React, { useState, useEffect, useRef } from 'react';
import { debounce } from 'lodash';
import { auth, Signout } from '../firebase';
import 'react-quill/dist/quill.snow.css'; // import the styles
import axios from 'axios';
import { API_URL } from './URL';
import { useAuth } from './AuthContext';

import {
  Container,
  QuillContainer,
  StyledQuill,
  BottomBar,
  Clipboard,
  ClipboardCheck,
  LogOut,
  Clear,
} from './TextElements';

export default function TextSection() {
  const [text, setText] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const quillRef = useRef();
  const { logout } = useAuth();

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      axios.get(`${API_URL}/user/${user.uid}`).then((response) => {
        const { data } = response;
        // console.log(data);
        if (data.text) {
          setText(data.text);
        }
      });
    }
  }, []);

  const handleTextChange = debounce((value) => {
    const oldTextLength = text.length;
    const newTextLength = value.length;
    const difference = Math.abs(newTextLength - oldTextLength);
    setIsCopied(false);

    setText(value);
    const encodedText = encodeURIComponent(value);

    const user = auth.currentUser;
    if (user) {
      axios
        .post(`${API_URL}/user/${user.uid}/text`, { text: encodedText })
        .then((response) => {
          // console.log(response.data.message);
        })
        .catch((error) => {
          // console.error('Error updating text.', error);
        });
      axios
        .post(`${API_URL}/user/${user.uid}/history`, { text: encodedText })
        .then((response) => {
          // console.log(response.data.message);
        })
        .catch((error) => {
          // console.error('Error updating history.', error);
        });
    }
  }, 500); // Debounce time of 500ms

  const handleClearContent = () => {
    setText('');
  };

  const handleCopyContent = () => {
    setIsCopied(true);

    // Access the Quill instance
    const quillInstance = quillRef.current.getEditor();
    // Get the text from the editor
    const plainText = quillInstance.getText();

    navigator.clipboard
      .writeText(plainText)
      .then(() => {})
      .catch((err) => {
        // console.error('Could not copy text: ', err);
      });
  };

  return (
    <Container key="editor" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <QuillContainer>
        <StyledQuill ref={quillRef} value={text} onChange={handleTextChange} />
      </QuillContainer>
      <BottomBar>
        <LogOut size={15} onClick={logout} />
        <Clear size={15} onClick={handleClearContent} />
        {isCopied ? <ClipboardCheck size={15} /> : <Clipboard onClick={handleCopyContent} />}
      </BottomBar>
    </Container>
  );
}
