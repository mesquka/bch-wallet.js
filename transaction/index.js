class Transaction {
  /**
   * Transaction
   *
   * @class
   */

  /**
   * Transaction version
   *
   * @member {Array}
   */
  version = '';

  /**
   * Transaction inputs
   *
   * @member {Array}
   */
  vin = [];

  /**
   * Transaction outputs
   *
   * @member {Array}
   */
  vout = [];

  /**
   * Loads hex data into transaction
   *
   * @function
   * @param {string} txhex - hex representation of transaction
   */
  loadHex(txhex) {
    // Load txhex into buffer
    const txBuffer = Buffer.from(txhex, 'hex');

    // Keep track of our offset
    let pos = 0;

    // Read version bytes
    this.version = txBuffer.readInt32LE(pos);
    pos += 4;

    // Read size of vin size int
    const vinNumSize = txBuffer.readUInt8(pos);
    pos += 1;

    // Read vin size
    let vinNum = 0;
    switch (vinNumSize) {
      case 0xFD:
        vinNum = txBuffer.readUInt16LE(pos);
        pos += 2;
        break;
      case 0xFE:
        vinNum = txBuffer.readUInt32LE(pos);
        pos += 4;
        break;
      case 0xFF:
        vinNum = txBuffer.readUInt64LE(pos);
        pos += 8;
        break;
      default:
        vinNum = vinNumSize;
    }

    for (let i = 0; i < vinNum; i += 1) {
      
    }
  }

  /**
   * Get transaction as hex
   *
   * @returns {string} - hex represented bytes
   */
  get hex() {
    // TODO: Serialize to hex
    return this;
  }

  /**
   * Creates Transaction object from hex
   *
   * @static
   * @param {string} txhex - hex representation of transaction
   * @returns {Transaction} transaction
   */
  static fromHex(txhex) {
    // Instantiate transaction object
    const transaction = new Transaction();

    // Load data from hex bytes
    transaction.loadHex(txhex);

    return transaction;
  }
}

module.exports = Transaction;
