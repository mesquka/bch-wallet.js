const BufferReader = require('../utils/BufferReader');

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
   * @member {string}
   */
  outputIndex;

  /**
   * Bitcoin Script
   *
   * @member {string}
   */
  script;

  /**
   * Sequence Number (BigNumber)
   *
   * @member {object}
   */
  sequenceNumber;

  /**
   * Creates Transaction object from BufferReader
   *
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
