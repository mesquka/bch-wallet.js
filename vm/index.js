const BN = require('bn.js');
const operations = require('./operations');
const Transaction = require('../transaction');

/**
 * Transaction
 *
 * @class
 */
class VM {
  /**
   * VM stack
   *
   * @member {Array<string>}
   */
  stack = [];

  /**
   * Alt stack
   *
   * @member {Array<string>}
   */
  altStack = [];

  /**
   * Transaction to validate (optional)
   * Only required if scripts use OP_CHECKSIG
   *
   * @member {Transaction}
   */
  transaction;

  /**
   * Script to run
   *
   * @member {Array<string>}
   */
  script = [];

  /**
   * Cursor position on script
   *
   * @member {number}
   */
  cursor = 0;

  /**
   * Track if-else-endif blocks
   * true if a previous block was executed
   * false if not
   *
   * @member {Array<boolean>}
   */
  block = [];

  /**
   * Resets execution
   */
  reset() {
    this.stack = [];
    this.altStack = [];
    this.cursor = 0;
  }

  /**
   * Executes next step of script
   *
   * @returns {boolean} if step executed successfully
   */
  step() {
    const step = this.script[this.cursor];

    // If OP_CODE, execute
    if (step.startsWith('OP_')) {
      // Return operation success
      return operations[step](this);
    }

    // TODO: Switch BN to Buffer to allow script number encoding
    // Otherwise this is data, push to stack
    this.stack.push(new BN(step, 16));

    // Return success
    this.cursor += 1;
    return true;
  }

  /**
   * Executes script
   *
   * @returns {boolean} if script executed successfully
   */
  execute() {
    // Loop execute this.step() till end or error
    // eslint-disable-next-line no-empty
    while (this.step() && this.cursor < this.script.length) {}

    // If we didn't make it to the end, return flase
    if (this.cursor < this.script.length) {
      return false;
    }

    // If all blocks (OP_IF, OP_NOTIF, OP_ELSE) haven't been terminated by OP_ENDIF return false
    if (this.block.length > 0) {
      return false;
    }

    return true;
  }
}

module.exports = VM;
