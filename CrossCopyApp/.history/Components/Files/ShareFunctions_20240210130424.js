import * as Sharing from 'expo-sharing';
import { ref as dbRef, push, set } from 'firebase/database';

export const handleSharePress = async (filesToShare, database, auth) => {
  const newRef = push(dbRef(database, `shared`));
  console.log(filesToShare);

  // Add the current timestamp to each shared object
  const filesWithTimestamp = {
    ...filesToShare,
    uploadTimestamp: Date.now(),
    uid: auth.currentUser.uid,
  };

  try {
    await set(newRef, filesWithTimestamp);

    const uniqueKey = newRef.key;
    const alteredKey = uniqueKey.replace(/-/g, '');

    // Assuming `shortenUrl` is a function you have that shortens URLs, otherwise just use the long version
    // const shortenedUrl = await shortenUrl(alteredKey);
    const shortenedUrl = `https://crosscopy.dev/shared/${alteredKey}`;

    // Check if sharing is available on the device
    if (!(await Sharing.isAvailableAsync())) {
      console.error('Sharing is not available on your device');
      // Handle the case where sharing isn't available, perhaps by showing an alert or modal
      return;
    }

    await Sharing.shareAsync(shortenedUrl, {
      mimeType: 'text/plain', // You can set the MIME type here
      dialogTitle: 'Share files', // This is the title of the share dialog
    });

    console.log('Sharing URL:', shortenedUrl);
  } catch (error) {
    console.error('Something went wrong sharing', error);
  }
};
