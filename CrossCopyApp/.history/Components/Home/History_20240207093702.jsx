import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Alert,
} from 'react-native';
import { styles } from './Styles/SharedStyles';
import { database, auth } from '../../Firebase';
import { ref, remove, set, onValue } from 'firebase/database'; // Import the functions for Realtime Database
import { Feather, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
// import { RichEditor, RichToolbar } from 'react-native-pell-rich-editor';
import * as Clipboard from 'expo-clipboard';
import RenderHtml from 'react-native-render-html';
import { useWindowDimensions } from 'react-native';

export default function History({ history, setHistory }) {
  const [isLoading, setIsLoading] = useState(false); // New state for item-specific loading

  const renderItem = ({ item }) => <HistoryItem timestamp={item.timestamp} text={item.text} />;

  const handleClearHistory = () => {
    const user = auth.currentUser;

    if (user) {
      Alert.alert(
        'Confirm Deletion', // Title
        'Are you sure you want to delete your paste history?', // Message
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: async () => {
              setIsLoading(true);
              try {
                // Delete the history from the database
                const historyRef = ref(database, `users/${user.uid}/history`);
                await remove(historyRef);

                // Update the local state
                setIsLoading(false);

                setHistory([]);
              } catch (error) {
                console.error('Failed to clear history:', error);
                setIsLoading(false);
              }
            },
          },
        ],
        { cancelable: false }
      );
    }
  };

  if (isLoading) {
    return (
      <View style={styles.subContainer}>
        <View style={styles.bottomContainer}>
          <Text style={styles.bottomText}>History</Text>
          <TouchableOpacity style={[styles.bottomButton, { marginRight: 0 }]}>
            <Feather name="x-circle" size={14} color={'#5e5e5e'} style={{ marginRight: 5 }} />
            <Text style={styles.buttonText}>Clear</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.fullView}>
          <ActivityIndicator size="small" color="#ffffff" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.subContainer}>
      <View style={styles.bottomContainer}>
        <Text style={styles.bottomText}>History</Text>
        <TouchableOpacity style={[styles.bottomButton, { marginRight: 0 }]}>
          <Feather name="x-circle" size={14} color={'#5e5e5e'} style={{ marginRight: 5 }} />
          <Text style={styles.buttonText} onPress={handleClearHistory}>
            Clear
          </Text>
        </TouchableOpacity>
      </View>
      {history.length > 1 ? (
        <FlatList
          style={{ flex: 1, overflow: 'hidden' }}
          showsVerticalScrollIndicator={false}
          data={history}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      ) : (
        <View style={styles.fullView}>
          <MaterialIcons name="history" size={35} color={'#bababa'} style={{ marginRight: 5 }} />
          <Text style={{ color: '#bababa', marginTop: 8 }}>
            Your text history will appear here.
          </Text>
        </View>
      )}
    </View>
  );
}

function HistoryItem({ timestamp, text }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false); // New state for item-specific loading
  const { width } = useWindowDimensions();

  const richTextRef = useRef(null);

  const handleLongPress = () => {
    setIsCopied(true);
    Clipboard.setStringAsync(text);
    // alert('Text copied to clipboard!'); // Optional: Notify the user

    setTimeout(() => {
      setIsCopied(false);
    }, 5000);
  };

  return (
    <View
      style={[
        historyStyles.itemContainer,
        isExpanded ? { maxHeight: 'auto' } : { maxHeight: 300 },
        { height: 'auto', minHeight: 60 },
      ]}
    >
      <TouchableOpacity
        style={historyStyles.headingContainer}
        onPress={() => setIsExpanded(!isExpanded)}
        onLongPress={handleLongPress} // Add this line
      >
        <Text style={historyStyles.heading}>{timestamp} </Text>
        <View style={{ flexDirection: 'row' }}>
          <Feather name="chevrons-down" size={20} color={'#5e5e5e'} style={{ marginRight: 5 }} />
          <Feather
            name="clipboard"
            size={20}
            color={isCopied ? '#63d886' : '#dad9d9'}
            style={{ marginRight: 8 }}
            onPress={handleLongPress}
          />
        </View>
      </TouchableOpacity>
      <RenderHtml
        contentWidth={width}
        source={{ html: text }}
        baseStyle={{ color: '#bababa', padding: 8 }} // Set all text to be white
      />

      {/* {text.length > 50 ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          <RichEditor
            ref={richTextRef}
            useContainer={true}
            editorStyle={historyStyles.richEditor}
            initialContentHTML={text}
            disabled={true}
            scrollEnabled={false}
            onLoad={() => setIsLoaded(true)}
          />
        </ScrollView>
      ) : (
        <RichEditor
          ref={richTextRef}
          useContainer={true}
          editorStyle={historyStyles.richEditor}
          initialContentHTML={text}
          disabled={true}
          scrollEnabled={false}
          onLoad={() => setIsLoaded(true)}
        />
      )} */}
    </View>
  );
}

const historyStyles = StyleSheet.create({
  itemContainer: {
    width: '100%',
    height: 100,
    borderBottomWidth: 1,
    overflow: 'hidden',
    paddingBottom: 1,
    borderColor: '#676767',
    paddingBottom: 5,
  },
  headingContainer: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: '#363535',
  },
  heading: {
    color: '#dad9d9',
    padding: 8,
    fontSize: 15,
  },
  richEditor: {
    backgroundColor: '#252525',
    color: '#bababa',
    overflow: 'hidden',
    padding: 0,
    // placeholderColor: '#888',
  },
});
