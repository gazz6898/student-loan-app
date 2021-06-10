const HOST_URL = 'http://localhost';

export const APIS = {
  GATEWAY: '4000',
  AUTH: '4001',
  DB: '4002',
  EXTDB: '5000',
};

const jsonReq = async (url, body = {}, req = {}) =>
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    ...req,
  }).then(res => res.json());

class APIClient {
  constructor() {
    this.token = null;
  }

  async routes() {
    const response = await jsonReq(`${HOST_URL}:${APIS.GATEWAY}/routes`, { token: client.token })
  }

  async login({ email, password }) {
    const response = await jsonReq(`${HOST_URL}:${APIS.GATEWAY}/login`, { email, password });
    if (response.token) {
      this.token = response.token;
    }
    return response;
  }

  async json({ api, route }, body) {
    return jsonReq(`${HOST_URL}:${api}/${route}`, body);
  }

  async request({ api, route = '' }, req) {
    return fetch(`${HOST_URL}:${api}/${route}`, req);
  }

  async query({ model, where }) {
    return jsonReq(`${HOST_URL}:${APIS.DB}/query/${model}`, { where });
  }
}

export const client = new APIClient();
