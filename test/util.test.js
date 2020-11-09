const BN = require('bn.js');

const BufferReader = require('../utils/bufferreader');
const BufferWriter = require('../utils/bufferwriter');

describe('BufferReader', () => {
  it('should read int8', () => {
    const reader = BufferReader.from('01', 'hex');
    expect(reader.readUInt8().toNumber()).toBe(1);
  });
});

let writer;

describe('BufferWriter', () => {
  beforeEach(() => {
    writer = new BufferWriter();
  });

  it('should write int8', () => {
    writer.writeInt8(new BN(1));
    expect(writer.buffer.toString('hex')).toBe('01');
  });
});
