const BufferReader = require('../utils/BufferReader');
const Input = require('./input');
const Output = require('./output');

/**
 * Transaction
 *
 * @class
 */
class Transaction {
  /**
   * Transaction version (BigNumber)
   *
   * @member {object}
   */
  version;

  /**
   * Transaction nLockTime (BigNumber)
   *
   * @member {object}
   */
  nLockTime;

  /**
   * Transaction inputs
   *
   * @member {Array<Input>}
   */
  vin = [];

  /**
   * Transaction outputs
   *
   * @member {Array<Output>}
   */
  vout = [];

  /**
   * Creates Transaction object from BufferReader
   *
   * @static
   * @param {BufferReader} reader - BufferReader of transaction data
   * @returns {Transaction} transaction
   */
  static fromBufferReader(reader) {
    const transaction = new Transaction();

    // Read version bytes
    transaction.version = reader.readInt32LE();

    // Fetch number of inputs
    const txInNum = reader.readVarInt();

    // Loop through each input and decode
    for (let i = 0; i < txInNum; i += 1) {
      const input = Input.fromBufferReader(reader);
      transaction.vin.push(input);
    }

    // Fetch number of outputs
    const txOutNum = reader.readVarInt();

    // Loop through each input and decode
    for (let i = 0; i < txOutNum; i += 1) {
      const output = Output.fromBufferReader(reader);
      transaction.vout.push(output);
    }

    // Read nLockTime
    transaction.nLockTime = reader.readUInt32LE();

    return transaction;
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
    return Transaction.fromBufferReader(
      BufferReader.from(txhex, 'hex'),
    );
  }
}

module.exports = Transaction;
