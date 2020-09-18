const BN = require('bn.js');

class BufferWriter {
  /**
   * Buffers to write to
   *
   * @member {Array<Buffer>}
   */
  buffers =[];

  /**
   * Writes bytes
   *
   * @function
   * @param {Buffer} buffer - Buffer to write
   */
  write(buffer) {
    this.buffers.push(buffer);
  }

  /**
   * Writes reversed bytes
   *
   * @function
   * @param {Buffer} buffer - Buffer to write
   */
  writeReverse(buffer) {
    this.write(buffer.reverse());
  }

  /**
   * Writes uint8
   *
   * @function
   * @param {BN} uint8 - uint8 to write
   */
  writeUInt8(uint8) {
    this.write(uint8.toBuffer('be', 1));
  }

  /**
   * Writes uint16 big endian
   *
   * @function
   * @param {BN} uint16 - uint16 to write
   */
  writeUInt16BE(uint16) {
    this.write(uint16.toBuffer('be', 2));
  }

  /**
   * Writes uint16 little endian
   *
   * @function
   * @param {BN} uint16 - uint16 to write
   */
  writeUInt16LE(uint16) {
    this.write(uint16.toBuffer('le', 2));
  }

  /**
   * Writes uint32 big endian
   *
   * @function
   * @param {BN} uint32 - uint32 to write
   */
  writeUInt32BE(uint32) {
    this.write(uint32.toBuffer('be', 4));
  }

  /**
   * Writes uint32 little endian
   *
   * @function
   * @param {BN} uint32 - uint32 to write
   */
  writeUInt32LE(uint32) {
    this.write(uint32.toBuffer('le', 4));
  }

  /**
   * Writes uint64 big endian
   *
   * @function
   * @param {BN} uint64 - uint64 to write
   */
  writeUInt64BE(uint64) {
    this.write(uint64.toBuffer('be', 8));
  }

  /**
   * Writes uint64 little endian
   *
   * @function
   * @param {BN} uint64 - uint64 to write
   */
  writeUInt64LE(uint64) {
    this.write(uint64.toBuffer('le', 8));
  }

  /**
   * Writes int8
   *
   * @function
   * @param {BN} int8 - int8 to write
   */
  writeInt8(int8) {
    this.write(int8.toTwos(8).toBuffer('be', 1));
  }

  /**
   * Writes int16 big endian
   *
   * @function
   * @param {BN} int16 - int16 to write
   */
  writeInt16BE(int16) {
    this.write(int16.toTwos(16).toBuffer('be', 2));
  }

  /**
   * Writes int16 little endian
   *
   * @function
   * @param {BN} int16 - int16 to write
   */
  writeInt16LE(int16) {
    this.write(int16.toTwos(16).toBuffer('le', 2));
  }

  /**
   * Writes int32 big endian
   *
   * @function
   * @param {BN} int32 - int32 to write
   */
  writeInt32BE(int32) {
    this.write(int32.toTwos(32).toBuffer('be', 4));
  }

  /**
   * Writes int32 little endian
   *
   * @function
   * @param {BN} int32 - int32 to write
   */
  writeInt32LE(int32) {
    this.write(int32.toTwos(32).toBuffer('le', 4));
  }

  /**
   * Writes int64 big endian
   *
   * @function
   * @param {BN} int64 - int64 to write
   */
  writeInt64BE(int64) {
    this.write(int64.toTwos(64).toBuffer('be', 8));
  }

  /**
   * Writes int64 little endian
   *
   * @function
   * @param {BN} int64 - int64 to write
   */
  writeInt64LE(int64) {
    this.write(int64.toTwos(64).toBuffer('le', 8));
  }

  /**
   * Writes variable integer
   *
   * @function
   * @param {BN} varint - varint to write
   */
  writeVarInt(varint) {
    if (varint.lt(new BN(253))) {
      // 1 byte, write
      this.writeUInt8(varint);
    } else if (varint.lt(new BN(0x10000))) {
      // 2 bytes, write length indicator then 2 bytes
      this.writeUInt8(253);
      this.writeUInt16LE(varint);
    } else if (varint.lt(new BN(0x100000000))) {
      // 4 bytes, write length indicator then 4 bytes
      this.writeUInt8(254);
      this.writeUInt32LE(varint);
    } else {
      // 8 bytes, write length indicator then 8 bytes
      this.writeUInt8(255);
      this.writeUInt64LE(varint);
    }
  }

  /**
   * Writes variable buffer
   *
   * @function
   * @param {Buffer} varbuf - buffer to write
   */
  writeVarLengthBuffer(varbuf) {
    this.writeVarInt(new BN(varbuf.length));
    this.write(varbuf);
  }

  /**
   * Get Buffer
   *
   * @returns {Buffer} buffer
   */
  get buffer() {
    return Buffer.concat(this.buffers);
  }
}

module.exports = BufferWriter;
