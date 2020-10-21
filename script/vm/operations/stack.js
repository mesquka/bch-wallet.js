const BN = require('bn.js');
const VM = require('..');

/**
 * Executes OP_Code
 *
 * @param {VM} vm - vm to execute on
 * @returns {boolean} isValid
 */
function OP_TOALTSTACK(vm) {
  // No stack overflows
  if (vm.stack.length < 1) {
    return false;
  }

  vm.altStack.push(vm.stack.pop());
  vm.cursor += 1;
  return true;
}

/**
 * Executes OP_Code
 *
 * @param {VM} vm - vm to execute on
 * @returns {boolean} isValid
 */
function OP_FROMALTSTACK(vm) {
  // No stack overflows
  if (vm.altStack.length < 1) {
    return false;
  }

  vm.stack.push(vm.altStack.pop());
  vm.cursor += 1;
  return true;
}

/**
 * Executes OP_Code
 *
 * @param {VM} vm - vm to execute on
 * @returns {boolean} isValid
 */
function OP_IFDUP(vm) {
  // No stack overflows
  if (vm.stack.length < 1) {
    return false;
  }

  if (!vm.stack[vm.stack.length - 1].eq(new BN(0))) {
    vm.stack.push(vm.stack[vm.stack.length - 1]);
  }

  vm.cursor += 1;
  return true;
}

/**
 * Executes OP_Code
 *
 * @param {VM} vm - vm to execute on
 * @returns {boolean} isValid
 */
function OP_DEPTH(vm) {
  vm.stack.push(new BN(vm.stack.length));

  vm.cursor += 1;
  return true;
}

/**
 * Executes OP_Code
 *
 * @param {VM} vm - vm to execute on
 * @returns {boolean} isValid
 */
function OP_DROP(vm) {
  // No stack overflows
  if (vm.stack.length < 1) {
    return false;
  }

  vm.stack.pop();

  vm.cursor += 1;
  return true;
}

/**
 * Executes OP_Code
 *
 * @param {VM} vm - vm to execute on
 * @returns {boolean} isValid
 */
function OP_DUP(vm) {
  // No stack overflows
  if (vm.stack.length < 1) {
    return false;
  }

  vm.stack.push(vm.stack[vm.stack.length - 1]);

  vm.cursor += 1;
  return true;
}

/**
 * Executes OP_Code
 *
 * @param {VM} vm - vm to execute on
 * @returns {boolean} isValid
 */
function OP_NIP(vm) {
  // No stack overflows
  if (vm.stack.length < 2) {
    return false;
  }

  vm.stack.splice(-2, 1);

  vm.cursor += 1;
  return true;
}

/**
 * Executes OP_Code
 *
 * @param {VM} vm - vm to execute on
 * @returns {boolean} isValid
 */
function OP_OVER(vm) {
  // No stack overflows
  if (vm.stack.length < 2) {
    return false;
  }

  vm.stack.push(vm.stack[vm.stack.length - 2]);

  vm.cursor += 1;
  return true;
}

/**
 * Executes OP_Code
 *
 * @param {VM} vm - vm to execute on
 * @returns {boolean} isValid
 */
function OP_PICK(vm) {
  // No stack overflows
  if (vm.stack.length < 1) {
    return false;
  }

  const value = vm.stack.pop();

  // No stack overflows
  if (vm.stack.length < value.toNumber()) {
    return false;
  }

  vm.stack.push(vm.stack[vm.stack.length - value.toNumber()]);

  vm.cursor += 1;
  return true;
}

/**
 * Executes OP_Code
 *
 * @param {VM} vm - vm to execute on
 * @returns {boolean} isValid
 */
function OP_ROLL(vm) {
  // No stack overflows
  if (vm.stack.length < 1) {
    return false;
  }

  const value = vm.stack.pop();

  // No stack overflows
  if (vm.stack.length < value.toNumber()) {
    return false;
  }

  vm.stack.push(vm.stack.splice(value.toNumber() * -1, 1)[0]);

  vm.cursor += 1;
  return true;
}

