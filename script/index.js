const { opcodes, bytecodes } = require('./opcodes');
const { compile, decompile } = require('./compiler');

module.exports = {
  opcodes,
  bytecodes,
  compile,
  decompile,
};
