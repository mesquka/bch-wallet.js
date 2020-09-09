const encoder = require('./encoder');

class Address {
  /**
   * Address
   *
   * @class Address
   */

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
   * Create Address from bip32 module output
   *
   * @function
   * @param {object} derived - bip32 module output
   * @param {string} network - network to use
   * @returns {Address} Address
   */
  static fromDerived(derived, network) {
    // Create Address object
    const address = new Address();

    // Set network
    address.network = network;

    // Set properties from derived key
    address.public = derived.publicKey;
    address.#private = derived.privateKey;
    address.hash160 = derived.identifier;

    // Return new object
    return address;
  }

  /**
   * Get wallet address
   *
   * @static
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
   * @static
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
   * Get wallet address
   *
   * @static
   * @returns {string} - wallet address
   */
  get slp() {
    return encoder.encodeCashaddress(
      'simpleledger',
      'P2PKH',
      this.hash160,
    );
  }
}

module.exports = Address;
