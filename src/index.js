const fs = require('fs');
const path = require('path');

const crypto = require('crypto'); // Crypto Module
const algorithm = 'aes-256-gcm'; // Algorithm used to encrypt (https://iopscience.iop.org/article/10.1088/1742-6596/1019/1/012008/pdf)
const key = crypto.randomBytes(32); // Key used to encrypt
const iv = crypto.randomBytes(16); // initialisierungs vektor (https://de.wikipedia.org/wiki/Initialisierungsvektor)

console.log(`key: ${key}`);
console.log(`iv: ${iv}`);

const messageBuffer = fs.readFileSync(path.resolve('./message.txt'));
const message = messageBuffer.toString();
console.log(`Message: ${message}`)



let keybuffer = Buffer.from(key);
console.log(`keybuffer: ${keybuffer}`)

const encrypt = (input) => {
  let cipher = crypto.createCipheriv('aes-256-gcm', keybuffer, iv);
  let encrypted = cipher.update(input);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  let data = { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
  fs.writeFileSync('./secret.enc', JSON.stringify(data), 'utf-8')
}
encrypt(message)


const decrypt = (input) => {
  let iv = Buffer.from(input.iv, 'hex')
  let encryptedInput = Buffer.from(input.encryptedData, 'hex');
  let decipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
  let decrypted = decipher.update(encryptedInput);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  let data = decrypted.toString()
  fs.writeFileSync('./decryptedMessage.txt', data, 'utf-8')
}

const messageToDecryptBuffer = fs.readFileSync(path.resolve('./secret.enc'));
const messageToDecrypt = JSON.parse(messageToDecryptBuffer);

decrypt(messageToDecrypt);
