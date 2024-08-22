const express = require('express');
const firebase = require('firebase-admin');
const cors = require('cors');

const { check, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const logger = require('firebase-functions/logger');
const functions = require('firebase-functions');
const sgMail = require('@sendgrid/mail');
const { encrypt, decrypt } = require('./encryption'); // replace with the path to your crypto file

const bucket = firebase.storage().bucket();
const sendGrid = functions.config().sendgrid.key;

sgMail.setApiKey(sendGrid);

const db = firebase.database();
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 300, // limit each IP to 100 requests per windowMs
});

const app = express();
app.use(limiter);
app.use(express.json()); // To handle JSON request bodies
app.use(cors()); // This will handle CORS for all routes

app.get('/', (req, res) => {
  res.send('Cross Copy API');
});

app.post(
  '/signup/:userId',
  [
    check('userId').isAlphanumeric().withMessage('User ID must be alphanumeric'),
    check('email').isEmail().withMessage('Email must be valid'),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { userId } = req.params;
    const { email } = req.body;
    const linkingCode = Math.floor(1000000 + Math.random() * 9000000); // Generates a random 7-digit number

    db.ref(`users/${userId}`)
      .set({
        email,
        autoCopy: false,
        saveHistory: true,
        deleteFilesAfter: '7days',
        paidUser: false,
        text: 'Welcome to Cross Copy - Type or paste here',
        linkingCode: linkingCode,
      })
      .then(() => {
        res.status(200).send({ message: 'User created successfully' });
      })
      .catch((err) => {
        logger.info(`Error: ${err}`), res.status(500).send('Something went wrong');
      });
  }
);

// ======================================================================================
// Get recent changed text
app.get(
  '/user/:userId',
  [check('userId').isAlphanumeric().withMessage('User ID must be alphanumeric')],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { userId } = req.params;
    db.ref(`users/${userId}/text`)
      .once('value')
      .then((snapshot) => {
        const data = snapshot.val();
        console.log(data); // Add this line to inspect the data
        if (data) {
          // Send the data directly without decrypting
          res.status(200).send({ text: data });
        } else {
          res.status(500).send({ text: '' });
        }
      })
      .catch((err) => {
        logger.info(`Error: ${err}`), res.status(500).send('Something went wrong');
      });
  }
);

// ======================================================================================
// Change text endpoint
app.post(
  '/user/:userId/text',
  [
    check('userId').isAlphanumeric().withMessage('User ID must be alphanumeric'),
    check('text').isString().withMessage('Text must be a string'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { userId } = req.params; // Extract userId from request parameters
    const { text } = req.body; // Extract text from request body
    const decodedText = decodeURIComponent(text);

    db.ref(`users/${userId}/text`)
      .set(decodedText)
      .then(() => {
        res.status(200).send({ message: 'Updated successfully' });
      })
      .catch((err) => {
        logger.info(`Error: ${err}`), res.status(500).send('Something went wrong');
      });
  }
);

// ======================================================================================
// Endpoint for updating the user's history
app.post(
  '/user/:userId/history',
  [
    check('userId').isAlphanumeric().withMessage('User ID must be alphanumeric'),
    check('text').isString().withMessage('Text must be a string'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { userId } = req.params; // Extract userId from request parameters
    const { text } = req.body; // Extract text from request body
    const decodedText = decodeURIComponent(text);

    if (decodedText.trim() !== '' && !decodedText.trim().includes('<br>')) {
      const checkHistoryStatus = await (
        await db.ref(`users/${userId}/saveHistory`).once('value')
      ).val();

      if (checkHistoryStatus) {
        const timestamp = Date.now();
        if (decodedText.length >= 5 || /https?:\/\/[\S]+/.test(decodedText)) {
          // Retrieve the last three entries from the history
          const snapshot = await db
            .ref(`users/${userId}/history`)
            .orderByKey()
            .limitToLast(3)
            .once('value');
          const history = snapshot.val();

          // Check if the new text matches any of the last three entries
          const isDuplicate = Object.values(history || {}).some(
            (entry) => entry.text === decodedText
          );

          // If the new text is not a duplicate, add it to the history
          if (!isDuplicate) {
            const encryptedData = encrypt(decodedText);
            db.ref(`users/${userId}/history/${timestamp}`)
              .set(encryptedData)
              .then(() => {
                res.status(200).send({ message: 'Updated history successfully' });
              })
              .catch((err) => {
                logger.info(`Send text error: ${err}`),
                  res.status(500).send('Something went wrong');
              });
          } else {
            res.status(204).send({ message: 'Duplicate text' });
          }
        } else {
          res.status(204).send({ message: 'Invalid text' });
        }
      } else {
        res.status(204).send({ message: 'History saving is disabled' });
      }
    } else {
      res.status(204).send({ message: 'Text not valid for History' });
    }
  }
);

app.delete(
  '/user/:userId',
  [check('userId').isAlphanumeric().withMessage('User ID must be alphanumeric')],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { userId } = req.params;

    // List all files in the user's directory
    const [files] = await bucket.getFiles({ prefix: `uploads/${userId}/` });

    // Delete all files
    const deletePromises = files.map((file) => file.delete());
    await Promise.all(deletePromises);

    // Delete the user's database entry
    db.ref(`users/${userId}`)
      .remove()
      .then(() => {
        // Delete authentication
        return firebase.auth().deleteUser(userId);
      })
      .then(() => {
        res.send({ message: 'User deleted successfully' });
      })
      .catch((err) => {
        logger.info(`Error: ${err}`), res.status(500).send('Something went wrong');
      });
  }
);

app.post('/decrypt', (req, res) => {
  const { text, iv } = req.body;
  if (!text || !iv) {
    return res.status(400).json({ error: 'Missing text or iv' });
  }

  try {
    const decryptedText = decrypt(text, iv);
    res.json({ decryptedText });
  } catch (error) {
    console.error('Failed to decrypt text:', error);
    res.status(500).json({ error: 'Failed to decrypt text' });
  }
});

app.get(
  '/user/:userId/history',
  [check('userId').isAlphanumeric().withMessage('User ID must be alphanumeric')],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { userId } = req.params; // Extract userId from request parameters

    try {
      const historyRef = firebase.database().ref(`users/${userId}/history`);
      const snapshot = await historyRef.once('value');
      let history = snapshot.val();
      // Convert the history object into an array of objects, each containing a timestamp and text
      let historyArray = Object.entries(history || {}).map(([timestamp, data]) => ({
        timestamp: parseInt(timestamp),
        text: decrypt(data.encryptedData, data.iv), // Decrypt the text
      }));

      // Sort the history by timestamp in descending order (most recent first)
      historyArray.sort((a, b) => b.timestamp - a.timestamp);

      // Return only the last 50 items
      historyArray = historyArray.slice(0, 50);

      res.status(200).json(historyArray);
    } catch (err) {
      logger.error(`Failed to fetch history: ${err}`);
      res.status(500).send('Failed to fetch history');
    }
  }
);

