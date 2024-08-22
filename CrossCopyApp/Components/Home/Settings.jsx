import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Switch,
  Linking,
} from "react-native";
import { styles } from "../SharedStyles";
import { Signout, auth, database } from "../../Firebase";
import { ref, remove, set, onValue, update } from "firebase/database"; // Import the functions for Realtime Database
import { Feather } from "@expo/vector-icons";
import { API_URL } from "../../URL";
import axios from "axios";

import DropDownPicker from "react-native-dropdown-picker";

export default function Settings({}) {
  const [isLoading, setIsLoading] = useState(false); // New state for item-specific loading
  const [isEnabled, setIsEnabled] = useState(true);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("7");
  const [items, setItems] = useState([
    {
      label: "1 Hour",
      value: "1hr",
      labelStyle: {
        color: "#fff",
      },
    },
    {
      label: "24 Hours",
      value: "24hrs",
      labelStyle: {
        color: "#fff",
      },
    },
    {
      label: "3 Days",
      value: "3days",
      labelStyle: {
        color: "#fff",
      },
    },
    {
      label: "7 Days",
      value: "7days",
      labelStyle: {
        color: "#fff",
      },
    },
  ]);

  const user = auth.currentUser;

  const openLink = (url) => {
    Linking.openURL(url).catch((err) =>
      console.error("Failed to open URL:", err)
    );
  };

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      const userSettingsRef = ref(database, "users/" + user.uid);
      onValue(userSettingsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          console.log("Settings Data: ", data.deleteFilesAfter);
          setIsEnabled(data.saveHistory || false);
          setValue(data.deleteFilesAfter || "7");
        }
        setIsLoading(false);
      });
    }
  }, [user]);

  const toggleSwitch = () => {
    if (user) {
      const newIsEnabled = !isEnabled;
      setIsEnabled(newIsEnabled);
      update(ref(database, "users/" + user.uid), { saveHistory: newIsEnabled });
    }
  };

  const handleSelectAutoDeleteFiles = (newValue) => {
    if (user) {
      update(ref(database, "users/" + user.uid), {
        deleteFilesAfter: newValue,
      });
    }
  };

  const handleDeleteAccount = () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This can’t be undone."
      )
    ) {
      if (user) {
        setIsLoading(true);
        axios
          .delete(`${API_URL}/user/${user.uid}`)
          .then(() => {
            console.log("Account deleted successfully");
            setIsLoading(false);
            // Add any further actions like sign out or navigation
          })
          .catch((error) => {
            console.error("Failed to delete account:", error);
            setIsLoading(false);
          });
      }
    }
  };

  if (isLoading) {
    return (
      <View style={styles.subContainer}>
        <View style={styles.bottomContainer}>
          <Text style={styles.bottomText}>Settings</Text>
          <TouchableOpacity style={[styles.bottomButton, { marginRight: 0 }]}>
            <Feather
              name="x-circle"
              size={14}
              color={"#5e5e5e"}
              style={{ marginRight: 5 }}
            />
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
        <Text style={styles.bottomText}>Settings</Text>
        <TouchableOpacity style={[styles.bottomButton, { marginRight: 0 }]}>
          <Feather
            name="external-link"
            size={14}
            color={"#5e5e5e"}
            style={{ marginRight: 5 }}
          />
          <Text style={styles.buttonText} onPress={() => Signout()}>
            Signout
          </Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.fullView, { marginTop: 0, paddingTop: 0 }]}>
        <View style={settingStyles.itemContainer}>
          <Text style={[settingStyles.heading, { fontWeight: "800" }]}>
            tomcarruthers96@gmail.com
          </Text>
        </View>
        <View style={settingStyles.itemContainer}>
          <Text style={settingStyles.heading}>Remember paste history: </Text>
          <Switch
            trackColor={{ false: "#767577", true: "#767577" }}
            thumbColor={isEnabled ? "#66ffff" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </View>
        <View style={settingStyles.itemContainer}>
          <Text style={settingStyles.heading}>
            Automatically delete files after:{" "}
          </Text>

          <DropDownPicker
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={(callbackOrValue) => {
              // Handle the case where DropDownPicker passes a function as the first argument
              const newValue =
                typeof callbackOrValue === "function"
                  ? callbackOrValue(value)
                  : callbackOrValue;

              setValue(newValue); // Update the local state
              handleSelectAutoDeleteFiles(newValue); // Update Firebase
            }}
            setItems={setItems}
            containerStyle={{ maxWidth: 120 }}
            labelStyle={{
              fontWeight: "bold",
              color: "#fff",
            }}
            style={{
              backgroundColor: "#767577",
            }}
            dropDownContainerStyle={{
              backgroundColor: "#767577",
            }}
            arrowIconStyle={{
              width: 20,
              height: 20,
              tintColor: "#fff",
            }}
            tickIconStyle={{
              width: 20,
              height: 20,
              tintColor: "#fff",
            }}
          />
        </View>
      </View>
      <View style={settingStyles.bottomRowContainer}>
        <TouchableOpacity
          style={settingStyles.bottomRowButton}
          onPress={() => openLink("https://crosscopy.dev/privacy")}
        >
          <Text style={{ color: "#bdbdbd" }}>Privacy Policy</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={settingStyles.bottomRowButton}
          onPress={() => openLink("https://crosscopy.dev/contact")}
        >
          <Text style={{ color: "#bdbdbd" }}>Contact Us</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleDeleteAccount}
          style={[settingStyles.bottomRowButton, { borderColor: "#9f2d2d" }]}
        >
          <Text style={{ color: "#dc1414" }}>Delete Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const settingStyles = StyleSheet.create({
  itemContainer: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderColor: "#676767",
  },

  heading: {
    color: "#dad9d9",
    fontSize: 15,
  },
  richEditor: {
    backgroundColor: "#252525",
    color: "#bababa",
    overflow: "hidden",
    padding: 0,
    // placeholderColor: '#888',
  },
  bottomRowContainer: {
    borderTopWidth: 1,
    padding: 8,
    borderColor: "#676767",
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  bottomRowButton: {
    borderWidth: 1,
    borderColor: "#bdbdbd",
    padding: 8,
    borderRadius: 12,
    backgroundColor: "#67676760",
  },
});
