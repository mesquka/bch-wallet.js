/* eslint-disable no-console */
const assert = require('assert');
const testVectors = require('./testVectors');
const Wallet = require('../index');
const encoder = require('../address/encoder');

/**
 * Wrap in async function so we can use await if needed
 */
async function test() {
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

  console.log('\n\nRUNNING WALLET TESTS');

  console.log('\nTESTING WALLET CREATION');
  const wallet = new Wallet(testVectors.mnemonic);
  console.log(wallet);

  console.log('\nTESTING ADDRESS DERIVATION');

  testVectors.derivations.forEach((vector, index) => {
    const address = wallet.derive(wallet.defaultDerivationPath, index, false);
    console.log(address);
    assert(address.public.equals(vector.public));
    assert(address.address === vector.address);
    assert(address.slp === vector.slp);
    assert(address.legacy === vector.legacy);
  });

  process.exit();
}

test();
