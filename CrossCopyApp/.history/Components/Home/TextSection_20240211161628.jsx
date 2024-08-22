import React, { useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import axios from 'axios';
import { debounce } from 'lodash';
import { auth, database } from '../../Firebase';
import { ref, set, onValue } from 'firebase/database'; // Import the functions for Realtime Database
import * as Clipboard from 'expo-clipboard';
import { styles } from '../SharedStyles';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
// import { RichEditor, RichToolbar } from 'react-native-pell-rich-editor';
import { API_URL } from '../../URL';
// import QuillEditor, { QuillToolbar } from 'react-native-cn-quill';

export default function TextSection({ text, setText }) {
  const richTextRef = useRef(null);
  const lastKnownValueRef = useRef(text);

  const _editor = React.createRef();
  const [isCopied, setIsCopied] = useState(false);
  const [editorContent, setEditorContent] = useState(text); // Local state
  const [editorKey, setEditorKey] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const user = auth.currentUser;

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    if (text !== lastKnownValueRef.current) {
      // This is an external update
      // _editor.current.setText(text);
      setIsLoading(true); // Show the loading overlay

      setEditorKey((prevKey) => prevKey + 1);
      lastKnownValueRef.current = text; // Update the ref to the new value
      setIsLoading(false); // Hide the loading overlay after the update
    }
  }, [text]);

  useEffect(() => {
    let timeoutId;

    if (isCopied) {
      timeoutId = setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isCopied]);

  const handleTextChange = debounce((value) => {
    if (value && value.html !== lastKnownValueRef.current) {
      lastKnownValueRef.current = value.html;
      // setText(value);
      const oldTextLength = text.length;
      const newTextLength = value.html.length;
      const difference = Math.abs(newTextLength - oldTextLength);
      // console.log(value.html.length);
      // console.log(difference);

      setIsCopied(false);
      // setText(value.html);

      if (user) {
        set(ref(database, `users/${user.uid}/text`), value.html);
      }
    }
  }, 1000); // Debounce time of 500ms

  const handleClearText = () => {
    setText('');
    _editor.current?.setContents();
    // richTextRef.current.setContentHTML('');

    if (user) {
      // Only update the text field
      set(ref(database, `users/${user.uid}/text`), '');
    }
  };

  const handleCopyText = () => {
    setIsCopied(true);
    Clipboard.setStringAsync(text); // 'text' is the content you want to copy
    // alert('Text copied to clipboard!'); // Optional: Notify the user
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
    _editor.current?.blur();

    // richTextRef.current.blurContentEditor();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.subContainer}>
        <View style={styles.bottomContainer}>
          <Text style={styles.bottomText}>Text</Text>
          <TouchableOpacity
            style={[styles.bottomButton, { marginRight: 5 }]}
            onPress={handleClearText}
          >
            <Feather name="x-circle" size={14} color={'#5e5e5e'} style={{ marginRight: 5 }} />
            <Text style={styles.buttonText}>Clear</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomButton} onPress={handleCopyText}>
            {isCopied ? (
              <MaterialCommunityIcons
                name="check"
                size={12}
                color={'#1cbb00'}
                style={{ marginRight: 5 }}
              />
            ) : (
              <MaterialCommunityIcons
                name="content-copy"
                size={12}
                color={'#5e5e5e'}
                style={{ marginRight: 5 }}
              />
            )}

            <Text style={styles.buttonText}>{isCopied ? 'Copied' : 'Copy'}</Text>
          </TouchableOpacity>
          {isKeyboardVisible && (
            <TouchableOpacity onPress={dismissKeyboard}>
              <Feather name="x" size={18} color={'#b5b5b5'} style={{ marginLeft: 8 }} />
            </TouchableOpacity>
          )}
        </View>

        <ScrollView
          style={[
            styles.mainContent,
            { padding: 0, minHeight: '100%', flex: 1, background: '#00aaff' },
          ]}
          nestedScrollEnabled={true}
        >
          {/* <QuillEditor
            key={editorKey}
            theme={{
              background: '#252525',
              backgroundColor: '#252525',
              color: '#bababa',
              placeholder: '#bababa',
            }}
            autoSize
            container={true}
            // style={TextStyles.editor}
            ref={_editor}
            value={text}
            initialHtml={text}
            quill={{
              placeholder: 'Type or paste your text here',
              modules: {
                toolbar: false, // this is default value
                theme: 'bubble',
              },
            }}
            // onHtmlChange={(content) => handleTextChange(content)}
            onHtmlChange={handleTextChange}
          /> */}
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const TextStyles = StyleSheet.create({
  textInput: {
    minHeight: '100%', // You can set a specific height for the TextInput
    color: '#fff',
  },
  richEditor: {
    backgroundColor: '#252525',
    color: '#bababa',
    placeholderColor: '#888',
    initialCSSText: 'div { marginTop: -15; }', // Add this line
  },
  editor: {
    flex: 1,
    padding: 0,
    // borderColor: 'gray',
    background: '#252525',

    borderWidth: 1,

    minHeight: '100%',
    width: '100%',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#252525',
    zIndex: 10,
  },
});

{
  /* <RichEditor
            ref={richTextRef}
            useContainer={false}
            containerStyle={{
              minHeight: '100%',
              marginTop: text ? 0 : 0,
              overflow: 'scroll',
            }}
            editorStyle={TextStyles.richEditor}
            initialContentHTML={text}
            onChange={(content) => handleTextChange(content)}
            placeholder="Type or paste your text here"
          /> */
}

// Check if the plain text is not empty, does not contain only whitespace, and does not contain '<br>'
// console.log('Adding to history!');
// Send the text to the history endpoint
// if (difference > 20) {
//   axios
//     .post(`${API_URL}/user/${user.uid}/history`, { text: value.html })
//     .then((response) => {
//       console.log(response.data.message);
//     })
//     .catch((error) => {
//       console.log('Error updating history.');
//     });
// }
