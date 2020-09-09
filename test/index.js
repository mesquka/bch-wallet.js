/* eslint-disable no-console */
const assert = require('assert');
const testVectors = require('./testVectors');
const encoder = require('../address/encoder');

console.log('\n\nRUNNING ADDRESS TESTS');

console.log('\nTESTING ENCODER');

testVectors.derivations.forEach((vector) => {
  console.log();

  console.log(vector.hash160);

  const address = encoder.encodeCashaddress('bitcoincash', 'P2PKH', vector.hash160);
  console.log(address);
  assert(encoder.decodeCashaddress(address).hash160.equals(vector.hash160));
  assert(address === vector.address);
  assert(encoder.validate(address));
  assert(encoder.validateCashaddress(address));

  const legacy = encoder.encodeLegacy('mainnet', 'P2PKH', vector.hash160);
  console.log(legacy);
  assert(encoder.decodeLegacy(legacy).hash160.equals(vector.hash160));
  assert(legacy === vector.legacy);
  assert(encoder.validate(legacy));
  assert(encoder.validateLegacyaddress(legacy));

  const slp = encoder.encodeCashaddress('simpleledger', 'P2PKH', vector.hash160);
  console.log(slp);
  assert(encoder.decodeCashaddress(slp).hash160.equals(vector.hash160));
  assert(slp === vector.slp);
  assert(encoder.validate(slp));
  assert(encoder.validateCashaddress(slp));
});

const Wallet = require('../index');

console.log('\n\nRUNNING WALLET TESTS');

console.log('\nTESTING WALLET CREATION');
const wallet = new Wallet(testVectors.mnemonic, 'mainnet');
console.log(wallet);

console.log('\nTESTING ADDRESS DERIVATION');

testVectors.derivations.forEach((vector, index) => {
  const address = wallet.derive("m/44'/145'/0'", index, false);
  console.log(address);
  assert(address.public.equals(vector.public));
  assert(address.address === vector.address);
  assert(address.slp === vector.slp);
  assert(address.legacy === vector.legacy);
});
