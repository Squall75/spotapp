import { Box } from '@chakra-ui/layout';
import { Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';

const ArtistList = ({ followedArtists, setViewArtists, setSelectedArtistId}) => {

  const handleArtists = (searchArtist?) => {
    console.log("Search for artist id " + searchArtist.id);
    setViewArtists(false);
    setSelectedArtistId(searchArtist.id);
  }

  return (
    <Box>
      <Table variant="unstyled">
        <Thead borderBottom="1px solid" borderColor="rgba(255,255,255,0.2">
          <Tr>
            <Th>Artist Name</Th>
            <Th>Spotify ID</Th>
          </Tr>
        </Thead>
        <Tbody>
          {followedArtists?.artists.items.map((artist) => (
            <Tr 
              key={artist.id}
              onClick={() => handleArtists(artist)}
            >
              <Td>{artist.name}</Td>
              <Td>{artist.id}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default ArtistList;