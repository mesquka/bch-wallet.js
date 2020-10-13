const BN = require('bn.js');
const BufferReader = require('../utils/bufferreader');
const BufferWriter = require('../utils/bufferwriter');

class Output {
  /**
   * Output satoshis
   *
   * @member {BN}
   */
  satoshis;

  /**
   * Locking script
   *
   * @member {BN}
   */
  script;

  /**
   * Serializes output to buffer
   *
   * @returns {Buffer} buffer
   */
  get buffer() {
    const writer = new BufferWriter();

    writer.writeUInt64LE(this.satoshis);
    writer.writeVarLengthBuffer(Buffer.from(this.script, 'hex'));

    return writer.buffer;
  }

  /**
   * Serializes output to hex string
   *
   * @returns {string} hex
   */
  get hex() {
    return this.buffer.toString('hex');
  }

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
