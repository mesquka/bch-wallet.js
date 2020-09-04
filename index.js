/* eslint-disable global-require */
const bip39 = require('bip39');

const coinClasses = {
  bch: require('./bch'),
};

class CryptoWallet {
  constructor(mnemonic, coins) {
    const seed = bip39.mnemonicToSeedSync(mnemonic);

    coins.forEach((coin) => {
      this[coin] = new coinClasses[coin](seed);
    });
  }

  static generateSeed() {
    return bip39.generateMnemonic();
  }

  static get supportedCoins() {
    return Object.keys(coinClasses);
  }
}

module.exports = CryptoWallet;
