/* eslint-disable no-console */
const { ElectrumClient } = require('electrum-cash');

const defaultServers = {
  tcp: [],
  websocket: [],
};

const processedServers = [
  process.argv[2],
];

const queue = [
  { host: process.argv[2], port: parseInt(process.argv[3], 10), tries: 0 },
];

/**
 * Get server features and discover peers
 */
async function processQueue() {
  // Get next server
  const server = queue.pop();

  // Log out what server we're processing
  console.log(`Processing server ${server.host}`);

  try {
    // Connect to server
    const electrum = new ElectrumClient('bch-wallet', '1.4.3', server.host, server.port);

    if (!await electrum.connect()) {
      // Add server back to queue until retry limit is reached
      if (server.tries < 2) {
        console.log(`Couldn't connect to server ${server.host}, trying later (${server.tries + 1} tries)`);
        server.tries += 1;
        queue.unshift(server);
      } else {
        console.log(`Couldn't connect to server ${server.host}, rety limit reached`);
      }
      return;
    }

    // Fetch peer list and features
    const peers = await electrum.request('server.peers.subscribe');
    const features = await electrum.request('server.features');

    // Disconnect, we don't need this anymore
    await electrum.disconnect();

    // Loop through each peer
    peers.forEach((peer) => {
      let port = 0;

      // Check if this peer has a tls port
      peer[2].forEach((feature) => {
        if (feature.startsWith('s')) {
          port = parseInt(feature.substring(1), 10);
        }
      });

      // Check if this isn't a peet that we've already processe
      // isn't a tor node, and has a tls port
      if (!processedServers.includes(peer[1]) && !peer[1].includes('.onion') && port) {
        // Push peer to processed servers list
        processedServers.push(peer[1]);

        // Add to queue
        queue.unshift({
          host: peer[1],
          port,
          tries: 0,
        });
      }
    });

    console.log(features);

    // Check server features
    Object.keys(features.hosts).forEach((host) => {
      // Ignore tor addresses
      if (!host.includes('.onion')) {
        // Check if server has tls port
        if (features.hosts[host].ssl_port) {
          // Add to defaultServer config
          defaultServers.tcp.push({
            host: server.host,
            port: features.hosts[host].ssl_port,
            transport: 'tcp_tls',
          });
        }

        // Check if server has secure websocket port
        if (features.hosts[host].wss_port) {
          // Add to defaultServer config
          defaultServers.websocket.push({
            host: server.host,
            port: features.hosts[host].wss_port,
            transport: 'wss',
          });
        }
      }
    });
  } catch (error) {
    // Add server back to queue until retry limit is reached
    if (server.tries < 2) {
      console.log(`Encountered error with server ${server.host}, trying later (${server.tries + 1} tries)`);
      server.tries += 1;
      queue.unshift(server);
    } else {
      console.log(`Encountered error with server ${server.host}, rety limit reached`);
    }
  }

  console.log(queue);
}

/**
 * Run discovery
 */
async function discover() {
  while (queue.length > 0) {
    // eslint-disable-next-line no-await-in-loop
    await processQueue();
  }

  // Output server list
  console.log(JSON.stringify(defaultServers, null, 2));
}

if (process.argv[2] && process.argv[3]) {
  // Discover server
  discover();
} else {
  console.log('Format: node test/discover_electrum_servers.js [initial host] [initial port]');
  console.log('Example: node test/discover_electrum_servers.js fulcrum.fountainhead.cash 50002');
}
