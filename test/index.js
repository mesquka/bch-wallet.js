/* eslint-disable no-console */

const BCHWallet = require('../index');

console.log('RUNNING TESTS');

console.log('\nCREATING MNEMONIC');
const mnemonic = BCHWallet.generateMnemonic();
console.log(mnemonic);

console.log('\nCREATING WALLET');
const wallet = new BCHWallet(mnemonic);
console.log(wallet);
