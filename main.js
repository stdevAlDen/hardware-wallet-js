const deviceWallet = require('./device-wallet');

if( deviceWallet.getDevice() === null ) {
  console.log("Skycoin hardware NOT FOUND, using emulator");
  deviceWallet.emulatorAddressGenPinCode(2, 3);
  deviceWallet.emulatorSkycoinSignMessagePinCode(3, "Hello World!");
} else {
  console.log("Skycoin hardware is plugged in");
  deviceWallet.deviceAddressGen(2, 3);
}
