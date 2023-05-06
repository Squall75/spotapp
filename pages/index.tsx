import { Box, Text } from '@chakra-ui/layout';
import SpotifyWebApi from '../lib/SpotifyApi';
import oAuthManager from '../lib/oauthManager';
import { useRef, useState } from 'react';
import SpotifyAuthForm from '../components/SpotifyAuthForm';
import ViewController from '../components/viewController';

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState();
  const [api, setApi] = useState();

  const handleLoginClick = async () => {
    const code = await oAuthManager.authorizationCode({
      scopes: [
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
    console.log("Obtain token call");

    const authToken = await oAuthManager.obtainToken(code);

    const spotifyApi = new SpotifyWebApi();
    spotifyApi.setAccessToken(authToken);
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
        <ViewController api={api} />
      ) : (
        <SpotifyAuthForm handleLoginClick={handleLoginClick} />
      )}
    </Box>
  );
};

export default Home;
