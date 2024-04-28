const forge = require('node-forge');

const ALGORITHM = 'AES-CBC';

const SAMPLE_STRING = 'Hello World';
const SAMPLE_JSON = require('./data/dummyPosts.json');

const LABEL_1 = '\n\x1b[36mTime taken for encryption(SAMPLE_STRING)\x1b[0m';
const LABEL_2 = '\x1b[35mTime taken for decryption(SAMPLE_STRING)\x1b[0m';
const LABEL_3 = '\n\x1b[36mTime taken for encryption(SAMPLE_JSON)\x1b[0m';
const LABEL_4 = '\x1b[35mTime taken for decryption(SAMPLE_JSON)\x1b[0m';

function encryptData(data) {
    const key = forge.random.getBytesSync(32);
    const iv = forge.random.getBytesSync(16);

    let cipher = forge.cipher.createCipher(ALGORITHM, key);
    cipher.start({ iv: iv });
    cipher.update(forge.util.createBuffer(data));
    cipher.finish();
    const encrypted = cipher.output;
    return {
        encrypted,
        key,
        iv
    };
}

function decryptData(encryptedData, key, iv) {
    let decipher = forge.cipher.createDecipher(ALGORITHM, key);
    decipher.start({ iv: iv });
    decipher.update(forge.util.createBuffer(encryptedData));
    decipher.finish();
    const decrypted = decipher.output;
    return decrypted;
}

console.time(LABEL_1);
let t1 = encryptData(SAMPLE_STRING);
console.timeEnd(LABEL_1);
// console.log('Encrypted Data ----->', t1.encrypted.toHex());

console.time(LABEL_2);
let res1 = decryptData(t1.encrypted, t1.key, t1.iv);
console.timeEnd(LABEL_2);
// console.log('Decrypted Data ----->', res1.toString());

console.time(LABEL_3);
let t2 = encryptData(JSON.stringify(SAMPLE_JSON));
console.timeEnd(LABEL_3);
// console.log('Encrypted Data ----->', t2.encrypted.toHex());


console.time(LABEL_4);
let res2 = decryptData(t2.encrypted, t2.key, t2.iv);
console.timeEnd(LABEL_4);
// console.log('Decrypted Data ----->', JSON.parse(res2.toString()));
