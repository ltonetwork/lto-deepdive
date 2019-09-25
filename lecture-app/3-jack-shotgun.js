const LTOHelper = require('./lib/LTOHelper');

const nodeUrl = 'http://lto-fullnode-staging.eu-west-1.elasticbeanstalk.com';
const chainId = '2bqA41yqF8KRSvnH4CHFcNFUWp7J2aUvGpBZ2Uss7dMFrXQvN9Bki7LfmrnKJw';

const main = async () => {

    const lto = new LTOHelper(nodeUrl);

    // Create KeyPairs for Jack
    const jack = lto.createAccount('the seed of jack');

    // Initialize an empty chain, created by jack
    let chain = await lto.loadChain(jack, chainId);

    // Can Jack travel back in time and say SHOTGUN before Jill somehow?

    //chain = lto.addMessageEvent(chain, jack, "shotgun");

    try {
        const res = await lto.sendChain(jack, chain);
        console.log(res.data);
    } catch (e) {
        console.log(e.response.data);
        return;
    }
};

main();
