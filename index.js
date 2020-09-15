const bip32 = require('bip32');
const bip39 = require('bip39');
const Address = require('./address');
const Electrum = require('./electrum');

class BCHWallet {
  /**
   * Derivation paths to search on
   *
   * @member {Array<string>}
   */
  derivationPaths = [
    "m/44'/0'/0'",
    "m/44'/145'/0'",
    "m/44'/245'/0'",
  ];

  /**
   * Path to generate addresses on
   *
   * @member {string}
   */
  defaultDerivationPath = "m/44'/145'/0'"

  /**
   * Wallet seed
   *
   * @member {number}
   */
  #seed

  /**
   * Electrum wallet
   *
   * @member {number}
   */
  electrum;

  /**
   * Gap Limit
   *
   * @member {number}
   */
  gapLimit = 20;

  /**
   * Addresses in this wallet
   *
   * @member {object<Address>}
   */
  addresses = {};

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
   * BCHWallet
   *
   * @class BCHWallet
   * @param {string} mnemonic - BIP39 mnemonic for this wallet.
   * @param {object} [options] - Wallet options.
   */
  constructor(mnemonic, options) {
    options = options || {};
    options.network = options.network || 'mainnet';
    options.electrum = options.electrum || {};
    options.electrum.network = options.electrum.network || options.network;

    this.#seed = bip39.mnemonicToSeedSync(mnemonic);
    this.network = options.network;

    // Set each derivation path to 0
    this.derivationPaths.forEach((path) => {
      // Set highest index for this derivation path to 0
      this.highestIndex[path] = 0;
      this.highestIndexChange[path] = 0;
    });

    // Setup electrum connection
    this.electrum = new Electrum(options.electrum);
  }

  /**
   * Add address to wallet
   *
   * @function
   * @param {Address} address - address to add
   */
  addAddress(address) {
    // Only proceed if not already present
    if (!this.addresses[address.address]) {
      this.addresses[address.address] = address;
    }
  }

  /**
   * Derive key from path
   *
   * @function
   * @param {Buffer} path - Path to derive
   * @param {number} index - index to derive
   * @param {boolean} change - Derive change address?
   * @returns {Address} derived address
   */
  derive(path, index, change) {
    // Get full derivation path we want
    const derivationPath = `${path}/${change ? 1 : 0}/${index}`;

    // Derive keys
    const derived = bip32.fromSeed(this.#seed).derivePath(derivationPath);

    // Return Address object
    return new Address(derived, this.network, this.electrum);
  }

  /**
   * Scans derivation path for balances
   *
   * @function
   * @param {string} path - derivation path to scan
   * @param {boolean} change - if we should scan the change or external accounts
   */
  async scanPath(path, change) {
    const pathKey = change ? 'highestIndexChange' : 'highestIndex';

    // Start at index for this derivation path
    let currentIndex = this[pathKey][path];

    // Search through indexes until we hit the gap limit
    while (currentIndex - this[pathKey][path] < this.gapLimit) {
      // Derive address
      const address = this.derive(path, currentIndex, change);

      // Fetch history
      // eslint-disable-next-line no-await-in-loop
      const history = await address.history();

      // If this address has a balance set highest index to currentIndex
      if (history.length > 0) {
        this[pathKey][path] = currentIndex;
      }

      // Add address to wallet
      this.addAddress(address);

      currentIndex += 1;
    }
  }

  /**
   * Scan all derivation paths
   *
   * @returns {Promise} complete
   */
  scanAll() {
    return new Promise((resolve, reject) => {
      const promiseList = [];

      this.derivationPaths.forEach((path) => {
        promiseList.push(this.scanPath(path, false));
        promiseList.push(this.scanPath(path, true));
      });

      Promise.all(promiseList).then(resolve).catch(reject);
    });
  }

  /**
   * Clears caches and rescans wallet
   *
   * @function
   * @returns {Promise} complete
   */
  rescan() {
    // Set all derivation paths to 0
    this.highestIndex = {};
    this.highestIndexChange = {};

    this.derivationPaths.forEach((path) => {
      this.highestIndex[path] = 0;
      this.highestIndexChange[path] = 0;
    });

    return this.scanAll();
  }

  /**
   * Get wallet address
   *
   * @returns {string} - wallet address
   */
  get address() {
    return this.derive(
      this.defaultDerivationPath,
      this.highestIndex[this.defaultDerivationPath],
      false,
    ).address;
  }

  /**
   * Get change wallet address
   *
   * @returns {string} - wallet address
   */
  get changeAddress() {
    return this.derive(
      this.defaultDerivationPath,
      this.highestChangeIndex[this.defaultDerivationPath],
      true,
    ).address;
  }

  /**
   * Get legacy wallet address
   *
   * @returns {string} - wallet address
   */
  get legacyAddress() {
    return this.derive(
      this.defaultDerivationPath,
      this.highestIndex[this.defaultDerivationPath],
      false,
    ).legacy;
  }

  /**
   * Get SLP wallet address
   *
   * @returns {string} - wallet address
   */
  get slpAddress() {
    return this.derive(
      this.defaultDerivationPath,
      this.highestIndex[this.defaultDerivationPath],
      false,
    ).slp;
  }

  /**
   * Get SLP wallet address
   *
   * @returns {string} - wallet address
   */
  get utxos() {
    return this.derive(
      this.defaultDerivationPath,
      this.highestIndex[this.defaultDerivationPath],
      false,
    ).slp;
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
