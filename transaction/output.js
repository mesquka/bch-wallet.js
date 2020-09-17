const BufferReader = require('../utils/BufferReader');

class Output {
  /**
   * Output satoshis (BigNumber)
   *
   * @member {object}
   */
  satoshis;

  /**
   * Output satoshis (BigNumber)
   *
   * @member {string}
   */
  script;

  /**
   * Creates Transaction object from BufferReader
   *
   * @param {BufferReader} reader - BufferReader of output data
   * @returns {Output} output
   */
  static fromBufferReader(reader) {
    const output = new Output();

    // Read properties
    output.satoshis = reader.readUInt64LE();
    output.script = reader.readVarLengthBuffer().toString('hex');

    return output;
  }

  /**
   * Creates Transaction object from hex
   *
   * @static
   * @param {string} outputhex - hex representation of output
   * @returns {Output} output
   */
  static fromHex(outputhex) {
    return Output.fromBufferReader(
      BufferReader.from(outputhex, 'hex'),
    );
  }
}

module.exports = Output;
