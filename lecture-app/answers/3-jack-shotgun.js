// Try to figure it out for yourself :-)


































































































const LTOHelper = require('../lib/LTOHelper');
const { Event } = require('lto-api');

const nodeUrl = 'http://lto-fullnode-lecture.eu-west-1.elasticbeanstalk.com';
const chainId = '2bqA41yqF8KRSvnH4CHFcNFUWp7J2aUvGpBZ2Uss7dMFrXQvN9Bki7LfmrnKJw';

const main = async () => {

    const lto = new LTOHelper(nodeUrl);

    // Create KeyPairs for both participants
    const jack = lto.createAccount('the seed of jack');

    // Initialize an empty chain, created by jack
    let chain = await lto.loadChain(jack, chainId);

    // Remove the "shotgun" message of Jill.
    const jillsEvent = chain.events.pop();

    // Jake creates his own "shotgun" message
    const event = new Event({
        '$schema': 'https://example.livecontracts.io/message#',
        message: "shotgun!!!"
    });

    // Set the timestamp to 1 second before Jill
    event.timeStamp = jillsEvent.timestamp - 1;

    // Sign and add >:-)
    event.addTo(chain).signWith(jack);

    try {
        const res = await lto.sendChain(jack, chain);
        console.log(res.data);
    } catch (e) {
        console.log(e.response.data);
        return;
    }
};

main();
