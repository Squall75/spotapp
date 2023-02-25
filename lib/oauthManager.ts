import OAuthConfig from './oauthConfig';
import fetch from './customFetch';
import parseAPIResponse from './ParseAPIResponse';

// Map for localStorage keys
const LOCALSTORAGE_KEYS = {
  accessToken: 'spotify_access_token',
  refreshToken: 'spotify_refresh_token',
  expireTime: 'spotify_token_expire_time',
  timestamp: 'spotify_token_timestamp',
};

function toQueryString(obj: { [key: string]: string }) {
  const parts = [];
  for (const i in obj) {
    if (obj.hasOwnProperty(i)) {
      parts.push(`${encodeURIComponent(i)}=${encodeURIComponent(obj[i])}`);
    }
  }
  return parts.join('&');
}

function authorizationCode(options?: { scopes: Array<string> }) {
  console.log("Get Auth Code")
  const promise = new Promise((resolve, reject) => {
    let authWindow = null;
    let pollAuthWindowClosed = null;

    function receiveMessage(event: { origin: string; data: unknown }) {
      clearInterval(pollAuthWindowClosed);
      if (event.origin !== OAuthConfig.host) {
        console.log("Reject happening here")
        reject({
          message: `Origin ${event.origin} does not match ${OAuthConfig.host}`,
        });
        return;
      }
      if (authWindow !== null) {
        authWindow.close();
        authWindow = null;
      }

      window.removeEventListener('message', receiveMessage, false);

      // todo: manage case when the user rejects the oauth
      // or the oauth fails to obtain a token
      resolve(event.data);
    }

    window.addEventListener('message', receiveMessage, false);

    const width = 400;
    const height = 600;
    const left = screen.width / 2 - width / 2;
    const top = screen.height / 2 - height / 2;

    type Parameters = {
      client_id: string;
      redirect_uri: string;
      response_type: string;
      scope?: string;
    };

    const params: Parameters = {
      client_id: OAuthConfig.clientId,
      redirect_uri: OAuthConfig.redirectUri,
      response_type: 'code',
    };

    if (options.scopes) {
      params.scope = options.scopes.join(' ');
    }

    authWindow = window.open(
      `https://accounts.spotify.com/authorize?${toQueryString(params)}`,
      'Spotify',
      `menubar=no,location=no,resizable=no,scrollbars=no,status=no, width=${width}, height=${height}, top=${top}, left=${left}`
    );

    pollAuthWindowClosed = setInterval(() => {
      if (authWindow !== null) {
        if (authWindow.closed) {
          clearInterval(pollAuthWindowClosed);
          reject({ message: 'access_denied' });
          console.log("Poll Auth Rejected");
        }
      }
    }, 1000);
  });

  return promise;
}

/**
 * Checks if the amount of time that has elapsed between the timestamp in localStorage
 * and now is greater than the expiration time of 3600 seconds (1 hour).
 * @returns {boolean} Whether or not the access token in localStorage has expired
 */
 const hasTokenExpired = () => {
   const accessToken = window.localStorage.getItem(LOCALSTORAGE_KEYS.accessToken);
   const timestamp = window.localStorage.getItem(LOCALSTORAGE_KEYS.timestamp);
   const expireTime = window.localStorage.getItem(LOCALSTORAGE_KEYS.expireTime);

   if (!accessToken || !timestamp) {
    return false;
  }
  const millisecondsElapsed = Date.now() - Number(timestamp);
  return (millisecondsElapsed / 1000) > Number(expireTime);
};

async function fetchSpotifyToken(authCode: string): Promise<Response> {
  // Use the Code value to Call Authorization to get Token and Refresh Token
  const dataToBeSent = {
   code: authCode,
   redirect_uri: OAuthConfig.redirectUri,
   grant_type: 'authorization_code',
 };
  const res = await fetch(`https://accounts.spotify.com/api/token`, {
     method: 'POST',
     headers: {
       'Content-Type':'application/x-www-form-urlencoded',
       Authorization: `Basic ` + Buffer.from(OAuthConfig.clientId + ":" + OAuthConfig.clientSecret).toString('base64'),
     },
     body: new URLSearchParams(dataToBeSent),
   }
 );

 return res;
}

async function updateToken(refreshToken: string): Promise<Response> {
  const dataToBeSent = {
   grant_type: 'refresh_token',
   refresh_token: refreshToken
 };
 const res = await fetch(`https://accounts.spotify.com/api/token`, {
     method: 'POST',
     headers: {
       'Content-Type':'application/x-www-form-urlencoded',
     Authorization:
       `Basic ` +
       Buffer.from(
         OAuthConfig.clientId + ':' + OAuthConfig.clientSecret
       ).toString('base64'),
     },
     body: new URLSearchParams(dataToBeSent),
 });

 return parseAPIResponse(res);
}

/*
 * Handles Logic for retrieving Spotify authorization token and refresh token. 
 * This will either be the token from local storage or pulled directly from Spotify.
 * @retruns Object
 */
async function obtainToken(authCode: string) {
  if (typeof window !== 'undefined') {

     // Check to see if Local storage already has a valid token before fetching new
    if (window.localStorage.getItem(LOCALSTORAGE_KEYS.accessToken) && !hasTokenExpired()) {
      return window.localStorage.getItem(LOCALSTORAGE_KEYS.accessToken);
    }

    let res: Response;

    // Check if refresh token should be used.
    if (hasTokenExpired() && window.localStorage.getItem(LOCALSTORAGE_KEYS.refreshToken)){
      res = await updateToken(
        window.localStorage.getItem(LOCALSTORAGE_KEYS.refreshToken)
      );
    } else {
      res = await fetchSpotifyToken(authCode);
    }

    const parsedReponse = await parseAPIResponse(res);

    window.localStorage.setItem(
      LOCALSTORAGE_KEYS.accessToken,
      parsedReponse.access_token
    );
    window.localStorage.setItem(LOCALSTORAGE_KEYS.timestamp, Date.now());
    window.localStorage.setItem(
      LOCALSTORAGE_KEYS.expireTime,
      parsedReponse.expires_in
    );

    window.localStorage.setItem(
      LOCALSTORAGE_KEYS.refreshToken,
      parsedReponse.refresh_token
    );
    return parsedReponse.access_token;
  }
  return null;
}


export default { authorizationCode, obtainToken, updateToken };
