import { Box, Text } from '@chakra-ui/layout';
import { Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

const AlbumList = ({ selectedArtistId, spotifyAPI, playerDeviceId }) => {

  const [albums, setAlbums] = useState(null);

  useEffect(() => {
    const getArtistAlbum = async () => {
      console.log('Get Artist Album');
      console.log("Spotify API Token " + spotifyAPI.getAccessToken())
      const listAlubms = await spotifyAPI.getArtistAlbum(selectedArtistId);
      console.log(JSON.stringify(listAlubms));
      setAlbums(listAlubms);
    };
    getArtistAlbum().catch(console.error);
  }, [selectedArtistId, spotifyAPI]);


  const handleAlbum = (album?) => {
    console.log("Search for artist id " + album.uri);
    spotifyAPI.postPlayerPlayBack(playerDeviceId, album.uri);
  }

  return (
    <Box>
      <Text>Artist: {albums?.items[0].artists[0].name}</Text>
      <Table variant="unstyled">
        <Thead borderBottom="1px solid" borderColor="rgba(255,255,255,0.2">
          <Tr>
            <Th>Album Name</Th>
            <Th>Spotify ID</Th>
            <Th>Release Date</Th>
          </Tr>
        </Thead>
        <Tbody>
          {albums?.items.map((albumDetails) => (
            <Tr 
              key={albumDetails.id}
              onClick={() => handleAlbum(albumDetails)}
            >
              <Td>{albumDetails.name}</Td>
              <Td>{albumDetails.id}</Td>
              <Td>{albumDetails.release_date}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default AlbumList;