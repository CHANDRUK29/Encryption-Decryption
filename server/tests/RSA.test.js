const forge = require('node-forge');
const fs = require('fs');
const path = require('path');

const PRIVATE_KEY_PATH = path.resolve(process.cwd(), 'pem', 'private.pem');
const PUBLIC_KEY_PATH = path.resolve(process.cwd(), 'pem', 'public.pem');

const ALGORITHM = 'RSA-OAEP';

const SAMPLE_STRING = 'Hello World';
const SAMPLE_JSON = require('./data/dummyUser.json');
const SMALL_JSON = require('./data/dummyUserSmall.json');

const LABEL_1 = '\n\x1b[36mTime taken for encryption(SAMPLE_STRING)\x1b[0m';
const LABEL_2 = '\x1b[35mTime taken for decryption(SAMPLE_STRING)\x1b[0m';
const LABEL_3 = '\n\x1b[36mTime taken for encryption(SAMPLE_JSON_SMALL)\x1b[0m';
const LABEL_4 = '\x1b[35mTime taken for decryption(SAMPLE_JSON_SMALL)\x1b[0m';
const LABEL_5 = '\n\x1b[36mTime taken for encryption(SAMPLE_JSON)\x1b[0m';
const LABEL_6 = '\x1b[35mTime taken for decryption(SAMPLE_JSON)\x1b[0m';


//Generate Only when key pair is not available
if (!fs.existsSync(PUBLIC_KEY_PATH) && !fs.existsSync(PRIVATE_KEY_PATH)) {
    const keypair = forge.pki.rsa.generateKeyPair({ bits: 2048, e: 0x10001 });
    const publicKey = forge.pki.publicKeyToPem(keypair.publicKey);
    const privateKey = forge.pki.privateKeyToPem(keypair.privateKey);

    fs.writeFileSync(PRIVATE_KEY_PATH, privateKey);
    fs.writeFileSync(PUBLIC_KEY_PATH, publicKey);
}


function encryptData(data) {
    try {
        const publicKey = forge.pki.publicKeyFromPem(fs.readFileSync(PUBLIC_KEY_PATH).toString());
        let encrypted = publicKey.encrypt(data, ALGORITHM);
        return encrypted;
    } catch (e) {
        console.error('\n\x1b[41m%s:\x1b[0m \x1b[33m%s\x1b[0m\n', "Encryption failed", e.message);
        return false;
    }
}

function decryptData(encryptedData) {
    const privateKey = forge.pki.privateKeyFromPem(fs.readFileSync(PRIVATE_KEY_PATH).toString());
    let decrypted = privateKey.decrypt(encryptedData, ALGORITHM);
    return decrypted;
}

console.time(LABEL_1);
let t1 = encryptData(SAMPLE_STRING);
console.timeEnd(LABEL_1);
// console.log('Encrypted Data ----->', t1);

console.time(LABEL_2);
let res1 = decryptData(t1);
console.timeEnd(LABEL_2);
// console.log('Decrypted Data ----->', res1);

console.time(LABEL_3);
let t2 = encryptData(JSON.stringify(SMALL_JSON));
t2 && console.timeEnd(LABEL_3);
// console.log('Encrypted Data ----->', t2);

if (t2) {
    console.time(LABEL_4);
    let res2 = decryptData(t2);
    console.timeEnd(LABEL_4);
    // console.log('Decrypted Data ----->', JSON.parse(res2.toString()));
}

console.time(LABEL_5);
let t3 = encryptData(JSON.stringify(SAMPLE_JSON));
t3 && console.timeEnd(LABEL_5);
// console.log('Encrypted Data ----->', t2);

if (t3) {
    console.time(LABEL_6);
    let res2 = decryptData(t3);
    console.timeEnd(LABEL_6);
    // console.log('Decrypted Data ----->', JSON.parse(res2.toString()));
}
