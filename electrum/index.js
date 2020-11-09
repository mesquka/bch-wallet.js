const { ElectrumCluster } = require('electrum-cash');

// Output from https://github.com/mesquka/electrum-seed-cash
const defaultServers = require('./servers.json');

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
    options.threshold = options.threshold || { confidence: 2, distribution: 3 };

    // If we're in a nodejs environment, use TCP as well as websockets
    if (isNode) {
      const servers = [];

      // Loop through servers and push to servers array
      defaultServers[options.network].forEach((server) => {
        if (server.transports.ssl_port) {
          servers.push({
            host: server.host,
            port: server.transports.ssl_port,
            transport: 'tcp_tls',
          });
        } else if (server.transports.wss_port) {
          servers.push({
            host: server.host,
            port: server.transports.wss_port,
            transport: 'wss',
          });
        }
      });

      options.servers = options.servers || servers;
    } else {
      const servers = [];

      // Loop through servers and push to servers array
      defaultServers[options.network].forEach((server) => {
        if (server.transports.wss_port) {
          servers.push({
            host: server.host,
            port: server.transports.wss_port,
            transport: 'wss',
          });
        }
      });

      options.servers = options.servers || servers;
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

    // Intercept address/scripthash subscriptions
    if (method === 'blockchain.address.subscribe' || method === 'blockchain.scripthash.subscribe') {
      // Add to our subscription pool
      this.addressSubscriptions[params[0]] = this.addressSubscriptions[params[0]] || [];
      this.addressSubscriptions[params[0]].push(callback);

      // Handle subscription with specific handler
      return this.client.subscribe(this.handleAddressSubscription.bind(this), method, ...params);
    }

    // Handle subscription normally
    return this.client.request(callback, method, ...params);
  }

  /**
   * Shutsdown electrum connection
   */
  shutdown() {
    // Shutdown electrum
    this.client.shutdown();
  }
}

module.exports = Electrum;
