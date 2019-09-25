const LTOHelper = require('./lib/LTOHelper');

const nodeUrl = 'http://lto-fullnode-lecture.eu-west-1.elasticbeanstalk.com';
const chainId = '2bqA41yqF8KRSvnH4CHFcNFUWp7J2aUvGpBZ2Uss7dMFrXQvN9Bki7LfmrnKJw';

const main = async () => {

    const lto = new LTOHelper(nodeUrl);

    // Create KeyPairs for both participants
    const jack = lto.createAccount('the seed of jack');
    const jill = lto.createAccount('the seed of jill');

    // Load the chain
    let chain = await lto.loadChain(jack, chainId);

    // Jack adds a message to the chain
    chain = lto.addMessageEvent(chain, jack, "Hi Jill");

    // Jill adds a message to the chain
    chain = lto.addMessageEvent(chain, jill, "Hi Jack");

    // ...
    chain = lto.addMessageEvent(chain, jill, "shall we go to the hill?");
    chain = lto.addMessageEvent(chain, jack, "not sure, it might rain");
    chain = lto.addMessageEvent(chain, jill, "I don't think it will rain");
    chain = lto.addMessageEvent(chain, jill, "and a few drops of water won't kill you");
    chain = lto.addMessageEvent(chain, jack, "okay, lets go");

    chain = lto.addMessageEvent(chain, jill, "My mom can bring us");

    try {
        const res = await lto.sendChain(jack, chain);
        console.log(res.data);
    } catch (e) {
        console.log(e.response.data);
        return;
    }
};

main();
