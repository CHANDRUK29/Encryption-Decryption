import forge from 'node-forge'


function genrateClientAESKeyAndIV(keyLength = 32, ivLength = 16) {
    const aesKey = forge.random.getBytesSync(32) // 256-bit AES Key
    const iv = forge.random.getBytesSync(16) // 128-bit IV
    const clientKey = forge.util.bytesToHex(aesKey);
    const clientIv = forge.util.bytesToHex(iv);
    // console.log("clinent key",clientKey)
    // console.log("clinet Iv",clientIv)
    // const clientKey = crypto.randomBytes(keyLength).toString('hex');
    // const clinetIv = crypto.randomBytes(ivLength).toString('hex');
    return { clientKey,clientIv };
  }
  
  function encryptClientKey(key){
    try {
        // const readPubilcKey = forge.pki.publicKeyFromPem(publicRequestPem,'utf-8')
        const readPubilcKey = forge.pki.publicKeyFromPem(import.meta.env.VITE_PUBLIC_REQUEST_PEM,'utf-8')
        const clientEncryptedKey = forge.util.encode64(readPubilcKey.encrypt(key))
        // console.log("encrypted----> ",clientEncryptedKey)
        return clientEncryptedKey;
    } catch (error) {
        console.log(error)
        return error;
    }
}

function decryptKeyAndIV(key) {
    try {
        // const readPrivateKey = forge.pki.privateKeyFromPem(responsePrivatePem, 'utf-8')
        const readPrivateKey = forge.pki.privateKeyFromPem(import.meta.env.VITE_RESPONSE_PRIVATE_PEM, 'utf-8')
        const decryptKey = readPrivateKey.decrypt(forge.util.decode64(key))
        return decryptKey;
    } catch (error) {
        return error;
    }
}


export function encryptDataAes(data) {
    const { clientKey,clientIv } = genrateClientAESKeyAndIV();
    const cipher = forge.cipher.createCipher('AES-CBC', forge.util.hexToBytes(clientKey))
    cipher.start({ iv: forge.util.hexToBytes(clientIv) })
    cipher.update(forge.util.createBuffer(JSON.stringify(data), 'utf8'))
    cipher.finish()
    const clientEncryptedKey = encryptClientKey(clientKey)
    // const clientEncryptedIV = encryptClientKey(clientIv)
    return {key:clientEncryptedKey,iv:clientIv, data:cipher.output.toHex()}
}

export function decryptDataAes(data) {
try {
    const getKey = decryptKeyAndIV(data.key)
    // const getIv = decryptKeyAndIV(data.iv)
    const decipher = forge.cipher.createDecipher('AES-CBC', forge.util.hexToBytes(getKey))
    decipher.start({ iv: forge.util.hexToBytes(data.iv) })
    decipher.update(forge.util.createBuffer(forge.util.hexToBytes(data.data)))
    decipher.finish()
    return JSON.parse(decipher.output.toString('utf8'))
    
} catch (error) {
    console.log(error)
}
}








export function encrypt(publicKey, data) {
    // if(typeof data === 'string'){
    //     const getPublickey = forge.pki.publicKeyFromPem(publicKey)
    //     const encryptData = forge.util.encode64(getPublickey.encrypt(data))
    //     return encryptData;
    // }
    // if(typeof data === 'object'){

    const getPublickey = forge.pki.publicKeyFromPem(publicKey)
    const getStringifiedObject = JSON.stringify(data)
    const encryptData = forge.util.encode64(getPublickey.encrypt(getStringifiedObject, 'RSA-OAEP'))
    return encryptData;
    // }
}

export function decrypt(privateKey, data) {
    // if(typeof data === 'string'){
    //     const getPrivateKey = forge.pki.privateKeyFromPem(privateKey)
    //     const decryptData = getPrivateKey.decrypt(forge.util.decode64(data))
    //     return decryptData;
    // }
    // if(typeof data === 'object'){
    const getPrivateKey = forge.pki.privateKeyFromPem(privateKey)
    const stringifiedDecryptData = getPrivateKey.decrypt(forge.util.decode64(data), 'RSA-OAEP')
    const decryptData = JSON.parse(stringifiedDecryptData)
    return decryptData;
    // }
}