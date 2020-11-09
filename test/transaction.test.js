const BN = require('bn.js');
const Transaction = require('../transaction');

const testVectors = [
  {
    hex: '02000000016cd312c23c61fe7ed4045cc8be01d3adc31db1be60a53ddd5d1bd9f024100a45000000006a47304402207bcee7e00ac27a5c039a430479c2fdb3b854d4fa6d2ab8b17161761acc17bf4202200ba440a828e6f6191aaecf1ee55a584db2555f9ec750719e9889c3ffe13cb8c24121033ee6aaf63904f06aaa811e568d6601867fb08438c5b5c01d01b1527e3367b782ffffffff023cad03e8010000001976a91497a808f1d39ae863ed78500504780e2ca0c21b7288ac40420f00000000001976a91408bf163adb53efac12a0a644fe20b58f6e647c9888ac00000000',
    version: new BN(2),
    hash: 'caba18a25609054c45a664aa14ff1a29462b34656af07b5373aecd42e5926e7e',
    vin: [
      {
        prevTxID: '450a1024f0d91b5ddd3da560beb11dc3add301bec85c04d47efe613cc212d36c',
        script: '47304402207bcee7e00ac27a5c039a430479c2fdb3b854d4fa6d2ab8b17161761acc17bf4202200ba440a828e6f6191aaecf1ee55a584db2555f9ec750719e9889c3ffe13cb8c24121033ee6aaf63904f06aaa811e568d6601867fb08438c5b5c01d01b1527e3367b782',
        sequenceNumber: new BN(4294967295),
      },
    ],
    vout: [
      {
        script: '76a91497a808f1d39ae863ed78500504780e2ca0c21b7288ac',
        satoshis: new BN(8187522364),
      },
      {
        script: '76a91408bf163adb53efac12a0a644fe20b58f6e647c9888ac',
        satoshis: new BN(1000000),
      },
    ],
  },
  {
    hex: '01000000017e6e92e542cdae73537bf06a65342b46291aff14aa64a6454c050956a218baca01000000644154c9939f5da09c2a19f5a172149eacd1c7f6e498b83619fb4d31565e83c4fad5ddd8d5d1737721eae7099f54a40305a06c1ae78745e9e1f0dfff765d21651a7d4121035d92a0b49bd9e13dd78bd0ab98137ac167a968bacf78c75c71e9f49f959035e6feffffff0187410f00000000001976a91458710083474216a7d024ee261be7ac397d03dab688ac92811500',
    version: new BN(1),
    hash: '6e38526ff9f1505bdeba3132aada47ea2d89786c4067485e8d05030a6cbdd171',
    vin: [
      {
        prevTxID: 'caba18a25609054c45a664aa14ff1a29462b34656af07b5373aecd42e5926e7e',
        script: '4154c9939f5da09c2a19f5a172149eacd1c7f6e498b83619fb4d31565e83c4fad5ddd8d5d1737721eae7099f54a40305a06c1ae78745e9e1f0dfff765d21651a7d4121035d92a0b49bd9e13dd78bd0ab98137ac167a968bacf78c75c71e9f49f959035e6',
        sequenceNumber: new BN(4294967294),
      },
    ],
    vout: [
      {
        script: '76a91458710083474216a7d024ee261be7ac397d03dab688ac',
        satoshis: new BN(999815),
      },
    ],
  },
  {
    hex: '010000000171d1bd6c0a03058d5e4867406c78892dea47daaa3231bade5b50f1f96f52386e000000006441f83091a4ea4ce7e12cc7c5c837756b9b477ee76fda27fe2c854cc5514f15c30313b6095eb056df91ec3380d937efc8d73c4d0c7218b5690e6efd3ea3f84f2d514121021456a2576fa95770053da5b4e50c86a73325b3d3c92af645a890a586ca9496cafeffffff01ce400f00000000001976a91458710083474216a7d024ee261be7ac397d03dab688ac92811500',
    version: new BN(1),
    hash: 'f286340c407d813ad19d6477610b28727f566f97be5d42ea3f6504b8e41fbc21',
    vin: [
      {
        prevTxID: '6e38526ff9f1505bdeba3132aada47ea2d89786c4067485e8d05030a6cbdd171',
        script: '41f83091a4ea4ce7e12cc7c5c837756b9b477ee76fda27fe2c854cc5514f15c30313b6095eb056df91ec3380d937efc8d73c4d0c7218b5690e6efd3ea3f84f2d514121021456a2576fa95770053da5b4e50c86a73325b3d3c92af645a890a586ca9496ca',
        sequenceNumber: new BN(4294967294),
      },
    ],
    vout: [
      {
        script: '76a91458710083474216a7d024ee261be7ac397d03dab688ac',
        satoshis: new BN(999630),
      },
    ],
  },
];

describe('Transaction parser', () => {
  testVectors.forEach((vector) => {
    it(`should parse transaction ${vector.hex}`, () => {
      const transaction = Transaction.fromHex(vector.hex);
      expect(transaction.hex).toBe(vector.hex);
      expect(transaction.hash).toBe(vector.hash);
      expect(transaction.version).toEqual(vector.version);
      vector.vin.forEach((input, index) => {
        expect(transaction.vin[index].prevTxID).toBe(input.prevTxID);
        expect(transaction.vin[index].script).toBe(input.script);
        expect(transaction.vin[index].sequenceNumber).toEqual(input.sequenceNumber);
      });
      vector.vout.forEach((output, index) => {
        expect(transaction.vout[index].script).toBe(output.script);
        expect(transaction.vout[index].satoshis).toEqual(output.satoshis);
      });
    });
  });
});
