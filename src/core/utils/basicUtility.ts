import CryptoJS from 'crypto-js';

const BasicUtility = {
    decodeResponse: async (data, key) => {
        try {
            console.log(data, key);
            const bytes = await CryptoJS.AES.decrypt(data, key);
            const originalText = bytes.toString(CryptoJS.enc.Utf8);
            console.log(bytes, JSON.parse(originalText));
            return JSON.parse(originalText);
        } catch (err) {
            console.error('Error: decodeResponse', JSON.stringify(err));
            return new Error(err);
        }
    },
    encodeRequest: async (data, checker) => {
        try {
            //data = JSON.stringify(data);
            const ciphertext = CryptoJS.AES.encrypt(data, checker).toString();
            return ciphertext;
        } catch (err) {
            console.error('Error: encodeRequest', JSON.stringify(err));
            return new Error(err);
        }
    },
    renameKey: (keyName) => {
        const currentTimeStamp = Date.now();
        const customName = (currentTimeStamp + '_' + keyName).replace(/ /g, '');
        return customName;
    }
};

export default BasicUtility;