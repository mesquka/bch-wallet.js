const opcodes = {
  // Constants
  OP_0: '00',
  OP_PUSHDATA1: '4c',
  OP_PUSHDATA2: '4d',
  OP_PUSHDATA4: '4e',
  OP_1NEGATE: '4f',
  OP_1: '51',
  OP_2: '52',
  OP_3: '53',
  OP_4: '54',
  OP_5: '55',
  OP_6: '56',
  OP_7: '57',
  OP_8: '58',
  OP_9: '59',
  OP_10: '5a',
  OP_11: '5b',
  OP_12: '5c',
  OP_13: '5d',
  OP_14: '5e',
  OP_15: '5f',
  OP_16: '60',
  // Flow Control
  OP_NOP: '61',
  OP_IF: '63',
  OP_NOTIF: '64',
  OP_ELSE: '67',
  OP_ENDIF: '68',
  OP_VERIFY: '69',
  OP_RETURN: '6a',
  // Stack
  OP_TOALTSTACK: '6b',
  OP_FROMALTSTACK: '6c',
  OP_IFDUP: '73',
  OP_DEPTH: '74',
  OP_DROP: '75',
  OP_DUP: '76',
  OP_NIP: '77',
  OP_OVER: '78',
  OP_PICK: '79',
  OP_ROLL: '7a',
  OP_ROT: '7b',
  OP_SWAP: '7c',
  OP_TUCK: '7d',
  OP_2DROP: '6d',
  OP_2DUP: '6e',
  OP_3DUP: '6f',
  OP_2OVER: '70',
  OP_2ROT: '71',
  OP_2SWAP: '72',
  // Splice
  OP_CAT: '7e',
  OP_SPLIT: '7f',
  OP_NUM2BIN: '80',
  OP_BIN2NUM: '81',
  OP_SIZE: '82',
  OP_REVERSEBYTES: 'bc',
  // Bitwise
  OP_AND: '84',
  OP_OR: '85',
  OP_XOR: '86',
  OP_EQUAL: '87',
  OP_EQUALVERIFY: '88',
  // Arithmetic
  OP_1ADD: '8b',
  OP_1SUB: '8c',
  OP_NEGATE: '8f',
  OP_ABS: '90',
  OP_NOT: '91',
  OP_0NOTEQUAL: '92',
  OP_ADD: '93',
  OP_SUB: '94',
  OP_DIV: '96',
  OP_MOD: '97',
  OP_BOOLAND: '9a',
  OP_BOOLOR: '9b',
  OP_NUMEQUAL: '9c',
  OP_NUMEQUALVERIFY: '9d',
  OP_NUMNOTEQUAL: '9e',
  OP_LESSTHAN: '9f',
  OP_GREATERTHAN: 'a0',
  OP_LESSTHANOREQUAL: 'a1',
  OP_GREATERTHANOREQUAL: 'a2',
  OP_MIN: 'a3',
  OP_MAX: 'a4',
  OP_WITHIN: 'a5',
  // Cryptography
  OP_RIPEMD160: 'a6',
  OP_SHA1: 'a7',
  OP_SHA256: 'a8',
  OP_HASH160: 'a9',
  OP_HASH256: 'aa',
  OP_CODESEPARATOR: 'ab',
  OP_CHECKSIG: 'ac',
  OP_CHECKSIGVERIFY: 'ad',
  OP_CHECKMULTISIG: 'ae',
  OP_CHECKMULTISIGVERIFY: 'af',
  OP_CHECKDATASIG: 'ba',
  OP_CHECKDATASIGVERIFY: 'bb',
  // Locktime
  OP_CHECKLOCKTIMEVERIFY: 'b1',
  OP_CHECKSEQUENCEVERIFY: 'b2',
};

for (let bytecode = 0x01; bytecode <= 0x4b; bytecode += 1) {
  opcodes[`OP_DATA_${bytecode}`] = bytecode.toString(16).padStart(2, '0');
}

const bytecodes = Object.assign({}, ...Object.entries(opcodes).map(([a, b]) => ({ [b]: a })));

module.exports = {
  opcodes,
  bytecodes,
};
