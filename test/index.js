/* eslint-disable no-console */

const SLPWallet = require('../index');

console.log('RUNNING TESTS');

console.log('\nCREATING SEED');
const seed = SLPWallet.generateSeed();
console.log(seed);

console.log('\nLISTING SUPPORTED COINS');
console.log(SLPWallet.supportedCoins);

console.log('\nCREATING WALLET');
const wallet = new SLPWallet(seed, SLPWallet.supportedCoins);
console.log(wallet);
