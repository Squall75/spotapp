import { Box, Text } from '@chakra-ui/layout';
import { Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { formatTime } from '../lib/formatter';

const AlbumDetails = ({ albumDetails, viewAlbum }) => {
  const handleBackToAlbumList = () => {
    viewAlbum(false);
  };

  return (
    <Box>
      <Text onClick={() => handleBackToAlbumList()}> &lt;-- Albums</Text>
      <Text>Album {albumDetails.name}</Text>
      <Table variant="unstyled">
        <Thead borderBottom="1px solid" borderColor="rgba(255,255,255,0.2">
          <Tr>
            <Th>Track #</Th>
            <Th>Song</Th>
            <Th>Duration</Th>
          </Tr>
        </Thead>
        <Tbody>
          {albumDetails?.tracks.items.map((track) => (
            <Tr key={track.id}>
              <Td>{track.track_number}</Td>
              <Td>{track.name}</Td>
              <Td>{formatTime(track.duration_ms)}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default AlbumDetails;
