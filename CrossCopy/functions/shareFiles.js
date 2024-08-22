const express = require('express');
const cors = require('cors');
const twilio = require('twilio');
const functions = require('firebase-functions');
const logger = require('firebase-functions/logger');

const send = express();

const TWILIO_ACCOUNT_SID = functions.config().twilio.sid;
const TWILIO_AUTH_TOKEN = functions.config().twilio.token;
const TWILIO_PHONE_NUMBER = functions.config().twilio.phone;

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

send.use(cors({ origin: true }));
send.use(express.json());

send.post('/sendSMS', async (req, res) => {
  const { to, body } = req.body;
  logger.info(`Message body: ${req.body}`);

  try {
    const message = await client.messages.create({
      body: body,
      from: TWILIO_PHONE_NUMBER,
      to: to,
    });
    logger.info('Success');

    res.status(200).send({ sid: message.sid });
  } catch (err) {
    console.error('Failed to send SMS:', err);
    logger.info(`Failed to send SMS: ${err}`);
    res.status(500).json({ error: 'Failed to send SMS.' });
  }
});

module.exports = send;
