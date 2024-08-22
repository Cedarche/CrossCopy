import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Button,
  TouchableOpacity,

  Platform,
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import axios from "axios";
import SplashScreen from "../Auth/SplashScreen";
import TextSection from "./TextSection";
import History from "./History";
import Settings from "./Settings";
import Files from "./Files";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { auth, database } from "../../Firebase";
import {
  ref as dbRef,
  set,
  push,
  remove,
  onValue,
  onDisconnect,
} from "firebase/database";
import { API_URL } from "../../URL";


const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  const strTime =
    date.getMonth() +
    1 +
    "/" +
    date.getDate() +
    "/" +
    date.getFullYear() +
    ", " +
    hours +
    ":" +
    minutes +
    " " +
    ampm;
  return strTime;
};

// screenOptions={{ headerShown: false }}

function BottomTabNavigator({
  text,
  files,
  paidUser,
  history,
  setText,
  setFiles,
  setHistory,
  ...rest
}) {
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#2c2c2c" }}
      edges={["top"]}
    >
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          
          tabBarStyle: {
            borderTopWidth: 0,
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            // elevation: 10,
            // backgroundColor: '#fff',
            //   backgroundColor: colors.container,
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
            height: 80,
            // paddingBottom: 30,
            // paddingBottom: Platform.OS == "ios" ? 30 : 15,
            shadowOffset: { width: 2, height: 2 },
            //   shadowColor: colors.shadowColor,
            shadowOpacity: 0.6,
            elevation: 3,
          },
        }}
      >
          <Tab.Screen
          name="Files"
          children={() => (
            <Files files={files} setFiles={setFiles} paidUser={paidUser} />
          )}
          options={{
            tabBarIcon: ({ focused, color, size }) => (
              <Feather name="folder" size={20} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Text"
          children={() => <TextSection text={text} setText={setText} />}
          options={{
            tabBarIcon: ({ focused, color, size }) => (
              <Feather name="edit" size={20} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="History"
          children={() => <History history={history} setHistory={setHistory} />}
          options={{
            tabBarIcon: ({ focused, color, size }) => (
              <Feather name="list" size={20} color={color} />
            ),
          }}
        />
   
        <Tab.Screen
          name="Settings"
          children={() => <Settings paidUser={paidUser} />}
          options={{
            tabBarIcon: ({ focused, color, size }) => (
              <Feather name="settings" size={20} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
}

export default function Homepage() {
  const [loading, setLoading] = useState(true);
  const [completedOps, setCompletedOps] = useState(0); // <-- Add this state
  const [text, setText] = useState("");
  const [files, setFiles] = useState([]);
  const [paidUser, setPaidUser] = useState(false);
  const [history, setHistory] = useState([]);
  const [userData, setUserData] = useState(null);
  const user = auth.currentUser;

  const incrementOps = () => {
    setCompletedOps((prevOps) => prevOps + 1);
  };

  // ======================================================================================
  // Fetch text useEffect
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const userRef = dbRef(database, `users/${user.uid}`);

      onValue(userRef, async (snapshot) => {
        const data = snapshot.val();

        if (data) {
          setText(data.text);
          // console.log(data.text);
          console.log("FetchText");

          incrementOps();
        }
      });
    }
  }, [user]);

  // ======================================================================================
  // Fetch paidUser useEffect
  useEffect(() => {
    const userRef = dbRef(database, `users/${user.uid}`);
    const unsubscribeUser = onValue(userRef, (snapshot) => {
      const userData = snapshot.val();
      // console.log(userData);
      if (userData) {
        setUserData(userData);
        setPaidUser(userData.paidUser || false);
      }
    });
    console.log("PaidUser");
    incrementOps();
    return () => {
      unsubscribeUser();
    };
  }, [user]);

  // ======================================================================================
  // Fetch Files useEffect
  useEffect(() => {
    const fetchFiles = () => {
      const databaseRef = dbRef(database, `uploads/${user.uid}`);
      const unsubscribeFiles = onValue(databaseRef, (snapshot) => {
        const data = snapshot.val();
        // console.log(data);
        if (data) {
          const fetchedFiles = Object.values(data);
          fetchedFiles.sort((a, b) => b.uploadTimestamp - a.uploadTimestamp);
          setFiles(fetchedFiles);
        } else {
          setFiles([]);
        }
      });
      console.log("FetchFiles");

      incrementOps();
      return unsubscribeFiles; // This will be called to clean up the listener
    };

    const unsubscribeFiles = fetchFiles();

    return () => {
      unsubscribeFiles();
    };
  }, [user]);

  // ======================================================================================
  // Get History useEffect
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const historyRef = dbRef(database, `users/${user.uid}/history`);
      onValue(historyRef, async (snapshot) => {
        const data = snapshot.val();
        if (data) {
          try {
            // Call the /user/:userId/history endpoint to get the decrypted history
            const response = await axios.get(
              `${API_URL}/user/${user.uid}/history`
            );
            const historyArray = response.data;
            console.log("T");

            // Format the timestamp and decrypt the text for each entry in the history
            historyArray.forEach((entry) => {
              entry.originalTimestamp = entry.timestamp; // keep the original timestamp
              entry.timestamp = formatTimestamp(entry.timestamp); // also store the formatted timestamp
              entry.text = entry.text; // store the decrypted text
            });

            setHistory(historyArray);

            incrementOps();
            // console.log(historyArray);
          } catch (error) {
            console.error("Failed to fetch history:", error);
          }
        } else {
          console.log("No history data...");
          incrementOps();
        }
      });
    }
    // if (history.length > 1) {

    // }
  }, []);

  useEffect(() => {
    if (completedOps >= 4) {
      setLoading(false);
    }
  }, [completedOps]);

  if (loading) {
    return <SplashScreen homePage={true} />;
  }

  return (
    <NavigationContainer theme={CustomDarkTheme}>
      <Drawer.Navigator
        initialRouteName="Main"
        screenOptions={{ headerShown: false }}
      >
        <Drawer.Screen name="Main">
          {(props) => (
            <BottomTabNavigator
              {...props}
              text={text}
              setText={setText}
              files={files}
              setFiles={setFiles}
              history={history}
              setHistory={setHistory}
              paidUser={paidUser}
              screenOptions={{ headerShown: false }}
            />
          )}
        </Drawer.Screen>
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  signOutButton: {
    width: 100,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#af00f4",
    marginTop: 10,
  },
});

const CustomDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: "#66ffff", // Customize as needed
    background: "#252525",
    card: "#333333",
    // Add or override any other colors
  },
};
