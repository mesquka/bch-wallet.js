const script = require('../script');

const testVectors = [
  {
    hex: '76a91407415c550255f7dfe3ccae808a2bbd415c7a3cc388ac',
    asm: 'OP_DUP OP_HASH160 07415c550255f7dfe3ccae808a2bbd415c7a3cc3 OP_EQUALVERIFY OP_CHECKSIG',
  },
  {
    hex: '6a04534c50000101044d494e54207f5be72749f82bd52075b422f21ad9971d7fca5c818478d5602cb692e1eb415d01020800000000000003e8',
    asm: 'OP_RETURN 534c5000 01 4d494e54 7f5be72749f82bd52075b422f21ad9971d7fca5c818478d5602cb692e1eb415d 02 00000000000003e8',
  },
  {
    hex: '0101010193010288',
    asm: '01 01 OP_ADD 02 OP_EQUALVERIFY',
  },
];

describe('Script compiler', () => {
  testVectors.forEach((vector) => {
    it(`should compile ${vector.asm} correctly`, () => {
      const compiled = script.compile(vector.asm);
      expect(compiled).toBe(vector.hex);
    });

    it(`should decompile ${vector.hex} correctly`, () => {
      const decompiled = script.decompile(vector.hex);
      expect(decompiled).toBe(vector.asm);
    });
  });
});
