const clientId = '0bfcbd1dec1c4c7cb04b2d8bb403d6e2';
const redirectUri ='http://localhost:3000/callback';

const host = /http[s]?:\/\/[^/]+/.exec(redirectUri)[0];

export default {
  clientId,
  redirectUri,
  host,
};
