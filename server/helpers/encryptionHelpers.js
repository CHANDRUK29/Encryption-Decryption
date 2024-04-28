const forge = require('node-forge')
const fs = require('fs')
const path = require('path')
require('dotenv').config()

// Generating KEY and IV for AES
//   const key = crypto.randomBytes(32).toString('hex');
//   const iv = crypto.randomBytes(16).toString('hex');



// Generating Public and Private Pem files
// const keys = forge.pki.rsa.generateKeyPair({bits:2048})
// const publicKey = forge.pki.publicKeyToPem(keys.publicKey)
// const privateKey = forge.pki.privateKeyToPem(keys.privateKey)


// write a pubilc and private key Data in pem files 

// fs.writeFileSync(path.join(__dirname,'..')+'/public.pem',publicKey,'utf-8')
// fs.writeFileSync(path.join(__dirname,'..')+'/private.pem',privateKey,'utf-8')



// console.log("public key",fs.readFileSync(path.join(__dirname,'..')+'/public.pem','utf-8'))
// console.log("private key",fs.readFileSync(path.join(__dirname,'..')+'/private.pem','utf-8'))



// encrypt data from backend
function encryptRSA(data){
try {
    const readPublicKeyData = forge.pki.publicKeyFromPem(fs.readFileSync(path.join(__dirname,'..')+'/public.pem','utf-8'))
    const encryptKey = forge.util.encode64(readPublicKeyData.encrypt(data)) 
    return encryptKey;
} catch (error) {
   return error; 
}
   
}
// decrypt data from front end
function decryptRSA(data){
    try {
        const readPrivateKey = forge.pki.privateKeyFromPem(fs.readFileSync(path.join(__dirname,'..')+'/private.pem','utf-8'))
        const decryptKey = readPrivateKey.decrypt(forge.util.decode64(data))
        return decryptKey;
    } catch (error) {
        return error;
    }
}

module.exports={
    encryptRSA,
    decryptRSA
}

