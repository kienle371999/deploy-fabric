'use strict'

const CryptoJs = require('crypto-js')
const secp256k1 = require('secp256k1')
const hash256 = require('hash.js')
const atob = require('atob')
const btoa = require('btoa')
const { randomBytes } = require('crypto')


class BlocktraceCryptoGraphy {
    static GetInstance() {
        return new blocktraceCryptoGraphy
    }

    EncryptUsingSymmetricKey(symmetricKey, message) {
        return CryptoJs.AES.encrypt(message, symmetricKey).toString()
    }
    
    DecryptUsingSymmetricKey(symmetricKey, cipherText) {
        const plainText = CryptoJS.AES.decrypt(cipherText, symmetricKey)
        return plainText.toString(CryptoJS.enc.Utf8)
    }

    GenerateAsymmetricKeyPair() {
        let privateKey
        do {
          privateKey = randomBytes(32)
        } while (!secp256k1.privateKeyVerify(privateKey))
        
        const publicKey = secp256k1.publicKeyCreate(privateKey)
        console.log('private Key', privateKey)
        console.log('public Key', publicKey)
    
        return { privateKey: this.ConvertToBase64(privateKey), publicKey: this.ConvertToBase64(publicKey) }
    }
    
    SignMessage(privateKey, message) {
        const signature = secp256k1.ecdsaSign(this.ConvertMessage(message), this.ConvertBase64ToBuffer(privateKey))
    
        return { signature: this.ConvertToBase64(signature.signature) }
    }
    
    VerifyMessage(signature, message, publicKey) {
        const messageState = secp256k1.ecdsaVerify(this.ConvertBase64ToBuffer(signature), this.ConvertMessage(message), this.ConvertBase64ToBuffer(publicKey))
        return messageState
    }
    
    ConvertMessage(message) {
        const jsonString = JSON.stringify(message)
        const hashBytes = hash256.sha256().update(jsonString).digest()
        return Uint8Array.from(atob(hashBytes), c => c.charCodeAt(0))
    }
    
    ConvertBase64ToBuffer(base64String) {
        return Uint8Array.from(atob(base64String), c => c.charCodeAt(0))
    }
    
    ConvertToBase64(arrayBuffer) {
        const base64String = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))
        return base64String
    }
}

module.exports = BlocktraceCryptoGraphy
