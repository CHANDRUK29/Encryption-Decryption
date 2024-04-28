// Function to encrypt the request body// middleware/encryption.js
const forge = require("node-forge");
const crypto = require('crypto')
const fs = require('fs')


// function encryptRequestBody(key, iv) {
//   return (req, res, next) => {
//     const cipher = forge.cipher.createCipher(
//       "AES-CBC",
//       forge.util.hexToBytes(key)
//     );
//     cipher.start({ iv: forge.util.hexToBytes(iv) });

//     const requestBody = JSON.stringify(req.body);
//     const encryptedRequestBody = cipher.update(
//       forge.util.createBuffer(requestBody, "utf8")
//     );
//     cipher.finish();

//     req.encryptedBody = encryptedRequestBody.toHex();
//     next();
//   };
// }

// function decryptResponseBody() {
//   return (req, res, next) => {
//     const decipher = forge.cipher.createDecipher(
//       "AES-CBC",
//       forge.util.hexToBytes(process.env.KEY)
//     );
//     decipher.start({ iv: forge.util.hexToBytes(process.env.CIPHER_IV) });
//    decipher.update(
//       forge.util.createBuffer(forge.util.hexToBytes(req.body))
//     );
//     decipher.finish();
//     req.requestBody = decipher.output.toString('utf8')
//     next();

//     // res.json(JSON.parse(decryptedResponseBody.toString("utf8")));
//   };
// }
function genrateServerAESKeyAndIV(keyLength = 32, ivLength = 16) {
  const aesKey = forge.random.getBytesSync(32) // 256-bit AES Key
  const iv = forge.random.getBytesSync(16) // 128-bit IV
  const serverKey = forge.util.bytesToHex(aesKey);
  const serverIv = forge.util.bytesToHex(iv);
  // console.log("clinent key",serverKey)
  // console.log("clinet Iv",serverIv)
  // const clientKey = crypto.randomBytes(keyLength).toString('hex');
  // const clinetIv = crypto.randomBytes(ivLength).toString('hex');
  return { serverKey, serverIv };
}


const encryptServerKey = (key) => {
  try {
    const readPublicKey = forge.pki.publicKeyFromPem(fs.readFileSync('responsePublic.pem', 'utf-8'))
    const serverEncryptedKey = forge.util.encode64(readPublicKey.encrypt(key))
    // console.log("encrypted----> ",clientEncryptedKey)
    return serverEncryptedKey;
  } catch (error) {
    console.log(error)
    return error;
  }
}


const decryptClientKey = (key) => {
  try {
    const readClientPrivateKey = forge.pki.privateKeyFromPem(fs.readFileSync('requestPrivate.pem', 'utf-8'))
    const decryptedClientAesKEy = readClientPrivateKey.decrypt(forge.util.decode64(key))
    return decryptedClientAesKEy
  } catch (error) {
    console.log(error)
    return error;
  }
}

const encryptResponseBody = (cipherText) => {
  try {
    const { serverKey, serverIv } = genrateServerAESKeyAndIV();
    const cipher = forge.cipher.createCipher('AES-CBC', forge.util.hexToBytes(serverKey))
    cipher.start({ iv: forge.util.hexToBytes(serverIv) })
    cipher.update(forge.util.createBuffer(JSON.stringify(cipherText), 'utf8'))
    cipher.finish()
    const serverEncryptedKey = encryptServerKey(serverKey)
    // const serverEncryptedIv = encryptServerKey(serverIv)
    return { key: serverEncryptedKey, iv: serverIv, data: cipher.output.toHex() }
  } catch (error) {
    return error.message
  }
}


const decryptRequestBody = (req, res, next) => {
  try {
    console.log("before decryption", req.body)
    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
      const getKey = decryptClientKey(req.body.key)
      // const getIv = decryptClientKey(req.body.iv)
      const decipher = forge.cipher.createDecipher("AES-CBC", forge.util.hexToBytes(getKey));
      decipher.start({ iv: forge.util.hexToBytes(req.body.iv) });
      decipher.update(forge.util.createBuffer(forge.util.hexToBytes(req.body.data)));
      decipher.finish();
      console.log(decipher.output.toString('utf8'))
      req.body = JSON.parse(decipher.output.toString('utf8'))
      console.log("after decryption", req.body)
      next();
    }
    if (['GET', 'DELETE'].includes(req.method)) {
      next();
    }

  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'internal server error', error: error.message })
  }
}



module.exports = { encryptResponseBody, decryptRequestBody };
