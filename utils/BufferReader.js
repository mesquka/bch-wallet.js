const BigNumber = require('bignumber.js');

class BufferReader {
  /**
   * Buffer to read from
   *
   * @member {Buffer}
   */
  buffer;

  /**
   * Cursor position
   *
   * @member {BigNumber}
   */
  cursor = 0;

  /**
   * Buffer Reader
   *
   * @class BufferReader
   * @param {Buffer} buffer - buffer to read from
   */
  constructor(buffer) {
    this.buffer = buffer;
  }

  /**
   * Creates BufferReader from Buffer.from() data
   *
   * @static
   * @param {...any} params - params to pass to Buffer.from()
   * @returns {BufferReader} BufferReader
   */
  static from(...params) {
    return new BufferReader(
      Buffer.from(...params),
    );
  }

  /**
   * Reads uint8
   *
   * @function
   * @returns {BigNumber} uint8
   */
  readUInt8() {
    const bn = BigNumber(this.buffer.readUInt8(this.cursor));
    this.cursor += 1;
    return bn;
  }

  /**
   * Reads uint16 big endian
   *
   * @function
   * @returns {BigNumber} uint16
   */
  readUInt16BE() {
    const bn = BigNumber(this.buffer.readUInt16BE(this.cursor));
    this.cursor += 2;
    return bn;
  }

  /**
   * Reads uint16 little endian
   *
   * @function
   * @returns {BigNumber} uint16
   */
  readUInt16LE() {
    const bn = BigNumber(this.buffer.readUInt16LE(this.cursor));
    this.cursor += 2;
    return bn;
  }

  /**
   * Reads uint32 big endian
   *
   * @function
   * @returns {BigNumber} uint32
   */
  readUInt32BE() {
    const bn = BigNumber(this.buffer.readUInt32BE(this.cursor));
    this.cursor += 4;
    return bn;
  }

  /**
   * Reads uint32 little endian
   *
   * @function
   * @returns {BigNumber} uint32
   */
  readUInt32LE() {
    const bn = BigNumber(this.buffer.readUInt32LE(this.cursor));
    this.cursor += 4;
    return bn;
  }

  /**
   * Reads uint64 big endian
   *
   * @function
   * @returns {BigNumber} uint64
   */
  readUInt64BE() {
    const bn = BigNumber(this.buffer.readBigUInt64BE(this.cursor));
    this.cursor += 8;
    return bn;
  }

  /**
   * Reads uint64 little endian
   *
   * @function
   * @returns {BigNumber} uint64
   */
  readUInt64LE() {
    const bn = BigNumber(this.buffer.readBigUInt64LE(this.cursor));
    this.cursor += 8;
    return bn;
  }

  /**
   * Reads int8
   *
   * @function
   * @returns {BigNumber} int8
   */
  readInt8() {
    const bn = BigNumber(this.buffer.readInt8(this.cursor));
    this.cursor += 1;
    return bn;
  }

  /**
   * Reads int16 big endian
   *
   * @function
   * @returns {BigNumber} int16
   */
  readInt16BE() {
    const bn = BigNumber(this.buffer.readInt16BE(this.cursor));
    this.cursor += 2;
    return bn;
  }

  /**
   * Reads int16 little endian
   *
   * @function
   * @returns {BigNumber} int16
   */
  readInt16LE() {
    const bn = BigNumber(this.buffer.readInt16LE(this.cursor));
    this.cursor += 2;
    return bn;
  }

  /**
   * Reads int32 big endian
   *
   * @function
   * @returns {BigNumber} int32
   */
  readInt32BE() {
    const bn = BigNumber(this.buffer.readInt32BE(this.cursor));
    this.cursor += 4;
    return bn;
  }

  /**
   * Reads int32 little endian
   *
   * @function
   * @returns {BigNumber} int32
   */
  readInt32LE() {
    const bn = BigNumber(this.buffer.readInt32LE(this.cursor));
    this.cursor += 4;
    return bn;
  }

  /**
   * Reads int64 big endian
   *
   * @function
   * @returns {BigNumber} int64
   */
  readInt64BE() {
    const bn = BigNumber(this.buffer.readBigInt64BE(this.cursor));
    this.cursor += 8;
    return bn;
  }

  /**
   * Reads int64 little endian
   *
   * @function
   * @returns {BigNumber} int64
   */
  readInt64LE() {
    const bn = BigNumber(this.buffer.readBigInt64LE(this.cursor));
    this.cursor += 8;
    return bn;
  }

  /**
   * Reads VarInt
   *
   * @function
   * @returns {BigNumber} VarInt
   */
  readVarInt() {
    const firstByte = this.readUInt8();
    switch (firstByte) {
      case 0xFD:
        return this.readUInt16LE();
      case 0xFE:
        return this.readUInt32LE();
      case 0xFF:
        return this.readUInt64LEBN();
      default:
        return firstByte;
    }
  }

  /**
   * Reads bytes
   *
   * @function
   * @param {number} length - length of bytes to read
   * @returns {Buffer} bytes
   */
  read(length) {
    const bytes = this.buffer.slice(this.cursor, this.cursor + length);
    this.cursor += length;
    return bytes;
  }

  /**
   * Reads bytes reversed
   *
   * @function
   * @param {number} length - length of bytes to read
   * @returns {Buffer} reversedBytes
   */
  readReverse(length) {
    return this.read(length).reverse();
  }

  /**
   * Reads length prepended buffer
   *
   * @function
   * @returns {Buffer} buffer
   */
  readVarLengthBuffer() {
    const length = this.readVarInt().toNumber();
    return this.read(length);
  }

  /**
   * Reads remaining bytes from buffer
   *
   * @function
   * @returns {Buffer} buffer
   */
  readRemaining() {
    return this.read(this.buffer.length - this.cursor);
  }
}

module.exports = BufferReader;
