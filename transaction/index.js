const BN = require('bn.js');
const sha256 = require('js-sha256');
const BufferReader = require('../utils/bufferreader');
const BufferWriter = require('../utils/bufferwriter');
const Input = require('./input');
const Output = require('./output');

/**
 * Transaction
 *
 * @class
 */
class Transaction {
  /**
   * Transaction version
   *
   * @member {BN}
   */
  version;

  /**
   * Transaction nLockTime
   *
   * @member {BN}
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
   * Get transaction as buffer
   *
   * @returns {Buffer} - transaction bytes
   */
  get buffer() {
    const writer = new BufferWriter();

    // Write version bytes
    writer.writeInt32LE(this.version);

    // Write number of inputs
    writer.writeVarInt(new BN(this.vin.length));

    // Write inputs
    this.vin.forEach((input) => {
      writer.write(input.buffer);
    });

    // Write number of outputs
    writer.writeVarInt(new BN(this.vout.length));

    // Write outputs
    this.vout.forEach((output) => {
      writer.write(output.buffer);
    });

    // Write nLockTime
    writer.writeUInt32LE(this.nLockTime);

    return writer.buffer;
  }

  /**
   * Get transaction as hex
   *
   * @returns {string} - hex represented bytes
   */
  get hex() {
    return this.buffer.toString('hex');
  }

  /**
   * Get transaction hash
   *
   * @returns {string} - hex represented bytes
   */
  get hash() {
    // Double sha256 the serialized transaction and reverse endianess
    return Buffer.from(
      sha256.array(
        sha256.array(this.buffer),
      ),
    ).reverse().toString('hex');
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
