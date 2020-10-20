const BN = require('bn.js');
const VM = require('..');

/**
 * Executes OP_Code
 *
 * @param {VM} vm - vm to execute on
 * @returns {boolean} isValid
 */
function OP_0(vm) {
  vm.stack.push(new BN(0));
  vm.cursor += 1;
  return true;
}

/**
 * Executes OP_Code
 *
 * @param {VM} vm - vm to execute on
 * @returns {boolean} isValid
 */
function OP_1NEGATE(vm) {
  vm.stack.push(new BN(-1));
  vm.cursor += 1;
  return true;
}

/**
 * Executes OP_Code
 *
 * @param {VM} vm - vm to execute on
 * @returns {boolean} isValid
 */
function OP_1(vm) {
  vm.stack.push(new BN(1));
  vm.cursor += 1;
  return true;
}

/**
 * Executes OP_Code
 *
 * @param {VM} vm - vm to execute on
 * @returns {boolean} isValid
 */
function OP_2(vm) {
  vm.stack.push(new BN(2));
  vm.cursor += 1;
  return true;
}

/**
 * Executes OP_Code
 *
 * @param {VM} vm - vm to execute on
 * @returns {boolean} isValid
 */
function OP_3(vm) {
  vm.stack.push(new BN(3));
  vm.cursor += 1;
  return true;
}

/**
 * Executes OP_Code
 *
 * @param {VM} vm - vm to execute on
 * @returns {boolean} isValid
 */
function OP_4(vm) {
  vm.stack.push(new BN(4));
  vm.cursor += 1;
  return true;
}

/**
 * Executes OP_Code
 *
 * @param {VM} vm - vm to execute on
 * @returns {boolean} isValid
 */
function OP_5(vm) {
  vm.stack.push(new BN(5));
  vm.cursor += 1;
  return true;
}

/**
 * Executes OP_Code
 *
 * @param {VM} vm - vm to execute on
 * @returns {boolean} isValid
 */
function OP_6(vm) {
  vm.stack.push(new BN(6));
  vm.cursor += 1;
  return true;
}

/**
 * Executes OP_Code
 *
 * @param {VM} vm - vm to execute on
 * @returns {boolean} isValid
 */
function OP_7(vm) {
  vm.stack.push(new BN(7));
  vm.cursor += 1;
  return true;
}

/**
 * Executes OP_Code
 *
 * @param {VM} vm - vm to execute on
 * @returns {boolean} isValid
 */
function OP_8(vm) {
  vm.stack.push(new BN(8));
  vm.cursor += 1;
  return true;
}

/**
 * Executes OP_Code
 *
 * @param {VM} vm - vm to execute on
 * @returns {boolean} isValid
 */
function OP_9(vm) {
  vm.stack.push(new BN(9));
  vm.cursor += 1;
  return true;
}

/**
 * Executes OP_Code
 *
 * @param {VM} vm - vm to execute on
 * @returns {boolean} isValid
 */
function OP_10(vm) {
  vm.stack.push(new BN(10));
  vm.cursor += 1;
  return true;
}

/**
 * Executes OP_Code
 *
 * @param {VM} vm - vm to execute on
 * @returns {boolean} isValid
 */
function OP_11(vm) {
  vm.stack.push(new BN(11));
  vm.cursor += 1;
  return true;
}

/**
 * Executes OP_Code
 *
 * @param {VM} vm - vm to execute on
 * @returns {boolean} isValid
 */
function OP_12(vm) {
  vm.stack.push(new BN(12));
  vm.cursor += 1;
  return true;
}

/**
 * Executes OP_Code
 *
 * @param {VM} vm - vm to execute on
 * @returns {boolean} isValid
 */
function OP_13(vm) {
  vm.stack.push(new BN(13));
  vm.cursor += 1;
  return true;
}

/**
 * Executes OP_Code
 *
 * @param {VM} vm - vm to execute on
 * @returns {boolean} isValid
 */
function OP_14(vm) {
  vm.stack.push(new BN(14));
  vm.cursor += 1;
  return true;
}

/**
 * Executes OP_Code
 *
 * @param {VM} vm - vm to execute on
 * @returns {boolean} isValid
 */
function OP_15(vm) {
  vm.stack.push(new BN(15));
  vm.cursor += 1;
  return true;
}

/**
 * Executes OP_Code
 *
 * @param {VM} vm - vm to execute on
 * @returns {boolean} isValid
 */
function OP_16(vm) {
  vm.stack.push(new BN(16));
  vm.cursor += 1;
  return true;
}

module.exports = {
  OP_0,
  OP_1NEGATE,
  OP_1,
  OP_2,
  OP_3,
  OP_4,
  OP_5,
  OP_6,
  OP_7,
  OP_8,
  OP_9,
  OP_10,
  OP_11,
  OP_12,
  OP_13,
  OP_14,
  OP_15,
  OP_16,
};
