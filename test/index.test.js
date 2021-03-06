const Wallet = require('..');

const mnemonic = 'cherry awake rebuild solid summer august cherry bomb rebuild merit find clean';

const testVectors = [
  {
    hash160: Buffer.from('08bf163adb53efac12a0a644fe20b58f6e647c98', 'hex'),
    public: Buffer.from('035d92a0b49bd9e13dd78bd0ab98137ac167a968bacf78c75c71e9f49f959035e6', 'hex'),
    address: 'bitcoincash:qqyt7936mdf7ltqj5znyfl3qkk8kuerunq380qrt5a',
    slp: 'simpleledger:qqyt7936mdf7ltqj5znyfl3qkk8kuerunqauymkt2r',
    legacy: '1oFKUtDAw4VPpH2kWRfDmcykrb8MKSuPm',
    addressTestnet: 'bchtest:qqyt7936mdf7ltqj5znyfl3qkk8kuerunq44t8punp',
    slpTestnet: 'slptest:qqyt7936mdf7ltqj5znyfl3qkk8kuerunqwpvumtpu',
    legacyTestnet: 'mgKCcXyByxVkAvkeU5Q33gqJcrBqJp2fir',
  },
  {
    hash160: Buffer.from('58710083474216a7d024ee261be7ac397d03dab6', 'hex'),
    public: Buffer.from('021456a2576fa95770053da5b4e50c86a73325b3d3c92af645a890a586ca9496ca', 'hex'),
    address: 'bitcoincash:qpv8zqyrgappdf7synhzvxl84suh6q76kcyc9klv2s',
    slp: 'simpleledger:qpv8zqyrgappdf7synhzvxl84suh6q76kcgrwd2v5w',
    legacy: '194dqQ5YTnV7uKbTqg5vhPYU9ozdL2jruM',
    addressTestnet: 'bchtest:qpv8zqyrgappdf7synhzvxl84suh6q76kcq2p3amdv',
    slpTestnet: 'slptest:qpv8zqyrgappdf7synhzvxl84suh6q76kcm7x28vl3',
    legacyTestnet: 'moab8TAXGovNgS55ZF4JXJko1obLDjC2zu',
  },
  {
    hash160: Buffer.from('5afcb976ff658651194b34d2805020345c89259b', 'hex'),
    public: Buffer.from('023e0e023f99ba66097ca8975d07d1c2aa1592af233fb74d2bd5462a857a22cc28', 'hex'),
    address: 'bitcoincash:qpd0ewtklajcv5gefv6d9qzsyq69ezf9nvz6pmszcd',
    slp: 'simpleledger:qpd0ewtklajcv5gefv6d9qzsyq69ezf9nvwp2q9zxn',
    legacy: '19J6ZsPxZTnWNgnxcT5TbpVoBiWAX1mSPV',
    addressTestnet: 'bchtest:qpd0ewtklajcv5gefv6d9qzsyq69ezf9nvxg9uj4l3',
    slpTestnet: 'slptest:qpd0ewtklajcv5gefv6d9qzsyq69ezf9nvauz8gzdv',
    legacyTestnet: 'mop3rvUwNVDm9oGaL23qRji83i6sSBnpZ8',
  },
  {
    hash160: Buffer.from('33c6061ad228810efb5cc2a0d3224ebeb77e58b9', 'hex'),
    public: Buffer.from('031a829ca4f12ae9917784188f01fd4b8645cf054df6469cf1be90a50190beef0a', 'hex'),
    address: 'bitcoincash:qqeuvps66g5gzrhmtnp2p5ezf6ltwljchysxzx2a6k',
    slp: 'simpleledger:qqeuvps66g5gzrhmtnp2p5ezf6ltwljchyuafalayg',
    legacy: '15ikgiquVcFpn8MAM5jHsmkurPcGdzX7Ey',
    addressTestnet: 'bchtest:qqeuvps66g5gzrhmtnp2p5ezf6ltwljchy55xpg2a2',
    slpTestnet: 'slptest:qqeuvps66g5gzrhmtnp2p5ezf6ltwljchy0qp6ja0h',
    legacyTestnet: 'mkEhymvtJdh5ZEpn4ehfhgyEiPCyWzApTQ',
  },
];

let wallet;

beforeAll(() => {
  wallet = new Wallet(mnemonic, {
    network: 'testnet',
  });
});

describe('HD Derivation', () => {
  testVectors.forEach((vector, index) => {
    it(`should derive index ${index} correctly`, () => {
      const address = wallet.derive(wallet.defaultDerivationPath, index, false);
      expect(address.public).toStrictEqual(vector.public);
      expect(address.address).toBe(vector.addressTestnet);
      expect(address.slp).toBe(vector.slpTestnet);
      expect(address.legacy).toBe(vector.legacyTestnet);
    });
  });
});

afterAll(() => {
  wallet.shutdown();
});
