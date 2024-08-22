const archiver = require('archiver');
const firebase = require('firebase-admin');
const bucket = firebase.storage().bucket();
const { v4: uuidv4 } = require('uuid');
const express = require('express');
const cors = require('cors');

const downloadApp = express();
downloadApp.use(express.json()); // To handle JSON request bodies
downloadApp.use(cors({ origin: true }));

downloadApp.get('/', (req, res) => {
  res.send('Cross Copy API');
});

downloadApp.post('/user/zipped', async (req, res) => {
  console.time('Total processing time');
  // const { uid } = req.params;
  const { files, sharedUid } = req.body;

  console.time('Creating archive');
  const archive = archiver('zip', {
    zlib: { level: 1 }, // Sets the compression level.
  });
  console.timeEnd('Creating archive');

  console.time('Creating read streams');
  const fileStreams = await Promise.all(
    files.map((file) => bucket.file(file.path).createReadStream())
  );
  console.timeEnd('Creating read streams');

  console.time('Appending files to archive');
  fileStreams.forEach((fileStream, index) => {
    archive.append(fileStream, { name: files[index].name.replace(/_/g, '.') });
  });
  console.timeEnd('Appending files to archive');

  console.time('Finalizing archive');
  archive.finalize();
  console.timeEnd('Finalizing archive');

  const fileName = `uploads/${sharedUid}/zipped/${uuidv4()}.zip`;
  const file = bucket.file(fileName);
  const writeStream = file.createWriteStream();
  archive.pipe(writeStream);

  let expiresDate = new Date();
  expiresDate.setHours(expiresDate.getHours() + 24);

  writeStream.on('finish', async () => {
    const config = {
      action: 'read',
      expires: expiresDate,
    };
    console.time('Getting signed URL');
    const [url] = await file.getSignedUrl(config);
    console.timeEnd('Getting signed URL');

    console.timeEnd('Total processing time');
    res.json({ zipUrl: url });
  });

  writeStream.on('error', (err) => {
    console.error('Error writing file to Firebase Storage:', err);
    res.status(500).send('Error writing file to Firebase Storage');
  });
});

// =============================================================================
// End point for shared files and anonymous users

downloadApp.post('/user/zipped', async (req, res) => {
  console.time('Total processing time');
  // const { uid } = req.params;
  const { files, sharedUid } = req.body;

  console.time('Creating archive');
  const archive = archiver('zip', {
    zlib: { level: 1 }, // Sets the compression level.
  });
  console.timeEnd('Creating archive');

  console.time('Creating read streams');
  const fileStreams = await Promise.all(
    files.map((file) => bucket.file(file.path).createReadStream())
  );
  console.timeEnd('Creating read streams');

  console.time('Appending files to archive');
  fileStreams.forEach((fileStream, index) => {
    archive.append(fileStream, { name: files[index].name.replace(/_/g, '.') });
  });
  console.timeEnd('Appending files to archive');

  console.time('Finalizing archive');
  archive.finalize();
  console.timeEnd('Finalizing archive');

  const fileName = `uploads/${sharedUid}/zipped/${uuidv4()}.zip`;
  const file = bucket.file(fileName);
  const writeStream = file.createWriteStream();
  archive.pipe(writeStream);

  let expiresDate = new Date();
  expiresDate.setHours(expiresDate.getHours() + 24);

  writeStream.on('finish', async () => {
    const config = {
      action: 'read',
      expires: expiresDate,
    };
    console.time('Getting signed URL');
    const [url] = await file.getSignedUrl(config);
    console.timeEnd('Getting signed URL');

    console.timeEnd('Total processing time');
    res.json({ zipUrl: url });
  });

  writeStream.on('error', (err) => {
    console.error('Error writing file to Firebase Storage:', err);
    res.status(500).send('Error writing file to Firebase Storage');
  });
});

// =============================================================================
// End point for logged in users
downloadApp.post('/user/:uid/zipped', async (req, res) => {
  console.time('Total processing time');
  const { uid } = req.params;
  const { files } = req.body;

  console.time('Creating archive');
  const archive = archiver('zip', {
    zlib: { level: 1 }, // Sets the compression level.
  });
  console.timeEnd('Creating archive');

  console.time('Creating read streams');
  const fileStreams = await Promise.all(
    files.map((file) => bucket.file(file.path).createReadStream())
  );
  console.timeEnd('Creating read streams');

  console.time('Appending files to archive');
  fileStreams.forEach((fileStream, index) => {
    archive.append(fileStream, { name: files[index].name.replace(/_/g, '.') });
  });
  console.timeEnd('Appending files to archive');

  console.time('Finalizing archive');
  archive.finalize();
  console.timeEnd('Finalizing archive');

  const fileName = `uploads/${uid}/zipped/${uuidv4()}.zip`;
  const file = bucket.file(fileName);
  const writeStream = file.createWriteStream();
  archive.pipe(writeStream);

  let expiresDate = new Date();
  expiresDate.setHours(expiresDate.getHours() + 24);

  writeStream.on('finish', async () => {
    const config = {
      action: 'read',
      expires: expiresDate,
    };
    console.time('Getting signed URL');
    const [url] = await file.getSignedUrl(config);
    console.timeEnd('Getting signed URL');

    console.timeEnd('Total processing time');
    res.json({ zipUrl: url });
  });

  writeStream.on('error', (err) => {
    console.error('Error writing file to Firebase Storage:', err);
    res.status(500).send('Error writing file to Firebase Storage');
  });
});

module.exports = downloadApp;
