import OAuthConfig from './oauthConfig';
import fetch from './customFetch';
import parseAPIResponse from './ParseAPIResponse';

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

async function obtainToken(authCode: string) {
   // Use the Code value to Call Authorization to get Token and Refresh Token
   const dataToBeSent = {
    code: authCode,
    redirect_uri: OAuthConfig.redirectUri,
    grant_type: 'authorization_code',
  };
  const res = await fetch(
    `https://accounts.spotify.com/api/token`,
    {
      method: 'POST',
      headers: {
        'Content-Type':'application/x-www-form-urlencoded',
        Authorization: `Basic ` + Buffer.from(OAuthConfig.clientId + ":" + OAuthConfig.clientSecret).toString('base64'),
      },
      body: new URLSearchParams(dataToBeSent),
    }
  );

  return parseAPIResponse(res);
}

async function updateToken(refreshToken: string) {
   const dataToBeSent = {
    grant_type: 'refresh_token',
    refresh_token: refreshToken
  };
  const res = await fetch(
    `https://accounts.spotify.com/api/token`,
    {
      method: 'POST',
      headers: {
        'Content-Type':'application/x-www-form-urlencoded',
        Authorization: `Basic ` + Buffer.from(OAuthConfig.clientId + ":" + OAuthConfig.clientSecret).toString('base64'),
      },
      body: new URLSearchParams(dataToBeSent),
    }
  );

  return parseAPIResponse(res);
}
export default { authorizationCode, obtainToken, updateToken };
