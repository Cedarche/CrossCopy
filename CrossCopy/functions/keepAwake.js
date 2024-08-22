const fetch = require('node-fetch');
const functions = require('firebase-functions');
const appURL = functions.config().function_url.app;
const downloadURL = functions.config().function_url.download;

async function keepAwake() {
  await fetch(appURL);
  await fetch(downloadURL);
  console.log('Ping to main function completed');
  return null;
}

module.exports = keepAwake;
