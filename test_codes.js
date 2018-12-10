const deviceWallet = require('./device-wallet');
const scanf = require('scanf');
const fs = require('fs');

if( deviceWallet.getDevice() === null ) {
    console.log("Skycoin hardware NOT FOUND, using emulator");
    deviceWallet.setDeviceType(deviceWallet.DeviceTypeEnum.EMULATOR);
} else {
    deviceWallet.setDeviceType(deviceWallet.DeviceTypeEnum.USB);
}
const rejectPromise = function(msg) {
  console.log("Promise rejected", msg);
};

const pinCodeReader = function() {
    return new Promise((resolve, reject) => {
        console.log("Got inside pinCodeReader");
        const pinCode = scanf('%s');
        if (pinCode.length != 4) {
            reject(new Error("Bad bad pin code"));
            return;
        }
        resolve(pinCode);
    });
};

const testSign = false;
const testPinChange = false;

if (testSign) {
    const signPromise = deviceWallet.devSkycoinSignMessagePinCode(3, "Hello World!", null);
    signPromise.then(
        (signature) => {
            console.log("Signature promise resolved", signature);
            const signPromise2 = deviceWallet.devSkycoinSignMessagePinCode(3, "Hello World!", pinCodeReader);
            signPromise2.then(
                (signature2) => {
                    console.log("Signature promise resolved", signature2);
                },
                rejectPromise
            );
        },
        rejectPromise
    );
}

if (testPinChange) {
    const promise = deviceWallet.devChangePin(pinCodeReader);
    promise.then(
        () => {
            console.log("promise resolved");
            const promise2 = deviceWallet.devChangePin();
            promise2.then(
                () => {
                    console.log("promise resolved");
                },
                rejectPromise
            );
        },
        rejectPromise
    );
}

const testFirmwareUpdate = false;

if (testFirmwareUpdate) {
    fs.readFile('fw_magic.bin', function(err, data) {
        console.log(err);
        console.log(data);
        console.log(data.length);
        deviceWallet.devUpdateFirmware(data, []);
  });
}

const testGetVersion = false;

if (testGetVersion) {
    const promise = deviceWallet.devGetVersionDevice();
    promise.then(
        (version) => {
            console.log("Version is: ", version);
        },
        rejectPromise
    );
}

const testRecovery = true;

const wordReader = function() {
    return new Promise((resolve) => {
        console.log("Input word: ");
        const word = scanf('%s');
        resolve(word);
    });
};

if (testRecovery) {
    const promise = deviceWallet.devRecoveryDevice(wordReader);
    promise.then(console.log, rejectPromise);
}

const testFeatures = false;

if (testFeatures) {
    const promise = deviceWallet.devGetFeatures();
    promise.then(console.log, rejectPromise);
}

const testCancel = false;
if (testCancel) {
    const promise = deviceWallet.devCancelRequest();
    promise.then(console.log, rejectPromise);
}
