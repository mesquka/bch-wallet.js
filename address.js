/**
 * Encode/Decode Addresses
 * Based on Emilio Almansi's bchaddrjs (https://github.com/ealmansi/bchaddrjs)
 *
 * @module address
 */

const cashaddr = require('cashaddrjs-slp');
const bs58check = require('bs58check');

// Version byte lookup object
const VERSION_BYTE = {
  mainnet: {
    P2PKH: 0,
    P2SH: 5,
  },
  testnet: {
    P2PKH: 111,
    P2SH: 196,
  },
};

/**
 * Decodes Legacy Address
 *
 * @param {string} address - A valid Bitcoin Cash address in logacy format
 * @returns {object} decoded address
 */
function decodeLegacy(address) {
  // Decode checksummed Base 58 address
  const payload = bs58check.decode(address);

  // Check payload is the expected length
  if (payload.length !== 21) {
    throw new Error();
  }

  // Get version byte
  const versionByte = payload[0];

  // Get hash160 payload
  const hash160 = payload.slice(1);

  // Decode address type and network from version byte
  switch (versionByte) {
    case VERSION_BYTE.mainnet.P2PKH:
      return {
        hash160,
        network: 'mainnet',
        type: 'P2PKH',
      };
    case VERSION_BYTE.mainnet.P2SH:
      return {
        hash160,
        network: 'mainnet',
        type: 'P2SH',
      };
    case VERSION_BYTE.testnet.P2PKH:
      return {
        hash160,
        network: 'testnet',
        type: 'P2PKH',
      };
    case VERSION_BYTE.testnet.P2SH:
      return {
        hash160,
        network: 'testnet',
        type: 'P2SH',
      };
    default:
      // Doesn't match any known version byte, throw error
      throw new Error();
  }
}

/**
 * Decodes Cash Address
 *
 * @param {string} address - A valid Bitcoin Cash address in cashaddress format
 * @returns {object} decoded - Decoded address object
 */
function decodeCashaddress(address) {
  try {
    // Decode cashaddr format address
    const decoded = cashaddr.decode(address);

    // Return address object
    switch (decoded.prefix) {
      case 'bitcoincash':
        return {
          hash160: decoded.hash,
          network: 'mainnet',
          type: decoded.type,
        };
      case 'bchtest':
        return {
          hash160: decoded.hash,
          network: 'testnet',
          type: decoded.type,
        };
      // TODO: Implement regtest
      default:
        // Unknown network, throw
        throw new Error();
    }
  } catch (error) {
    // Decode failed, throw
    throw new Error();
  }
}

/**
 * Encodes the given decoded address into legacy format
 *
 * @param {string} network - Address network
 * @param {string} type - Address type
 * @param {Buffer} hash160 - Address hash160
 * @returns {string} Address
 */
function encodeLegacy(network, type, hash160) {
  // Fetch version byte
  const versionByte = VERSION_BYTE[network][type];

  // Allocate buffer
  const buffer = Buffer.alloc(21);

  // Set version byte
  buffer[0] = versionByte;

  // Set payload bytes
  buffer.set(hash160, 1);

  // Return encoded address
  return bs58check.encode(buffer);
}

/**
 * Encodes the given decoded address into cashaddress format
 *
 * @param {string} prefix - Address prefix
 * @param {string} type - Address type
 * @param {Buffer} hash160 - Address hash
 * @returns {string} Address
 */
function encodeCashaddress(prefix, type, hash160) {
  // Encode cashaddr
  return cashaddr.encode(prefix, type, hash160);
}

/**
 * Validates a cashaddress format address
 *
 * @param {string} address - Address in cashaddress format
 * @returns {boolean} isValid
 */
function validateCashaddress(address) {
  // Try to decode address
  try {
    decodeCashaddress(address);
  } catch {
    // Decode failed, address is invalid
    return false;
  }
  return true;
}

/**
 * Validates a legacy format address
 *
 * @param {string} address - Address in legacy format
 * @returns {boolean} isValid
 */
function validateLegacyaddress(address) {
  // Try to decode address
  try {
    decodeLegacy(address);
  } catch {
    // Decode failed, address is invalid
    return false;
  }
  return true;
}

/**
 * Validates an address in any format
 *
 * @param {string} address - Address in any format
 * @returns {boolean} isValid
 */
function validate(address) {
  if (validateCashaddress(address) || validateLegacyaddress(address)) {
    return true;
  }
  return false;
}

module.exports = {
  encodeCashaddress,
  encodeLegacy,
  decodeCashaddress,
  decodeLegacy,
  validateCashaddress,
  validateLegacyaddress,
  validate,
};
