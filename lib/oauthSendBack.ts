import OAuthConfig from './oauthConfig';

const OAuthSendBack = () => {
  if (typeof window !== 'undefined') {
    const target = window.self === window.top ? window.opener : window.parent;

    console.log("In OAuthSendBack")
    const hash = window.location.hash;
    if (hash) {
      const token = window.location.hash.split('&')[0].split('=')[1];
      console.log("Auth Send Back Token" + token);
      target.postMessage(token, OAuthConfig.host);
    }
  }
};

export default OAuthSendBack;
