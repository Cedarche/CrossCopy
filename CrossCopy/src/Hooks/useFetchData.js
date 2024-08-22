import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ref as dbRef, onValue } from "firebase/database";
import { auth, database, trackViews } from "../firebase";
import axios from "axios";


export const useFetchData = () => {
  const [files, setFiles] = useState([]);
  const [paidUser, setPaidUser] = useState(false);
  const [history, setHistory] = useState([]);
  const [userData, setUserData] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;

  const fetchUserData = () => {
    return new Promise((resolve, reject) => {
      const userRef = dbRef(database, `users/${auth.currentUser.uid}`);
      onValue(
        userRef,
        (snapshot) => {
          const userData = snapshot.val();
          console.log('userData: ', userData)
          resolve(userData || {});
        },
        reject
      );
    });
  };

  const fetchFiles = () => {
    return new Promise((resolve, reject) => {
      const databaseRef = dbRef(database, `uploads/${auth.currentUser.uid}`);
      onValue(
        databaseRef,
        (snapshot) => {
          const data = snapshot.val();
          const fetchedFiles = data
            ? Object.values(data).sort(
                (a, b) => b.uploadTimestamp - a.uploadTimestamp
              )
            : [];
          setFiles(fetchedFiles);
          resolve(fetchedFiles);
        },
        reject
      );
    });
  };

  const fetchHistory = async () => {
    const user = auth.currentUser;
    if (!user) return [];

    const response = await axios.get(`${API_URL}/user/${user.uid}/history`);
    const historyArray = response.data;

    historyArray.forEach((entry) => {
      entry.originalTimestamp = entry.timestamp;
      entry.timestamp = formatTimestamp(entry.timestamp);
    });

    setHistory(historyArray);
    return historyArray;
  };

  // Use react-query to fetch data with the correct object syntax
  const { refetch: refetchUserData } = useQuery({
    queryKey: ["userData"],
    queryFn: fetchUserData,
    onSuccess: (data) => {
      setUserData(data);
      setPaidUser(data.paidUser || false);
    },
    enabled: !!auth.currentUser,
  });

  const { refetch: refetchFiles } = useQuery({
    queryKey: ["files"],
    queryFn: fetchFiles,
    enabled: !!auth.currentUser,
  });

  const { refetch: refetchHistory } = useQuery({
    queryKey: ["history"],
    queryFn: fetchHistory,
    enabled: !!auth.currentUser,
  });

  // Trigger the view tracking only once when the component is mounted
  useEffect(() => {
    trackViews("HomePage");
  }, []);

  return {
    userData,
    files,
    history,
    paidUser,
    setFiles,
    setHistory,
    setPaidUser,
    refetchUserData,
    refetchFiles,
    refetchHistory,
  };
};

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
