const clientId = process.env.NEXT_PUBLIC_CLIENT_ID;
const redirectUri =process.env.NEXT_PUBLIC_BASE_SITE_URI + '/callback';
const clientSecret = process.env.NEXT_PUBLIC_CLIENT_SECRET;

const host = /http[s]?:\/\/[^/]+/.exec(redirectUri)[0];

export default {
  clientId,
  redirectUri,
  clientSecret,
  host,
};
