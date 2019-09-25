const LTOHelper = require('./lib/LTOHelper');

const nodeUrl = 'http://lto-fullnode-lecture.eu-west-1.elasticbeanstalk.com';
const chainId = '2bqA41yqF8KRSvnH4CHFcNFUWp7J2aUvGpBZ2Uss7dMFrXQvN9Bki7LfmrnKJw';

const main = async () => {

    const lto = new LTOHelper(nodeUrl);

    // Create KeyPairs for Jill
    const jill = lto.createAccount('the seed of jill');

    // Load the chain
    let chain = await lto.loadChain(jill, chainId);

    // SHOTGUN says Jill. It's good to be first.
    chain = lto.addMessageEvent(chain, jill, "shotgun");

    try {
        const res = await lto.sendChain(jill, chain);
        console.log(res.data);
    } catch (e) {
        console.log(e.response.data);
        return;
    }
};

main();
