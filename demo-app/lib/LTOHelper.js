const { LTO, Request, HTTPSignature, Event, EventChain } = require('lto-api');
const axios = require('axios');

class LTOHelper {

  constructor(url) {
    this.url = url || 'http://localhost:3000';
    this.lto = new LTO();
  }

  createAccount(seed) {
    return this.lto.createAccountFromExistingPhrase(seed);
  }

  async loadSystemKey() {
    if (!this.systemKey) {
      const resp = await axios({url: `${this.url}`});
      this.systemKey = resp.data.services.events.signkey;
    }

    return this.systemKey;
  }

  async loadNodeAddress() {
    if (!this.nodeAddress) {
      const resp = await axios({url: `${this.url}`});
      this.nodeAddress = resp.data.services.queuer.node ? resp.data.services.queuer.node : 'ampqs://localhost';
    }

    return this.nodeAddress;
  }

  createEventChain(account, id) {
    return account.createEventChain(id);
  }

  async addIdentityEvent(chain, account, id, signingAccount) {
    const accountId = chain.createProjectionId(id);

    const nodeAddress = await this.loadNodeAddress();
    const systemKey = await this.loadSystemKey();

    const event = new Event({
      $schema: 'https://specs.livecontracts.io/v0.2.0/identity/schema.json#',
      id: accountId,
      node: nodeAddress,
      signkeys: {
        default: account.getPublicSignKey(),
        system: systemKey
      },
      encryptkey: account.getPublicEncryptKey()
    });

    if (!signingAccount) {
      signingAccount = account;
    }

    event.addTo(chain).signWith(signingAccount);
    return chain;
  }

  addScenarioEvent(chain, account, scenario) {

    const scenarioEvent = new Event(scenario);
    scenarioEvent.addTo(chain).signWith(account);

    return chain;
  }

  addProcessInitationEvent(chain, account, scenarioId, processId, actors) {
    const initialize = {
      '$schema': 'https://specs.livecontracts.io/v0.2.0/process/schema.json#',
      id: processId,
      scenario: scenarioId,
      actors
    };
    const initEvent = new Event(initialize);
    initEvent.addTo(chain).signWith(account);

    return chain;
  }

  addResponseEvent(chain, account, processId, actionKey, key, data) {

    const response = {
      '$schema': 'https://specs.livecontracts.io/v0.2.0/response/schema.json#',
      process: processId,
      action: {
        key: actionKey
      },
      key
    };

    if (data) {
      response.data = data;
    }

    const responseEvent = new Event(response);
    responseEvent.addTo(chain).signWith(account);

    return chain;
  }

  async loadChain(account, chainId) {
    const path = `/event-chains/${chainId}`;
    const method = 'get';

    const chain = new EventChain();
    const resp = await this.sendRequest(account, path, method);

    return chain.setValues(resp.data);
  }

  sendChain(account, chain) {
    const path = '/event-chains';
    const method = 'post';

    return this.sendRequest(account, path, method, chain);
  }

  async deleteEventChain(account, chainId) {
    const path = `/event-chains/${chainId}`;
    const method = 'delete';

    try {
      return await this.sendRequest(account, path, method);
    } catch (ex) {
      if (ex.response.status == 404) {
        return null;
      } else {
        throw ex;
      }
    }
  }

  loadProcess(account, processId) {
    const path = `/processes/${processId}`;
    const method = 'get';

    return this.sendRequest(account, path, method);
  }

  async deleteProcess(account, processId) {
    const path = `/processes/${processId}`;
    const method = 'delete';

    try {
      return await this.sendRequest(account, path, method);
    } catch (ex) {
      if (ex.response.status == 404) {
        return null;
      } else {
        throw ex;
      }
    }
  }

  async sendRequest(account, path, method, data, qs) {
    const date = (new Date()).toUTCString();

    const headers = {
      'date': date
    };

    const req = new Request(path, method, headers);

    const signature = new HTTPSignature(req, ['(request-target)', 'date']);
    // console.log(signature.signWith(account));
    headers.authorization = `Signature ${signature.signWith(account)}`;
    // headers['www-authenticate'] = `Signature ${signature.signWith(account)}`;

    const requestOptions = {
      method,
      url: this.url + path,
      headers
    };

    if (data) {
      requestOptions.data = data;
    }

    if (qs) {
      requestOptions.params = qs;
    }

    const resp = await axios(requestOptions);
    return resp;
  }
}

module.exports = LTOHelper;