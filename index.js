const bip32 = require('bip32');
const bip39 = require('bip39');

const derivationPaths = [
  "m/44'/0'",
  "m/44'/145'",
  "m/44'/245'",
];

const bchDefaultPath = "m/44'/145'";
const slpDefaultPath = "m/44'/245'";

class BCH {
  /**
   * Wallet seed
   *
   * @member {number}
   */
  #seed

  /**
   * Gap Limit
   *
   * @member {number}
   */
  gapLimit = 20;

  /**
   * Highest address index for external addresses
   *
   * @member {object<number>}
   */
  highestIndex = {};

  /**
   * Highest address index for change addresses
   *
   * @member {object<number>}
   */
  highestIndexChange = {};

  /**
   * List of confirmed UTXOs in this wallet
   *
   * @member {object<Array<object>>}
   */
  utxoConfirmed = {};

  /**
   * List of unconfirmed UTXOs in this wallet
   *
   * @member {object<Array<object>>}
   */
  utxoUnconfirmed = {};

  /**
   * List of transactions for this wallet
   *
   * @member {object<Array<object>>}
   */
  historicalTransactions = {};

  /**
   * BCH Wallet
   *
   * @class BCH
   * @param {Buffer} mnemonic - BIP39 mnemonic for this wallet.
   */
  constructor(mnemonic) {
    this.#seed = bip39.mnemonicToSeedSync(mnemonic);
  }

  /**
   * Derive key from path
   *
   * @function
   * @param {Buffer} path - Path to derive
   * @param {number} index - index to derive
   * @param {boolean} change - Derive change address?
   * @returns {string} derived key
   */
  derive(path, index, change) {
    return this;
  }

  /**
   * Derive receive address from index
   *
   * @function
   * @param {number} index - index to derive
   * @returns {string} derived address
   */
  deriveReceiveAddress(index) {
    return this.derive(index);
  }

  /**
   * Derive change address from index
   *
   * @function
   * @param {number} index - index to derive
   * @returns {string} derived address
   */
  deriveChangeAddress(index) {
    return this.derive(index);
  }

  /**
   * Derive legacy address from index
   *
   * @function
   * @param {number} index - index to derive
   * @returns {string} derived address
   */
  deriveLegacyAddress(index) {
    return this.derive(index);
  }

  /**
   * Derive SLP address from index
   *
   * @function
   * @param {number} index - index to derive
   * @returns {string} derived address
   */
  deriveSLPAddress(index) {
    return this.derive(index);
  }

  /**
   * Clears caches and rescans wallet
   *
   * @function
   */
  rescan() {
    // Reset all caches
    this.highestIndex = {};
    this.highestIndexChange = {};
    this.utxoCache = [];
    this.historicalTransactions = [];

    // Check each derivation path
    derivationPaths.forEach((path) => {
      // Set highest index for this derivation path to 0
      this.highestIndex[path] = 0;
      this.highestIndexChange[path] = 0;

      // Start at 0th index for this derivation path
      let currentIndex = 0;

      // Search through indexes until we hit the gap limit
      while (currentIndex - this.highestIndex[path] <= this.gapLimit) {
        // TODO: Derive address and check for balance
        currentIndex += 1;
      }

      // Start at 0th index for this derivation path's change addresses
      currentIndex = 0;

      // Search through change indexes until we hit the gap limit
      while (currentIndex - this.highestIndex[path] <= this.gapLimit) {
        // TODO: Derive address and check for balance
        currentIndex += 1;
      }
    });
  }

  /**
   * Get wallet address
   *
   * @static
   * @returns {string} - wallet address
   */
  get address() {
    return this.getReceiveAddressIndex(this.highestIndex);
  }

  /**
   * Get legacy wallet address
   *
   * @static
   * @returns {string} - wallet address
   */
  get legacyAddress() {
    return this.getLegacyAddressIndex(this.highestIndex);
  }

  /**
   * Get SLP wallet address
   *
   * @static
   * @returns {string} - wallet address
   */
  get slpAddress() {
    return this.getSLPAddressIndex(this.highestIndex);
  }

  /**
   * Generate Mnemonic Phrase
   *
   * @static
   * @returns {string} - Mnemonic string
   */
  static generateMnemonic() {
    return bip39.generateMnemonic();
  }
}

module.exports = BCH;
