const LTOHelper = require('./lib/LTOHelper');
const sha256 = require('crypto-js/sha256');
const nodeUrl = 'http://localhost:3000';

const main = async () => {

  const lto = new LTOHelper(nodeUrl);

  // Create KeyPairs for both participants
  const orphan = lto.createAccount('the seed of orphan');
  const onderwijsinstelling = lto.createAccount('the seed of onderwijsinstelling');
  const gba = lto.createAccount('the seed of gba');

  // Initialize an empty chain
  let chain = lto.createEventChain(orphan, 'process-identifier');

  //Based on the chain we can generate resource ids for resources like actors and the process
  const processId = chain.createProjectionId('main');
  orphan.id = chain.createProjectionId('orphan');
  onderwijsinstelling.id = chain.createProjectionId('onderwijsinstelling');
  gba.id = chain.createProjectionId('gba');

  // For testing purposes remove the chain if it already exists
  await lto.deleteEventChain(orphan, chain.id);
  await lto.deleteProcess(orphan, processId);

  // To be able to interact with the chain the identity (with it's public key) needs to be added to the chain
  chain = await lto.addIdentityEvent(chain, orphan, 'orphan');

  // To be able to interact with the chain the identity (with it's public key) needs to be added to the chain
  // Only the initiator is allowed to add new identities, this event needs to be signed by the initiator
  chain = await lto.addIdentityEvent(chain, onderwijsinstelling, 'onderwijsinstelling', orphan);

  // To be able to interact with the chain the identity (with it's public key) needs to be added to the chain
  // Only the initiator is allowed to add new identities, this event needs to be signed by the initiator
  chain = await lto.addIdentityEvent(chain, gba, 'gba', orphan);

  // Load the scenario and add it to the chain
  const scenario = require(`./scenarios/empty.json`);
  scenario.id = sha256(JSON.stringify(scenario)).toString();
  chain = lto.addScenarioEvent(chain, orphan, scenario);

  // Start the process
  const actors = {
    orphan: orphan.id,
    onderwijsinstelling: onderwijsinstelling.id,
    gba: gba.id
  };
  chain = lto.addProcessInitationEvent(chain, orphan, scenario.id, processId, actors);

  // Send the initial data from the orphan
  const data = {
    older_18: true,
    older_21: false,
    studying: false
  };
  chain = lto.addResponseEvent(chain, orphan, processId, 'start', 'ok', data);

  try {
    const res = await lto.sendChain(orphan, chain);
    console.log('Started');
    //console.log(res.data);
  } catch (e) {
    console.log(e.response.data);
    return;
  }

  // The educational instatution will set the that the orphan is styding
  const studyData = {
    studying: true
  };
  chain = lto.addResponseEvent(chain, onderwijsinstelling, processId, 'receive_info_oi', 'ok', studyData);

  try {
    const res = await lto.sendChain(onderwijsinstelling, chain);
    console.log('Started studying');
    // console.log(res.data);
  } catch (e) {
    console.log(e.response.data);
    return;
  }

  chain = await lto.loadChain(onderwijsinstelling, chain.id);

  // The gba will change the age of the orphan to older then 21
  const ageData = {
    older_21: true
  };
  chain = lto.addResponseEvent(chain, gba, processId, 'receive_info_gba', 'ok', ageData);

  try {
    const res = await lto.sendChain(gba, chain);
    console.log(res.data);
  } catch (e) {
    console.log(e.response.data);
    return;
  }
};

main();