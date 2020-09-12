const { ElectrumCluster } = require('electrum-cash');
const isNode = require('../utils/is-node');
const defaultServers = require('./defaultServers.json');

class Electrum {
  /**
   * Electrum Cluster Client
   *
   * @member {ElectrumCluster}
   */
  client;

  /**
   * Request Queue
   *
   * @member {ElectrumCluster}
   */
  queue;

  /**
   * Default Electrum threshold
   *
   * @member {ElectrumCluster}
   */
  defaultThreshold = {
    confidence: 2,
    distribution: 3,
  }

  /**
   * Electrum
   *
   * @class Electrum
   * @param {object} [options] - Options for electrum client
   */
  constructor(options) {
    options = options || {};
    options.network = options.network || 'mainnet';

    if (isNode) {
      options.servers = options.servers || defaultServers[options.network].tcp;
    } else {
      options.servers = options.servers || defaultServers[options.network].websocket;
    }

    // Instantiate client
    this.client = new ElectrumCluster('bch-wallet', '1.4.3', 2, 3);

    // Loop through server list and add to client
    options.servers.forEach((server) => {
      this.client.addServer(server.host, server.port, server.transport);
    });
  }
}

module.exports = Electrum;
