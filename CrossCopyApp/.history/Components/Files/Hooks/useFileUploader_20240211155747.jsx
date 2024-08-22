import { useState } from "react";
import { Platform } from "react-native";
import * as FileSystem from "expo-file-system";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";
import { set, ref as dbRef } from "firebase/database";


const useFileUploader = (storage, database, auth) => {
  const [uploadProgress, setUploadProgress] = useState({});
  const [totalFiles, setTotalFiles] = useState(0);
  const [error, setError] = useState(null);

  const uploadFileToFirebase = async (fileUri, fileName, fileSize) => {
    console.log("Attempting upload...");
    const sanitizedFileName = fileName.replace(/[.#$[\]]/g, "_");
    const fileStorageRef = storageRef(
      storage,
      `uploads/${auth.currentUser.uid}/${sanitizedFileName}`
    );
    try {
      // Convert file URI to blob if necessary (e.g., for web compatibility)
      const blob = await uriToBlob(fileUri);

      const uploadTask = uploadBytesResumable(fileStorageRef, blob);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress((prev) => ({
            ...prev,
            [sanitizedFileName]: progress,
          }));
        },
        (error) => {
          setError(error);
          console.error("Error uploading file:", error);
        },
        async () => {
          const url = await getDownloadURL(fileStorageRef);
          const fileDbRef = dbRef(
            database,
            `uploads/${auth.currentUser.uid}/${sanitizedFileName}`
          );

          set(fileDbRef, {
            name: sanitizedFileName,
            size: fileSize,
            url: url,
            uploadTimestamp: Date.now(),
          });

          console.log("Upload complete!");
          setTimeout(() => {setUploadProgress(0)}, 1000)
        }
      );
    } catch (error) {
      setError(error);
      console.error("Error processing file upload:", error);
    }
  };

//   const uriToBlob = async (uri) => {
//     return RNFetchBlob.fs.readFile(uri, 'blob');
//   };

  const uriToBlob = (uri) => {
    return new Promise((resolve, reject) => {
       const xhr = new XMLHttpRequest()
       xhr.onload = function () {
         // return the blob
         resolve(xhr.response)
       }
       xhr.onerror = function () {
         reject(new Error('uriToBlob failed'))
       }
       xhr.responseType = 'blob'
       xhr.open('GET', uri, true)
   
       xhr.send(null)})}

  return { uploadFileToFirebase, uploadProgress, error };
};

export default useFileUploader;
