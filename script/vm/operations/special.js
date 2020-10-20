const VM = require('..');

/**
 * Executes OP_Code
 *
 * @param {VM} vm - vm to execute on
 * @returns {boolean} isValid
 */
function OP_CHANGESCRIPT(vm) {
  vm.altStack = [];
  vm.cursor += 1;

  // If all blocks (OP_IF, OP_NOTIF, OP_ELSE) haven't been terminated by OP_ENDIF return false
  if (vm.block.length > 0) {
    return false;
  }

  return true;
}

module.exports = {
  OP_CHANGESCRIPT,
};
