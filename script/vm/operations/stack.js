const BN = require('bn.js');
const VM = require('..');

/**
 * Executes OP_Code
 *
 * @param {VM} vm - vm to execute on
 * @returns {boolean} isValid
 */
function OP_TOALTSTACK(vm) {
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
  const value = vm.stack.pop();

  vm.stack.push(vm.stack[vm.stack.length - 1 - value.toNumber()]);

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
  const value = vm.stack.pop();

  vm.stack.push(vm.stack.slice(value.toNumber() * -1));

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