/**
 * Executes OP_Code
 *
 * @param {VM} vm - vm to execute on
 * @returns {boolean} isValid
 */
function OP_ROT(vm) {
  // No stack overflows
  if (vm.stack.length < 3) {
    return false;
  }

  vm.stack.push(vm.stack.splice(-3, 1)[0]);

  vm.cursor += 1;
  return true;
}

/**
 * Executes OP_Code
 *
 * @param {VM} vm - vm to execute on
 * @returns {boolean} isValid
 */
function OP_SWAP(vm) {
  // No stack overflows
  if (vm.stack.length < 2) {
    return false;
  }

  vm.stack.push(vm.stack.splice(-2, 1)[0]);

  vm.cursor += 1;
  return true;
}

/**
 * Executes OP_Code
 *
 * @param {VM} vm - vm to execute on
 * @returns {boolean} isValid
 */
function OP_TUCK(vm) {
  // No stack overflows
  if (vm.stack.length < 2) {
    return false;
  }

  vm.stack.splice(-2, 0, vm.stack[vm.stack.length - 1]);

  vm.cursor += 1;
  return true;
}

/**
 * Executes OP_Code
 *
 * @param {VM} vm - vm to execute on
 * @returns {boolean} isValid
 */
function OP_2DROP(vm) {
  // No stack overflows
  if (vm.stack.length < 2) {
    return false;
  }

  vm.stack.pop();
  vm.stack.pop();

  vm.cursor += 1;
  return true;
}

/**
 * Executes OP_Code
 *
 * @param {VM} vm - vm to execute on
 * @returns {boolean} isValid
 */
function OP_2DUP(vm) {
  // No stack overflows
  if (vm.stack.length < 2) {
    return false;
  }

  const value1 = vm.stack[vm.stack.length - 1];
  const value2 = vm.stack[vm.stack.length - 2];

  vm.stack.push(value2);
  vm.stack.push(value1);

  vm.cursor += 1;
  return true;
}

/**
 * Executes OP_Code
 *
 * @param {VM} vm - vm to execute on
 * @returns {boolean} isValid
 */
function OP_3DUP(vm) {
  // No stack overflows
  if (vm.stack.length < 3) {
    return false;
  }

  const value1 = vm.stack[vm.stack.length - 1];
  const value2 = vm.stack[vm.stack.length - 2];
  const value3 = vm.stack[vm.stack.length - 3];

  vm.stack.push(value3);
  vm.stack.push(value2);
  vm.stack.push(value1);

  vm.cursor += 1;
  return true;
}

/**
 * Executes OP_Code
 *
 * @param {VM} vm - vm to execute on
 * @returns {boolean} isValid
 */
function OP_2OVER(vm) {
  // No stack overflows
  if (vm.stack.length < 4) {
    return false;
  }

  // TODO
  vm.cursor += 1;
  return true;
}

/**
 * Executes OP_Code
 *
 * @param {VM} vm - vm to execute on
 * @returns {boolean} isValid
 */
function OP_2ROT(vm) {
  // No stack overflows
  if (vm.stack.length < 6) {
    return false;
  }

  // TODO
  vm.cursor += 1;
  return true;
}

/**
 * Executes OP_Code
 *
 * @param {VM} vm - vm to execute on
 * @returns {boolean} isValid
 */
function OP_2SWAP(vm) {
  // No stack overflows
  if (vm.stack.length < 4) {
    return false;
  }

  // TODO
  vm.cursor += 1;
  return true;
}

module.exports = {
  OP_TOALTSTACK,
  OP_FROMALTSTACK,
  OP_IFDUP,
  OP_DEPTH,
  OP_DROP,
  OP_DUP,
  OP_NIP,
  OP_OVER,
  OP_PICK,
  OP_ROLL,
  OP_ROT,
  OP_SWAP,
  OP_TUCK,
  OP_2DROP,
  OP_2DUP,
  OP_3DUP,
  OP_2OVER,
  OP_2ROT,
  OP_2SWAP,
};
