const forge = require('node-forge');
const fs = require('fs');
const path = require('path');

const PRIVATE_KEY_PATH = path.resolve(process.cwd(), 'pem', 'private.pem');
const PUBLIC_KEY_PATH = path.resolve(process.cwd(), 'pem', 'public.pem');

const AES_ALGORITHM = 'AES-CBC';
const RSA_ALGORITHM = 'RSA-OAEP';

const SAMPLE_JSON = require('./data/dummyUser.json');

const LABEL_1 = '\n\x1b[36mTime taken for encryption\x1b[0m';
const LABEL_2 = '\x1b[35mTime taken for decryption\x1b[0m';

//Generate Only when key pair is not available
if (!fs.existsSync(PUBLIC_KEY_PATH) && !fs.existsSync(PRIVATE_KEY_PATH)) {
    const keypair = forge.pki.rsa.generateKeyPair({ bits: 2048, e: 0x10001 });
    const publicKey = forge.pki.publicKeyToPem(keypair.publicKey);
    const privateKey = forge.pki.privateKeyToPem(keypair.privateKey);

    fs.writeFileSync(PRIVATE_KEY_PATH, privateKey);
    fs.writeFileSync(PUBLIC_KEY_PATH, publicKey);
}

function encryptKeyUsingRSA(key) {
    const publicKey = forge.pki.publicKeyFromPem(fs.readFileSync(PUBLIC_KEY_PATH).toString());
    let encrypted = publicKey.encrypt(key, RSA_ALGORITHM);
    return encrypted;
}

function decryptKeyUsingRSA(encryptedKey) {
    const privateKey = forge.pki.privateKeyFromPem(fs.readFileSync(PRIVATE_KEY_PATH).toString());
    let decrypted = privateKey.decrypt(encryptedKey, RSA_ALGORITHM);
    return decrypted;
}

function encryptDataUsingAES(data) {
    const key = forge.random.getBytesSync(32);
    const iv = forge.random.getBytesSync(16);
    const encryptedKey = encryptKeyUsingRSA(key);

    let cipher = forge.cipher.createCipher(AES_ALGORITHM, key);
    cipher.start({ iv: iv });
    cipher.update(forge.util.createBuffer(data));
    cipher.finish();
    const encrypted = cipher.output;
    return {
        encrypted,
        encryptedKey,
        iv
    };
}

function decryptDataUsingAES(encryptedData, encryptedKey, iv) {
    const key = decryptKeyUsingRSA(encryptedKey);
    let decipher = forge.cipher.createDecipher(AES_ALGORITHM, key);
    decipher.start({ iv: iv });
    decipher.update(forge.util.createBuffer(encryptedData));
    decipher.finish();
    const decrypted = decipher.output;
    return decrypted;
}

console.time(LABEL_1);
let t1 = encryptDataUsingAES(JSON.stringify(SAMPLE_JSON));
console.timeEnd(LABEL_1);

console.time(LABEL_2);
let res1 = decryptDataUsingAES(t1.encrypted, t1.encryptedKey, t1.iv);
console.timeEnd(LABEL_2);

console.log('\nEncrypted Data ----->\n', t1.encrypted.toHex());
console.log('\nDecrypted Data ----->\n', JSON.parse(res1.toString()));
