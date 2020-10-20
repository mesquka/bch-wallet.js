const { opcodes, bytecodes } = require('./opcodes');
const { compile, decompile } = require('./compiler');
const VM = require('./vm');

module.exports = {
  opcodes,
  bytecodes,
  compile,
  decompile,
  VM,
};
