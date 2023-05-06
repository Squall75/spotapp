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
    return Promise.resolve();
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
