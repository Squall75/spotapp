import { Box, Text } from '@chakra-ui/layout';
import { useEffect, useState } from 'react';
import AlbumList from './albumList';
import ArtistList from './artistList';
import WebPlayback from './WebPlayback';

const SpotifyLibrary = ({ user, api }) => {
  const [followedArtists, setFollowedArtists] = useState(null);
  const [spotifyAPI, setSpotifyAPI] = useState(api);
  const [viewArtists, setViewArtists] = useState(true);
  const [selectedArtistId, setSelectedArtistId] = useState(null);
  const [playerDeviceId, setPlayerDeviceId] = useState(null);

  useEffect(() => {
    const getArtists = async () => {
      console.log('Use Effect Library');
      console.log("Spotify API Token " + spotifyAPI.getAccessToken())
      const artists = await spotifyAPI.getMeFollowedArtists();
      console.log(JSON.stringify(artists));
      setFollowedArtists(artists);
    };
    getArtists().catch(console.error);
  }, [spotifyAPI]);

  return (
    <Box>
      <Text>User Library: {user.display_name}</Text>
      <WebPlayback token={api.getAccessToken()} setPlayerDeviceId={setPlayerDeviceId} />

      {viewArtists ?
        <ArtistList 
          followedArtists={followedArtists} 
          setViewArtists={setViewArtists}
          setSelectedArtistId={setSelectedArtistId}
        />
        :
        <AlbumList selectedArtistId={selectedArtistId} spotifyAPI={spotifyAPI} playerDeviceId={playerDeviceId}/>
      }
    </Box>
  );
};
export default SpotifyLibrary;
