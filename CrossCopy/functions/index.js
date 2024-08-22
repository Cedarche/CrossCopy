const functions = require('firebase-functions');
const admin = require('firebase-admin');
const serviceAccount = functions.config().service_account.key;
const databaseURL = functions.config().service_account.database_url;
const storageBucket = functions.config().service_account.storage_bucket;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: databaseURL,
  storageBucket: storageBucket,
});

const deleteOldFiles = require('./deleteOldFiles');
const keepAwake = require('./keepAwake');
const app = require('./app');
const downloadApp = require('./downloadFiles');
const send = require('./shareFiles'); // Import the sendSMS function

exports.deleteOldFiles = functions
  .region('australia-southeast1')
  .pubsub.schedule('every 30 minutes')
  .onRun(deleteOldFiles);

exports.keepAwake = functions
  .region('australia-southeast1')
  .pubsub.schedule('every 3 minutes')
  .onRun(keepAwake);

exports.downloadApp = functions.region('australia-southeast1').https.onRequest(downloadApp);
exports.app = functions.region('australia-southeast1').https.onRequest(app);
exports.send = functions.region('australia-southeast1').https.onRequest(send); // Export the send express app
