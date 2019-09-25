const LTOHelper = require('./lib/LTOHelper');

const nodeUrl = 'http://lto-fullnode-lecture.eu-west-1.elasticbeanstalk.com';

const main = async () => {

  const lto = new LTOHelper(nodeUrl);

  // Create KeyPairs for both participants
  const jack = lto.createAccount('the seed of jack');
  const jill = lto.createAccount('the seed of jill');

  // Initialize an empty chain, created by jack
  let chain = lto.createEventChain(jack, 'hello-world');

  // Based on the chain we can generate resource ids for the participants
  jack.id = chain.createProjectionId('jack');
  jill.id = chain.createProjectionId('jill');

  // For testing purposes remove the chain if it already exists
  await lto.deleteEventChain(jack, chain.id);

  // To be able to interact with the chain the identity (with it's public key) needs to be added to the chain
  // The creator of the chain can self-sign their identity event
  chain = await lto.addIdentityEvent(chain, jack);

  // Subsequent identities must be signed by an existing participants.
  chain = await lto.addIdentityEvent(chain, jill, jack);

  try {
    const res = await lto.sendChain(jack, chain);
    console.log(res.data);
  } catch (e) {
    console.log(e.response.data);
    return;
  }
};

main();
