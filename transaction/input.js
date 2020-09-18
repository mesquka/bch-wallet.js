const BN = require('bn.js');
const BufferReader = require('../utils/bufferreader');
const BufferWriter = require('../utils/bufferwriter');

class Input {
  /**
   * TxID of previous input
   *
   * @member {string}
   */
  prevTxID;

  /**
   * Output index we're spending from
   *
   * @member {BN}
   */
  outputIndex;

  /**
   * Bitcoin Script
   *
   * @member {string}
   */
  script;

  /**
   * Sequence Number
   *
   * @member {BN}
   */
  sequenceNumber;

  /**
   * Serializes input to buffer
   *
   * @returns {Buffer} buffer
   */
  get buffer() {
    const writer = new BufferWriter();

    writer.writeReverse(Buffer.from(this.prevTxID, 'hex'));
    writer.writeUInt32LE(this.outputIndex);
    writer.writeVarLengthBuffer(Buffer.from(this.script, 'hex'));
    writer.writeUInt32LE(this.sequenceNumber);

    return writer.buffer;
  }

  /**
   * Serializes input to hex string
   *
   * @returns {string} hex
   */
  get hex() {
    return this.buffer.toString('hex');
  }

  /**
   * Creates Transaction object from BufferReader
   *
   * @static
   * @param {BufferReader} reader - BufferReader of input data
   * @returns {Input} input
   */
  static fromBufferReader(reader) {
    const input = new Input();

    // Read properties
    input.prevTxID = reader.readReverse(32).toString('hex');
    input.outputIndex = reader.readUInt32LE();
    input.script = reader.readVarLengthBuffer().toString('hex');
    input.sequenceNumber = reader.readUInt32LE();

    return input;
  }

  /**
   * Creates Transaction object from hex
   *
   * @static
   * @param {string} inputhex - hex representation of input
   * @returns {Input} input
   */
  static fromHex(inputhex) {
    return Input.fromBufferReader(
      BufferReader.from(inputhex, 'hex'),
    );
  }
}

module.exports = Input;
