import { Box, Text} from '@chakra-ui/layout'
import { Button } from '@chakra-ui/react'
import SpotifyWebApi from '../lib/SpotifyApi';
import OAuthManager from '../lib/oauthManager';
import { useRef, useState } from 'react';
import SpotifyAuthForm from '../components/SpotifyAuthForm';
import SpotifyLibrary from '../components/spotifyLibrary';

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [api, setApi] = useState(null)

  const handleLoginClick = async () => {
    console.log("Logging into Spotify");
    const accessToken = await OAuthManager.obtainToken({
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
        'streaming',
      ],
    }).catch(function (error) {
      console.error('There was an error obtaining the token', error);
    });

    if (global['ga']) {
      global['ga']('send', 'event', 'spotify-dedup', 'user-logged-in');
    }

    const spotifyApi = new SpotifyWebApi();
    spotifyApi.setAccessToken(accessToken);
    setApi(spotifyApi);

    console.log("Access Token " + accessToken)

    try {
      const signedInUser = await spotifyApi.getMe();
      console.log(JSON.stringify(signedInUser));
      setUser(signedInUser);
      setIsLoggedIn(true);
    } catch(e) {
      console.error(e);
    }
  };

  return (
    <Box>
      {isLoggedIn 
      ? <SpotifyLibrary user={user} api={api} />
      : <SpotifyAuthForm handleLoginClick={handleLoginClick}/>
      }
    </Box>
  )
}

export default Home
