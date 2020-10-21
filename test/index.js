/* eslint-disable no-console */
const assert = require('assert');
const testVectors = require('./testVectors');
const Wallet = require('../index');
const Transaction = require('../transaction');
const addressEncoder = require('../address/encoder');
const script = require('../script');

/**
 * Wrap in async function so we can use await if needed
 */
async function test() {
  console.log('\nTESTING SCRIPT COMPILER');
  testVectors.scripts.forEach((scriptVector) => {
    console.log(scriptVector.asm);
    const compiled = script.compile(scriptVector.asm);
    assert(compiled === scriptVector.hex);
    assert(script.decompile(compiled) === scriptVector.asm);
  });

  console.log('\nTESTING VM');
  testVectors.vm.forEach((vector) => {
    console.log(vector.name);
    const vm = new script.VM();
    vm.script = vector.test.split(' ');
    vm.transaction = vector.transaction;
    vm.execute();
    console.log(vm);
    vm.stack.forEach((value, index) => {
      assert(value.eq(vector.expectedStack[index]));
    });
    assert(vm.stack.length === vector.expectedStack.length);
    vm.altStack.forEach((value, index) => {
      assert(value.eq(vector.expectedAltStack[index]));
    });
    assert(vm.altStack.length === vector.expectedAltStack.length);
  });

  console.log('\nTESTING ENCODER');
  testVectors.derivations.forEach((vector) => {
    console.log();

    console.log(vector.hash160);

    const address = addressEncoder.encodeCashaddress('bitcoincash', 'P2PKH', vector.hash160);
    console.log(address);
    assert(addressEncoder.decodeCashaddress(address).hash160.equals(vector.hash160));
    assert(address === vector.address);
    assert(addressEncoder.validate(address));
    assert(addressEncoder.validateCashaddress(address));

    const legacy = addressEncoder.encodeLegacy('mainnet', 'P2PKH', vector.hash160);
    console.log(legacy);
    assert(addressEncoder.decodeLegacy(legacy).hash160.equals(vector.hash160));
    assert(legacy === vector.legacy);
    assert(addressEncoder.validate(legacy));
    assert(addressEncoder.validateLegacyaddress(legacy));

    const slp = addressEncoder.encodeCashaddress('simpleledger', 'P2PKH', vector.hash160);
    console.log(slp);
    assert(addressEncoder.decodeCashaddress(slp).hash160.equals(vector.hash160));
    assert(slp === vector.slp);
    assert(addressEncoder.validate(slp));
    assert(addressEncoder.validateCashaddress(slp));

    const addressTestnet = addressEncoder.encodeCashaddress('bchtest', 'P2PKH', vector.hash160);
    console.log(addressTestnet);
    assert(addressEncoder.decodeCashaddress(addressTestnet).hash160.equals(vector.hash160));
    assert(addressTestnet === vector.addressTestnet);
    assert(addressEncoder.validate(addressTestnet));
    assert(addressEncoder.validateCashaddress(addressTestnet));

    const legacyTestnet = addressEncoder.encodeLegacy('testnet', 'P2PKH', vector.hash160);
    console.log(legacyTestnet);
    assert(addressEncoder.decodeLegacy(legacyTestnet).hash160.equals(vector.hash160));
    assert(legacyTestnet === vector.legacyTestnet);
    assert(addressEncoder.validate(legacyTestnet));
    assert(addressEncoder.validateLegacyaddress(legacyTestnet));

    const slpTestnet = addressEncoder.encodeCashaddress('slptest', 'P2PKH', vector.hash160);
    console.log(slpTestnet);
    assert(addressEncoder.decodeCashaddress(slpTestnet).hash160.equals(vector.hash160));
    assert(slpTestnet === vector.slpTestnet);
    assert(addressEncoder.validate(slpTestnet));
    assert(addressEncoder.validateCashaddress(slpTestnet));
  });

  console.log('\nTESTING TRANSACTION ENCODING/DECODING');
  testVectors.transactions.forEach((vector) => {
    console.log();
    console.log(vector.hex);
    const transaction = Transaction.fromHex(vector.hex);
    console.log(transaction);
    assert(transaction.hex === vector.hex);
    assert(transaction.hash === vector.hash);
    assert(transaction.version.eq(vector.version));
    vector.vin.forEach((input, index) => {
      assert(transaction.vin[index].prevTxID === input.prevTxID);
      assert(transaction.vin[index].script === input.script);
      assert(transaction.vin[index].sequenceNumber.eq(input.sequenceNumber));
    });
    vector.vout.forEach((output, index) => {
      assert(transaction.vout[index].script === output.script);
      assert(transaction.vout[index].satoshis.eq(output.satoshis));
    });
  });

  console.log('\nTESTING WALLET CREATION');
  const wallet = new Wallet(testVectors.mnemonic, {
    network: 'testnet',
  });
  console.log(wallet);

  console.log('\nTESTING ADDRESS DERIVATION');
  testVectors.derivations.forEach((vector, index) => {
    console.log();
    const address = wallet.derive(wallet.defaultDerivationPath, index, false);
    console.log(address);
    assert(address.public.equals(vector.public));
    assert(address.address === vector.addressTestnet);
    assert(address.slp === vector.slpTestnet);
    assert(address.legacy === vector.legacyTestnet);
  });

  console.log('\nSCANNING ADDRESSES');
  console.time('wallet scan');
  await wallet.rescan();
  console.timeEnd('wallet scan');
  console.log(`Scanned ${Object.keys(wallet.addresses).length} addresses`);
  console.log(wallet.highestIndex);

  process.exit();
}

test();
