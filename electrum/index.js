const { ElectrumCluster } = require('electrum-cash');
const isNode = require('../utils/is-node');
const defaults = require('./defaults.json');

class Electrum {
  /**
   * Electrum Cluster Client
   *
   * @member {ElectrumCluster}
   */
  client;

  /**
   * Electrum
   *
   * @class Electrum
   * @param {object} [options] - Options for electrum client
   */
  constructor(options) {
    options = options || {};
    options.network = options.network || 'mainnet';
    options.threshold = options.threshold || defaults[options.network].threshold;

    if (isNode) {
      options.servers = options.servers || defaults[options.network].tcp;
    } else {
      options.servers = options.servers || defaults[options.network].websocket;
    }

    // Instantiate client
    this.client = new ElectrumCluster(
      'bch-wallet',
      '1.4.3',
      options.threshold.confidence,
      options.threshold.distribution,
    );

    // Loop through server list and add to client
    options.servers.forEach((server) => {
      this.client.addServer(server.host, server.port, server.transport);
    });
  }

  /**
   * Electrum request
   *
   * @param {string} method - electrum method to call
   * @param {...any} params - arguments
   * @returns {any} response - electrum response
   */
  async request(method, ...params) {
    await this.client.ready();
    return this.client.request(method, ...params);
  }

  /**
   * Subscribe to Electrum events
   *
   * @param {Function} callback - callback function
   * @param {string} method - electrum method to call
   * @param {...any} params - arguments
   * @returns {any} response - electrum response
   */
  async subscribe(callback, method, ...params) {
    await this.client.ready();
    return this.client.request(callback, method, ...params);
  }
}

module.exports = Electrum;
