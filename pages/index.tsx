import { Box } from '@chakra-ui/layout';
import { useState } from 'react';
import SpotifyWebApi from '../lib/SpotifyApi';
import oAuthManager from '../lib/oauthManager';
import SpotifyAuthForm from '../components/SpotifyAuthForm';
import ViewController from '../components/viewController';

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [api, setApi] = useState<SpotifyWebApi>(undefined);

  const handleLoginClick = async () => {
    const code = await oAuthManager
      .authorizationCode({
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
      })
      .catch(function catchError(error) {
        console.error('There was an error obtaining the token', error);
      });

    const authToken = await oAuthManager.obtainToken(code);

    const spotifyApi = new SpotifyWebApi();
    spotifyApi.setAccessToken(authToken);
    setApi(spotifyApi);

    try {
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