app.get(
  '/uploads/:uid',
  [check('uid').isAlphanumeric().withMessage('User ID must be alphanumeric')],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const ref = db.ref(`uploads/${req.params.uid}`);
    ref.once(
      'value',
      (snapshot) => {
        const files = snapshot.val() || {};
        // Convert the files object to an array
        const filesArray = Object.values(files);
        // Sort the files array by uploadTimestamp in descending order
        filesArray.sort((a, b) => b.uploadTimestamp - a.uploadTimestamp);
        res.json(filesArray);
      },
      (error) => {
        res.status(500).json({ error: error.message });
      }
    );
  }
);

app.post(
  '/uploads/:uid/:fileName',
  [check('uid').isAlphanumeric().withMessage('User ID must be alphanumeric')],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const ref = db.ref(`uploads/${req.params.uid}/${req.params.fileName}`);
    const fileData = {
      ...req.body,
      uploadTimestamp: Date.now(), // Add the upload timestamp
    };
    ref
      .set(fileData)
      .then(() => {
        res.json({ message: 'File uploaded successfully' });
      })
      .catch((err) => {
        logger.info(`Error: ${err}`), res.status(500).send('Something went wrong');
      });
  }
);

app.delete(
  '/uploads/:uid/:fileName',
  [check('uid').isAlphanumeric().withMessage('User ID must be alphanumeric')],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { uid, fileName } = req.params;

    // Delete the file from Firebase Storage
    const file = bucket.file(`uploads/${uid}/${fileName}`);
    await file.delete();

    // Delete the reference to the file in the database
    const ref = db.ref(`uploads/${uid}/${fileName}`);
    ref
      .remove()
      .then(() => {
        res.json({ message: 'File deleted successfully from Database and Storage' });
      })
      .catch((err) => {
        logger.info(`Error: ${err}`), res.status(500).send('Something went wrong');
      });
  }
);

app.get('/user/settings/:userId', (req, res) => {
  const { userId } = req.params;
  db.ref(`users/${userId}`)
    .once('value')
    .then((snapshot) => {
      const data = snapshot.val();
      const { autoCopy, saveHistory, deleteFilesAfter } = data;
      res.send({ autoCopy, saveHistory, deleteFilesAfter });
    })
    .catch((err) => {
      logger.info(`Error: ${err}`), res.status(500).send('Something went wrong');
    });
});

app.post(
  '/user/settings/:userId',
  [check('userId').isAlphanumeric().withMessage('User ID must be alphanumeric')],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { userId } = req.params; // Extract userId from request parameters
    const { autoCopy, saveHistory, deleteFilesAfter } = req.body; // Extract settings from request body

    const userRef = db.ref(`users/${userId}`);

    if (autoCopy !== undefined) {
      userRef.child('autoCopy').set(autoCopy);
    }

    if (saveHistory !== undefined) {
      userRef.child('saveHistory').set(saveHistory);
    }

    if (deleteFilesAfter !== undefined) {
      userRef.child('deleteFilesAfter').set(deleteFilesAfter);
    }

    res.status(200).send({ message: 'Settings updated successfully' });
  }
);

app.post('/send-email', async (req, res) => {
  try {
    const { email, message } = req.body;

    // Send the email
    const msg = {
      to: 'crosscopydev@gmail.com',
      from: 'reamreceipts@gmail.com',
      subject: 'New Contact Message',
      text: `From: ${email}\n\nMessage: ${message}`,
    };

    await sgMail.send(msg);

    // Add to Realtime Database with a timestamp
    const newMessageRef = db.ref('messages').push();
    newMessageRef
      .set({
        email,
        message,
        timestamp: Date.now(),
      })
      .then(() => {
        res.status(200).send({ message: 'Mail sent and data added to database successfully' });
      })
      .catch((err) => {
        console.error(`Error: ${err}`);
        res.status(500).send('Something went wrong');
      });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send({ success: false, message: 'Internal Server Error' });
  }
});

module.exports = app;
