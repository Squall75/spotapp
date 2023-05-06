import OAuthConfig from './OauthConfig';

const OAuthSendBack = async () => {
  if (typeof window !== 'undefined') {
    const target = window.self === window.top ? window.opener : window.parent;

    console.log("In OAuthSendBack")
    const searchQuery = window.location.search;
    if (searchQuery) {

      // Get the code from Spotify
      const code = window.location.search.split('?')[1].split('=')[1];

      // Noty listener that we got the code
      target.postMessage(code, OAuthConfig.host);
    }
  }
};

export default OAuthSendBack;
