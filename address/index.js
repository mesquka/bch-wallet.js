const encoder = require('./encoder');

class Address {
  /**
   * Public key
   *
   * @member {Buffer}
   */
  public;

  /**
   * Private key
   *
   * @member {Buffer}
   */
  #private;

  /**
   * Public key Hash160
   *
   * @member {Buffer}
   */
  hash160;

  /**
   * Network of address
   *
   * @member {string}
   */
  network;

  /**
   * Electrum instance to use for network interaction
   *
   * @member {string}
   */
  electrum;

  /**
   * Address
   *
   * @class Address
   * @param {object} derived - bip32 module output
   * @param {string} network - network to use
   * @param {string} electrum - electrum instance to use for network interaction
   */
  constructor(derived, network, electrum) {
    this.network = network;
    this.electrum = electrum;

    // Set properties from derived key
    this.public = derived.publicKey;
    this.#private = derived.privateKey;
    this.hash160 = derived.identifier;
  }

  /**
   * Get wallet address
   *
   * @returns {string} - wallet address
   */
  get address() {
    return encoder.encodeCashaddress(
      this.network === 'mainnet' ? 'bitcoincash' : 'bchtest',
      'P2PKH',
      this.hash160,
    );
  }

  /**
   * Get wallet address
   *
   * @returns {string} - wallet address
   */
  get legacy() {
    return encoder.encodeLegacy(
      this.network,
      'P2PKH',
      this.hash160,
    );
  }

  /**
   * Get address address
   *
   * @returns {string} - wallet address
   */
  get slp() {
    return encoder.encodeCashaddress(
      this.network === 'mainnet' ? 'simpleledger' : 'slptest',
      'P2PKH',
      this.hash160,
    );
  }

  /**
   * Get address history
   *
   * @function
   * @returns {Promise<Array<Transaction>>} - Array of historical transactions
   */
  async history() {
    const history = await this.electrum.request('blockchain.address.get_history', this.address);

    // TODO decode transactions
    return Promise.all(history.map(async (tx) => this.electrum.request('blockchain.transaction.get', tx.tx_hash, true)));
  }

  /**
   * Get address balance
   *
   * @function
   * @returns {Promise<object<number>>} - Array of historical transactions
   */
  balance() {
    return this.electrum.request('blockchain.address.get_balance', this.address);
  }

  /**
   * Get address balance
   *
   * @function
   * @returns {Promise<Array<Transaction>>} - Array of historical transactions
   */
  async unspent() {
    const unspent = await this.electrum.request('blockchain.address.listunspent', this.address);

    // TODO decode transactions
    return Promise.all(unspent.map(async (tx) => this.electrum.request('blockchain.transaction.get', tx.tx_hash)));
  }

  /**
   * Get address balance
   *
   * @function
   * @returns {Promise<Array<Transaction>>} - Array of historical transactions
   */
  async mempool() {
    const unspent = await this.electrum.request('blockchain.address.get_mempool', this.address);

    // TODO decode transactions
    return Promise.all(unspent.map(async (tx) => this.electrum.request('blockchain.transaction.get', tx.tx_hash)));
  }

  /**
   * Get callback when activity occurs on this address
   *
   * @param {Function} callback - function to call
   * @returns {Promise} finished
   */
  subscribe(callback) {
    return this.electrum.subscribe(callback, 'blockchain.address.subscribe', this.address);
  }
}

module.exports = Address;
