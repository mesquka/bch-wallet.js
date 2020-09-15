const { ElectrumCluster } = require('electrum-cash');
const defaults = require('./defaults.json');

const isNode = typeof process !== 'undefined'
  && process.versions != null
  && process.versions.node != null;

class Electrum {
  /**
   * Electrum Cluster Client
   *
   * @member {ElectrumCluster}
   */
  client;

  /**
   * Subscriptions to addresses
   *
   * @member {object<Array<Function>>}
   */
  addressSubscriptions = {};

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
   * Handles subscription events for addresses
   *
   * @param {any} data - data from electrum
   */
  handleAddressSubscription(data) {
    if (
      // Filter out initial fire offs on subscribe
      Array.isArray(data)
      // Make sure we have subscriptions for this address
      && this.addressSubscriptions[data[0]]
      && this.addressSubscriptions[data[0]].length > 0
    ) {
      // Call all functions subscribed here
      this.addressSubscriptions[data[0]].forEach((callback) => {
        callback(data);
      });
    }
  }

  /**
   * Electrum request
   *
   * @function
   * @param {string} method - electrum method to call
   * @param {...any} params - arguments
   * @returns {any} response - electrum response
   */
  async request(method, ...params) {
    // Queue request until connection is ready
    await this.client.ready();

    // Return request
    return this.client.request(method, ...params);
  }

  /**
   * Subscribe to Electrum events
   *
   * @function
   * @param {Function} callback - callback function
   * @param {string} method - electrum method to call
   * @param {...any} params - arguments
   * @returns {any} response - electrum response
   */
  async subscribe(callback, method, ...params) {
    // Queue request until connection is ready
    await this.client.ready();

    // Intercept address/scripthas subscriptions
    if (method === 'blockchain.address.subscribe' || method === 'blockchain.scripthash.subscribe') {
      // Add to our subscription pool
      this.addressSubscriptions[params[0]] = this.addressSubscriptions[params[0]] || [];
      this.addressSubscriptions[params[0]].push(callback);

      // Send as normal request to update server on subscriptions bypassing electrum-cash
      this.client.subscribe(this.handleAddressSubscription.bind(this), method, ...params);
    }

    // Handle subscription normally
    return this.client.request(callback, method, ...params);
  }
}

module.exports = Electrum;
