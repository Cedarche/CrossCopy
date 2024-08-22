import * as Sharing from "expo-sharing";
import { ref as dbRef, push, set } from "firebase/database";
import { auth, database } from "../../Firebase";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

export const handleSharePress = async (shareLink) => {

  // Check if sharing is available on the device
  if (!(await Sharing.isAvailableAsync())) {
    console.error("Sharing is not available on your device");
    // Handle the case where sharing isn't available, perhaps by showing an alert or modal
    return;
  }

  await Sharing.shareAsync(shareLink, {
    mimeType: "text/plain", // You can set the MIME type here
    dialogTitle: "Share files", // This is the title of the share dialog
  });

  console.log("Sharing URL2:", shareLink);
};

export const getShareLink = async (filesToShare) => {
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
    const alteredKey = uniqueKey.replace(/-/g, "");

    // Assuming `shortenUrl` is a function you have that shortens URLs, otherwise just use the long version
    // const shortenedUrl = await shortenUrl(alteredKey);
    const shortenedUrl = `https://crosscopy.dev/shared/${alteredKey}`;
    console.log("Sharing URL1:", shortenedUrl);
    return shortenedUrl;
  } catch (error) {
    console.log("Something went wrong...");
    return null;
  }
};
