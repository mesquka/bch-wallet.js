const bip32 = require('bip32');
const bip39 = require('bip39');
const address = require('./address');

const derivationPaths = [
  "m/44'/0'",
  "m/44'/145'",
  "m/44'/245'",
];

const defaultPath = "m/44'/145'";

class BCHWallet {
  /**
   * Wallet seed
   *
   * @member {number}
   */
  #seed

  /**
   * Wallet network
   *
   * @member {number}
   */
  network;

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
   * BCHWallet
   *
   * @class BCHWallet
   * @param {string} mnemonic - BIP39 mnemonic for this wallet.
   * @param {string} network - Mainnet/Testnet wallet.
   */
  constructor(mnemonic, network) {
    this.#seed = bip39.mnemonicToSeedSync(mnemonic);
    this.network = network;

    // Set each derivation path to 0
    derivationPaths.forEach((path) => {
      // Set highest index for this derivation path to 0
      this.highestIndex[path] = 0;
      this.highestIndexChange[path] = 0;
    });
  }

  // TODO: Use Private Method when specification finalized:
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_class_fields
  /**
   * Derive key from path
   *
   * @function
   * @param {Buffer} path - Path to derive
   * @param {number} index - index to derive
   * @param {boolean} change - Derive change address?
   * @returns {object<Buffer>} derived key
   */
  derive(path, index, change) {
    // Get full derivation path we want
    const derivationPath = `${path}/${change ? 1 : 0}/${index}`;

    // Derive keys
    const derived = bip32.fromSeed(this.#seed).derivePath(derivationPath);

    // Return public and private keys
    return {
      public: derived.publicKey,
      private: derived.privateKey,
      hash160: derived.identifier,
      legacy: address.encodeLegacy(this.network, 'p2pkh', derived.identifier),
      address: address.encodeCashaddress(
        this.network === 'mainnet' ? 'bitcoincash' : 'bchtest',
        'P2PKH',
        derived.identifier,
      ),
      slp: address.encodeCashaddress(
        'simpleledger',
        'P2PKH',
        derived.identifier,
      ),
    };
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
    return this.derive(defaultPath, this.highestIndex[defaultPath], false).address;
  }

  /**
   * Get change wallet address
   *
   * @static
   * @returns {string} - wallet address
   */
  get changeAddress() {
    return this.derive(defaultPath, this.highestChangeIndex[defaultPath], true).address;
  }

  /**
   * Get legacy wallet address
   *
   * @static
   * @returns {string} - wallet address
   */
  get legacyAddress() {
    return this.derive(defaultPath, this.highestIndex[defaultPath], false).legacy;
  }

  /**
   * Get SLP wallet address
   *
   * @static
   * @returns {string} - wallet address
   */
  get slpAddress() {
    return this.derive(defaultPath, this.highestIndex[defaultPath], false).slp;
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

module.exports = BCHWallet;
