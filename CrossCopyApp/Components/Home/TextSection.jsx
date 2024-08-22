import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { auth, database } from "../../Firebase";
import { ref, set } from "firebase/database";
import * as Clipboard from "expo-clipboard";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { styles } from "../SharedStyles";

// Utility function to convert HTML to plain text
const htmlToPlainText = (html) => {
  return html
    .replace(/<\/p>/g, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ");
};

// Utility function to convert plain text back to HTML
const plainTextToHtml = (text) => {
  return text
    .split("\n")
    .map((line) => `<p>${line}</p>`)
    .join("");
};

export default function TextSection({ text, setText }) {
  const lastKnownValueRef = useRef(text);
  const [localText, setLocalText] = useState(htmlToPlainText(text));
  const [isCopied, setIsCopied] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const user = auth.currentUser;

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    if (text !== lastKnownValueRef.current) {
      setLocalText(htmlToPlainText(text));
      lastKnownValueRef.current = text;
    }
  }, [text]);

  const handleTextChange = (value) => {
    setLocalText(value);
  };

  const handleDonePress = () => {
    const htmlValue = plainTextToHtml(localText);
    setText(htmlValue);

    if (user) {
      set(ref(database, `users/${user.uid}/text`), htmlValue);
    }

    Keyboard.dismiss();
  };

  const handleClearText = () => {
    setLocalText("");
    setText("");

    if (user) {
      set(ref(database, `users/${user.uid}/text`), "");
    }
  };

  const handleCopyText = () => {
    setIsCopied(true);
    Clipboard.setString(text);
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <KeyboardAvoidingView
        style={styles.subContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.bottomContainer}>
          <Text style={styles.bottomText}>Text</Text>
          <TouchableOpacity
            style={[styles.bottomButton, { marginRight: 5 }]}
            onPress={handleClearText}
          >
            <Feather
              name="x-circle"
              size={14}
              color={"#5e5e5e"}
              style={{ marginRight: 5 }}
            />
            <Text style={styles.buttonText}>Clear</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.bottomButton}
            onPress={handleCopyText}
          >
            {isCopied ? (
              <MaterialCommunityIcons
                name="check"
                size={12}
                color={"#1cbb00"}
                style={{ marginRight: 5 }}
              />
            ) : (
              <MaterialCommunityIcons
                name="content-copy"
                size={12}
                color={"#5e5e5e"}
                style={{ marginRight: 5 }}
              />
            )}
            <Text style={styles.buttonText}>
              {isCopied ? "Copied" : "Copy"}
            </Text>
          </TouchableOpacity>
          {isKeyboardVisible && (
            <TouchableOpacity
              style={[styles.bottomButton, { marginLeft: 5 }]}
              onPress={handleDonePress}
            >
              <Feather
                name="check-circle"
                size={14}
                color={"#5e5e5e"}
                style={{ marginRight: 5 }}
              />
              <Text style={styles.buttonText}>Done</Text>
            </TouchableOpacity>
          )}
        </View>

        <ScrollView
          style={[
            styles.mainContent,
            { padding: 0, minHeight: "100%", flex: 1, background: "#00aaff" },
          ]}
          nestedScrollEnabled={true}
        >
          <TextInput
            style={TextStyles.textInput}
            value={localText}
            onChangeText={handleTextChange}
            placeholder="Type or paste your text here"
            placeholderTextColor="#888"
            multiline={true}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const TextStyles = StyleSheet.create({
  textInput: {
    minHeight: "100%", // You can set a specific height for the TextInput
    color: "#fff",
    padding: 8,
    marginTop: 5,
  },
  richEditor: {
    backgroundColor: "#252525",
    color: "#bababa",
    placeholderColor: "#888",
    initialCSSText: "div { marginTop: -15; }", // Add this line
  },
  editor: {
    flex: 1,
    padding: 0,
    // borderColor: 'gray',
    background: "#252525",

    borderWidth: 1,

    minHeight: "100%",
    width: "100%",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#252525",
    zIndex: 10,
  },
});
