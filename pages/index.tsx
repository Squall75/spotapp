import { Box, Text } from '@chakra-ui/layout';
import SpotifyWebApi from '../lib/SpotifyApi';
import OAuthManager from '../lib/oauthManager';
import { useRef, useState } from 'react';
import SpotifyAuthForm from '../components/SpotifyAuthForm';
import CollectionLayout from '../components/CollectionLayout';

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [api, setApi] = useState(null);

  const handleLoginClick = async () => {
    const code = await OAuthManager.authorizationCode({
      scopes: [
        /*
            the permission for reading public playlists is granted
            automatically when obtaining an access token through
            the user login form
            */
        'playlist-read-private',
        'playlist-read-collaborative',
        'playlist-modify-public',
        'playlist-modify-private',
        'user-library-read',
        'user-library-modify',
        'user-follow-read',
        'streaming',
      ],
    }).catch(function (error) {
      console.error('There was an error obtaining the token', error);
    });

    if (global['ga']) {
      global['ga']('send', 'event', 'spotify-dedup', 'user-logged-in');
    }

    const authToken = await OAuthManager.obtainToken(code);

    const spotifyApi = new SpotifyWebApi();
    spotifyApi.setAccessToken(authToken.access_token);
    setApi(spotifyApi);

    try {
      const signedInUser = await spotifyApi.getMe();
      setUser(signedInUser);
      setIsLoggedIn(true);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Box>
      {isLoggedIn ? (
        <CollectionLayout api={api} />
      ) : (
        <SpotifyAuthForm handleLoginClick={handleLoginClick} />
      )}
    </Box>
  );
};

export default Home;
