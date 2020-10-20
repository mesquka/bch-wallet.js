const BN = require('bn.js');
const VM = require('..');

/**
 * Executes OP_Code
 *
 * @param {VM} vm - vm to execute on
 * @returns {boolean} isValid
 */
function OP_NOP(vm) {
  vm.cursor += 1;
  return true;
}

/**
 * Executes OP_Code
 *
 * @param {VM} vm - vm to execute on
 * @returns {boolean} isValid
 */
function OP_IF(vm) {
  // No stack overflows
  if (vm.stack.length < 1) {
    return false;
  }

  const value = vm.stack.pop();

  // If value is true set block execution bit to true and return
  if (value.eq(new BN(1))) {
    vm.block.push(true);
    vm.cursor += 1;
    return true;
  }

  // Not true, wind forward till we hit an OP_ELSE or OP_IF
  while (
    vm.cursor < vm.script.length
    && vm.script[vm.cursor] !== 'OP_ELSE'
    && vm.script[vm.cursor] !== 'OP_ENDIF'
  ) {
    vm.cursor += 1;
  }

  // Push false execution bit
  vm.block.push(false);
  return true;
}

/**
 * Executes OP_Code
 *
 * @param {VM} vm - vm to execute on
 * @returns {boolean} isValid
 */
function OP_NOTIF(vm) {
  // No stack overflows
  if (vm.stack.length < 1) {
    return false;
  }

  const value = vm.stack.pop();

  // If value is false set block execution bit to true and return
  if (value.eq(new BN(0))) {
    vm.block.push(true);
    vm.cursor += 1;
    return true;
  }

  // Not false, wind forward till we hit an OP_ELSE or OP_IF
  while (
    vm.cursor < vm.script.length
    && vm.script[vm.cursor] !== 'OP_ELSE'
    && vm.script[vm.cursor] !== 'OP_ENDIF'
  ) {
    vm.cursor += 1;
  }

  // Push false execution bit
  vm.block.push(false);
  return true;
}

/**
 * Executes OP_Code
 *
 * @param {VM} vm - vm to execute on
 * @returns {boolean} isValid
 */
function OP_ELSE(vm) {
  // No preceeding OP_IF or OP_NOTIF, fail transaction
  if (vm.block.length === 0) {
    return false;
  }

  // If block execution bit is false set it to true and return
  if (vm.block[vm.block.length - 1] === false) {
    vm.block.push(true);
    vm.cursor += 1;
    return true;
  }

  vm.cursor += 1;

  // Block execution bit was true, wind forward till we hit an OP_ELSE or OP_IF
  while (
    vm.cursor < vm.script.length
    && vm.script[vm.cursor] !== 'OP_ELSE'
    && vm.script[vm.cursor] !== 'OP_ENDIF'
  ) {
    vm.cursor += 1;
  }

  return true;
}

/**
 * Executes OP_Code
 *
 * @param {VM} vm - vm to execute on
 * @returns {boolean} isValid
 */
function OP_ENDIF(vm) {
  // No preceeding OP_IF or OP_NOTIF, fail transaction
  if (vm.block.length === 0) {
    return false;
  }

  // Remove block execution bit
  vm.block.pop();

  vm.cursor += 1;
  return true;
}

/**
 * Executes OP_Code
 *
 * @param {VM} vm - vm to execute on
 * @returns {boolean} isValid
 */
function OP_VERIFY(vm) {
  // No stack overflows
  if (vm.stack.length < 1) {
    return false;
  }

  const value = vm.stack.pop();
  vm.cursor += 1;
  return value.eq(new BN(1));
}

/**
 * Executes OP_Code
 *
 * @param {VM} vm - vm to execute on
 * @returns {boolean} isValid
 */
function OP_RETURN(vm) {
  vm.cursor += 1;
  return false;
}

module.exports = {
  OP_NOP,
  OP_IF,
  OP_NOTIF,
  OP_ELSE,
  OP_ENDIF,
  OP_VERIFY,
  OP_RETURN,
};
