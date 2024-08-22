import { useState } from 'react';
import { ref as storageRef, deleteObject } from 'firebase/storage';
import { ref as dbRef, remove } from 'firebase/database';

const useFileDelete = (storage, database, auth, files, setFiles) => {
  const [loading, setLoading] = useState(false);

  const removeFile = (file) => {
    setLoading(true);
    // Create a reference to the file to delete
    const fileStorageRef = storageRef(storage, `uploads/${auth.currentUser.uid}/${file.name}`);
    const fileDbRef = dbRef(database, `uploads/${auth.currentUser.uid}/${file.name}`);

    // Delete the file metadata from the database
    remove(fileDbRef)
      .then(() => {
        console.log('File metadata deleted successfully from the database');
        // File deleted successfully from Firebase Database, now delete from Storage
        return deleteObject(fileStorageRef);
      })
      .then(() => {
        console.log('File deleted successfully from Storage');
        setLoading(false);
        // Remove the file from the local state
        setFiles((prevFiles) => prevFiles.filter((f) => f.name !== file.name));
      })
      .catch((error) => {
        console.error('Error deleting file:', error);
        setLoading(false);
      });
  };

  const removeAllFiles = () => {
    if (window.confirm('Are you sure you want to delete all files?')) {
      setLoading(true);
      const deletePromises = files.map((file) => {
        const fileStorageRef = storageRef(storage, `uploads/${auth.currentUser.uid}/${file.name}`);
        const fileDbRef = dbRef(database, `uploads/${auth.currentUser.uid}/${file.name}`);

        return remove(fileDbRef)
          .then(() => deleteObject(fileStorageRef))
          .catch((error) => {
            console.error('Error deleting file:', error);
          });
      });

      Promise.all(deletePromises)
        .then(() => {
          console.log('All files deleted successfully');
          setFiles([]);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error deleting all files:', error);
          setLoading(false);
        });
    }
  };

  return { removeFile, removeAllFiles, loading };
};

export default useFileDelete;
