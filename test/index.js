/* eslint-disable no-console */

const BCHWallet = require('../index');

console.log('RUNNING TESTS');

console.log('\nGENERATING MNEMONIC');
const mnemonic = BCHWallet.generateMnemonic();
console.log(mnemonic);

console.log('\nCREATING WALLET');
const wallet = new BCHWallet(mnemonic, 'mainnet');
console.log(wallet);

console.log('\nDERIVE ADDRESS');
console.log(wallet.derive("m/44'/145'", 0, false));

console.log('\nGET ADDRESS');
console.log(wallet.address);

console.log('\nGET SLP ADDRESS');
console.log(wallet.slpAddress);

console.log('\nGET LEGACY ADDRESS');
console.log(wallet.legacyAddress);
