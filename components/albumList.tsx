import { Box, Text } from '@chakra-ui/layout';
import { Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { DetailsHTMLAttributes, useEffect, useState } from 'react';
import AlbumDetails from './albumDetails';

const AlbumList = ({
  selectedArtistId,
  spotifyAPI,
  playerDeviceId,
  setViewArtists,
}) => {
  const [albums, setAlbums] = useState(null);
  const [details, setDetails] = useState(null);
  const [viewAlbum, setViewAlbum] = useState(false);

  useEffect(() => {
    const getArtistAlbum = async () => {
      console.log('Get Artist Album');
      console.log('Spotify API Token ' + spotifyAPI.getAccessToken());
      const listAlubms = await spotifyAPI.getArtistAlbum(selectedArtistId);
      console.log(JSON.stringify(listAlubms));
      setAlbums(listAlubms);
    };
    getArtistAlbum().catch(console.error);
  }, [selectedArtistId, spotifyAPI]);

  const handleAlbum = async (album?) => {
    console.log('Album Id ' + album.id);
    const details = await spotifyAPI.getAlbumInfo(album.id);
    console.log(JSON.stringify(details));
    setDetails(details);
    setViewAlbum(true);
  };

  const handlePlayAlbum = (album?) => {
    console.log('Search for artist id ' + album.uri);
    spotifyAPI.postPlayerPlayBack(playerDeviceId, album.uri);
  };

  const handleBackToArtist = () => {
    setViewArtists(true);
  };

  return (
    <Box>
      {viewAlbum ? (
        <AlbumDetails albumDetails={details} viewAlbum={setViewAlbum} />
      ) : (
        <Box>
          <Text onClick={() => handleBackToArtist()}> &lt;-- Artist</Text>
          <Text>Artist: {albums?.items[0].artists[0].name}</Text>
          <Table variant="unstyled">
            <Thead borderBottom="1px solid" borderColor="rgba(255,255,255,0.2">
              <Tr>
                <Th>Album Name</Th>
                <Th>Spotify ID</Th>
                <Th>Release Date</Th>
                <Th>Play</Th>
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
                  <Td onClick={() => handlePlayAlbum(albumDetails)}>
                    {' '}
                    &lt;&lt;Play&gt;&gt;
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}
    </Box>
  );
};

export default AlbumList;
