const { opcodes, bytecodes } = require('./opcodes');

/**
 * Compiles script ASM to HEX encoded script
 *
 * @param {string} script - script ASM string
 * @returns {string} compiled
 */
function compile(script) {
  // Split into array by spaces
  const tokenized = script.split(' ');

  // Allocate array for result
  const tokenizedBytes = [];

  // Loop through each element in tokenized array and transform to bytes
  tokenized.forEach((token) => {
    // If bytes are equal to an OP_Code, push relevent byte to array
    if (Object.keys(opcodes).includes(token.toUpperCase())) {
      return tokenizedBytes.push(opcodes[token]);
    }

    // If bytes string length is odd, prepend with a 0
    if (token.length % 2 !== 0) {
      token = `0${token}`;
    }

    // If the last item on the stack was OP_PUSHDATA1 push length and then data
    if (tokenizedBytes[tokenizedBytes.length - 1] === opcodes.OP_PUSHDATA1) {
      const tokenLength = token.length / 2;
      tokenizedBytes.push(tokenLength.toString(16).padStart(2, '0'));
      return tokenizedBytes.push(token);
    }

    // If the last item on the stack was OP_PUSHDATA2 push length and then data
    if (tokenizedBytes[tokenizedBytes.length - 1] === opcodes.OP_PUSHDATA2) {
      const tokenLength = token.length / 2;
      tokenizedBytes.push(tokenLength.toString(16).padStart(4, '0'));
      return tokenizedBytes.push(token);
    }

    // If the last item on the stack was OP_PUSHDATA4 push length and then data
    if (tokenizedBytes[tokenizedBytes.length - 1] === opcodes.OP_PUSHDATA4) {
      const tokenLength = token.length / 2;
      tokenizedBytes.push(tokenLength.toString(16).padStart(8, '0'));
      return tokenizedBytes.push(token);
    }

    // Data size is below 75 bytes and no OP_PUSHDATA preceeds this
    if (token.length <= 75 * 2) {
      tokenizedBytes.push(opcodes[`OP_DATA_${token.length / 2}`]);
      return tokenizedBytes.push(token);
    }

    // Data size is below 255 bytes and no OP_PUSHDATA preceeds this
    if (token.length <= 255 * 2) {
      tokenizedBytes.push(opcodes.OP_PUSHDATA1);
      const tokenLength = token.length / 2;
      tokenizedBytes.push(tokenLength.toString(16).padStart(2, '0'));
      return tokenizedBytes.push(token);
    }

    // Data size is below 65535 bytes and no OP_PUSHDATA preceeds this
    if (token.length <= 65535 * 2) {
      tokenizedBytes.push(opcodes.OP_PUSHDATA2);
      const tokenLength = token.length / 2;
      tokenizedBytes.push(tokenLength.toString(16).padStart(4, '0'));
      return tokenizedBytes.push(token);
    }

    // Data size is below 4294967295 bytes and no OP_PUSHDATA preceeds this
    if (token.length <= 4294967295 * 2) {
      tokenizedBytes.push(opcodes.OP_PUSHDATA4);
      const tokenLength = token.length / 2;
      tokenizedBytes.push(tokenLength.toString(16).padStart(8, '0'));
      return tokenizedBytes.push(token);
    }

    // Data is too big to be pushed to stack, ignore
    return null;
  });

  // Return string
  return tokenizedBytes.join('');
}

/**
 * Decompiles script HEX to ASM
 *
 * @param {string} script - script HEX string
 * @returns {string} decompiled
 */
function decompile(script) {
  const tokenized = [];
  // Read through string till end
  for (let cursor = 0; cursor < script.length;) {
    // Read bytes off stack
    const tokenbytes = script.substr(cursor, 2).toLowerCase();

    // Convert bytes to opcode
    const token = bytecodes[tokenbytes];

    // Move cursor forward
    cursor += 2;

    // Handle OP_DATA and OP_PUSHDATA codes
    if (parseInt(tokenbytes, 16) >= 0x01 && parseInt(tokenbytes, 16) <= 0x4b) {
      // Read databytes
      const datatoken = script.substr(cursor, parseInt(tokenbytes, 16) * 2);

      // Move cursor forward
      cursor += parseInt(tokenbytes, 16) * 2;

      // Push bytes to ASM array
      tokenized.push(datatoken);
    } else if (token === 'OP_PUSHDATA1') {
      // Read data size
      const size = parseInt(script.substr(cursor, 2), 16) * 2;

      // Move cursor forward
      cursor += 2;

      // Read data bytes
      const datatoken = script.substr(cursor, size);

      // Move cursor forward
      cursor += size;

      // Push OP_CODE and data
      tokenized.push(token);
      tokenized.push(datatoken);
    } else if (token === 'OP_PUSHDATA2') {
      // Read data size
      const size = parseInt(script.substr(cursor, 4), 16) * 2;

      // Move cursor forward
      cursor += 4;

      // Read data bytes
      const datatoken = script.substr(cursor, size);

      // Move cursor forward
      cursor += size;

      // Push OP_CODE and data
      tokenized.push(token);
      tokenized.push(datatoken);
    } else if (token === 'OP_PUSHDATA4') {
      // Read data size
      const size = parseInt(script.substr(cursor, 8), 16) * 2;

      // Move cursor forward
      cursor += 8;

      // Read data bytes
      const datatoken = script.substr(cursor, size);

      // Move cursor forward
      cursor += size;

      // Push OP_CODE and data
      tokenized.push(token);
      tokenized.push(datatoken);
    } else {
      // If this isn't a OP_DATA or OP_PUSHDATA code, just push
      tokenized.push(token);
    }
  }
  return tokenized.join(' ');
}

module.exports = {
  compile,
  decompile,
};
