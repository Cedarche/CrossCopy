const crypto = require('crypto');
const algorithm = 'aes-256-ctr';
const functions = require('firebase-functions');
const secret = functions.config().encryption.secret;

// Create a hash of the secret
const hash = crypto.createHash('sha256');
hash.update(secret);
const secretKey = hash.digest().slice(0, 32); // Use the first 32 bytes of the hash

const encrypt = (text) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
  return {
    iv: iv.toString('hex'),
    encryptedData: encrypted.toString('hex'),
  };
};

const decrypt = (encryptedText, inputIv) => {
  const iv = Buffer.from(inputIv, 'hex');
  const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);
  const decrpyted = Buffer.concat([
    decipher.update(Buffer.from(encryptedText, 'hex')),
    decipher.final(),
  ]);
  return decrpyted.toString();
};

module.exports = { encrypt, decrypt };
