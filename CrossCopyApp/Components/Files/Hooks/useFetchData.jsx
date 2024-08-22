import { useState, useEffect } from "react";
import { auth, database } from "../../../Firebase";
import { ref as dbRef, onValue } from "firebase/database";
import axios from "axios";
import { API_URL } from "../../../URL";

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

export const useFetchData = () => {
  const [loading, setLoading] = useState(true);
  const [completedOps, setCompletedOps] = useState(0);
  const [text, setText] = useState("");
  const [files, setFiles] = useState([]);
  const [paidUser, setPaidUser] = useState(false);
  const [history, setHistory] = useState([]);
  const [userData, setUserData] = useState(null);
  const user = auth.currentUser;

  const incrementOps = () => {
    setCompletedOps((prevOps) => prevOps + 1);
  };

  useEffect(() => {
    if (user) {
      const userRef = dbRef(database, `users/${user.uid}`);

      const unsubscribeText = onValue(userRef, async (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setText(data.text);
          incrementOps();
        }
      });

      const unsubscribeUser = onValue(userRef, (snapshot) => {
        const userData = snapshot.val();
        if (userData) {
          setUserData(userData);
          setPaidUser(userData.paidUser || false);
        }
        incrementOps();
      });

      const fetchFiles = () => {
        const databaseRef = dbRef(database, `uploads/${user.uid}`);
        const unsubscribeFiles = onValue(databaseRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const fetchedFiles = Object.values(data);
            fetchedFiles.sort((a, b) => b.uploadTimestamp - a.uploadTimestamp);
            setFiles(fetchedFiles);
          } else {
            setFiles([]);
          }
          incrementOps();
        });
        return unsubscribeFiles;
      };

      const unsubscribeFiles = fetchFiles();

      const historyRef = dbRef(database, `users/${user.uid}/history`);
      const unsubscribeHistory = onValue(historyRef, async (snapshot) => {
        const data = snapshot.val();
        if (data) {
          try {
            const response = await axios.get(
              `${API_URL}/user/${user.uid}/history`
            );
            const historyArray = response.data;
            historyArray.forEach((entry) => {
              entry.originalTimestamp = entry.timestamp;
              entry.timestamp = formatTimestamp(entry.timestamp);
              entry.text = entry.text;
            });
            setHistory(historyArray);
          } catch (error) {
            console.error("Failed to fetch history:", error);
          }
        }
        incrementOps();
      });

      return () => {
        unsubscribeText();
        unsubscribeUser();
        unsubscribeFiles();
        unsubscribeHistory();
      };
    }
  }, [user]);

  useEffect(() => {
    if (completedOps >= 4) {
      setLoading(false);
    }
  }, [completedOps]);

  return { loading, text, setText, files, setFiles, paidUser, history, setHistory };
};
