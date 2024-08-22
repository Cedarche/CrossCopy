const admin = require('firebase-admin');
const moment = require('moment');
const logger = require('firebase-functions/logger');

async function deleteOldFiles(context) {
  logger.info(`Running file cleanup...`);
  const now = moment();
  const usersRef = admin.database().ref('users');
  const usersSnapshot = await usersRef.once('value');
  const users = usersSnapshot.val();
  let uCount = 0;
  let fCount = 0;

  for (const userId in users) {
    uCount++;
    const user = users[userId];
    const deleteAfter = getDeleteAfterDuration(user.deleteFilesAfter);
    const filesRef = admin.database().ref(`uploads/${userId}`);
    const filesSnapshot = await filesRef.once('value');
    const files = filesSnapshot.val();

    for (const fileName in files) {
      const file = files[fileName];
      const fileAge = now.diff(moment(file.uploadTimestamp), 'hours');

      if (fileAge > deleteAfter) {
        fCount++;
        // Delete the file from storage
        const fileRef = admin.storage().bucket().file(`uploads/${userId}/${fileName}`);
        await fileRef.delete();

        // Delete the file reference from the database
        await filesRef.child(fileName).remove();
      }
    }

    const sharedFilesRef = admin.database().ref(`/shared`);
    const sharedFilesSnapshot = await sharedFilesRef.once('value');
    const sharedFiles = sharedFilesSnapshot.val();

    for (const uniqueKey in sharedFiles) {
      const sharedFile = sharedFiles[uniqueKey];
      const fileAge = now.diff(moment(sharedFile.uploadTimestamp), 'hours');

      if (fileAge > 72) {
        // 72 hours for shared files
        // Delete the shared file reference from the database
        await sharedFilesRef.child(uniqueKey).remove();
        logger.info(`Deleted old shared file: ${uniqueKey}`);
      }
    }
  }

  logger.info(`Number of users: ${uCount}`);
  logger.info(`Number of files deleted: ${fCount}`);
}

function getDeleteAfterDuration(deleteFilesAfter) {
  switch (deleteFilesAfter) {
    case '1hr':
      return 1;
    case '24hrs':
      return 24;
    case '7days':
      return 24 * 7;
    case 'never':
    default:
      return Infinity;
  }
}

module.exports = deleteOldFiles;
