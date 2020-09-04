const bip32 = require('bip32');

const derivationPaths = [
  "m/44'/0'",
  "m/44'/145'",
  "m/44'/245'",
];

const bchDefaultPath = "m/44'/145'";
const slpDefaultPath = "m/44'/245'";

const defaultGapLimit = 20;

class BCH {
  #seed

  gapLimit;

  highestIndex = {};

  highestIndexChange = {};

  utxoCache = [];

  utxoUnconfirmed = [];

  historicalTransactions = [];

  slpCache = {};

  slpUnconfirmed = {};

  slpHistoricalTransactions = {};

  constructor(seed, gapLimit) {
    this.#seed = seed;
    this.gapLimit = gapLimit || defaultGapLimit;
  }

  getReceiveAddressIndex() {
    return this;
  }

  getChangeAddressIndex() {
    return this;
  }

  rescan(gapLimit) {
    this.highestIndex = {};
    this.highestIndexChange = {};
    this.utxoCache = [];
    this.historicalTransactions = [];

    derivationPaths.forEach((path) => {
      this.highestIndex[path] = 0;
      this.highestIndexChange[path] = 0;

      let currentGap = 0;

      while (currentGap <= gapLimit) {
        currentGap += 1;
      }
    });
  }

  get address() {
    return this;
  }

  get legacyAddress() {
    return this;
  }

  get slpAddress() {
    return this;
  }
}

module.exports = BCH;
