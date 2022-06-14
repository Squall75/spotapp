import { Box, Button, Text, VStack } from '@chakra-ui/react';

const mySongList = ({ songs, selectedSong }) => {
  return (
    <Box marginLeft="25px">
      <Text color="gray.600" fontSize="sm">
        {songs?.tracks.items.length} Songs By Album
      </Text>
      <VStack spacing="-10px" align="baseline">
        {songs?.tracks.items.map((song) => (
          <Button
            variant="unstyled"
            size="sm"
            color={selectedSong?.id === song.id ? 'gray.900' : 'gray.600'}
            key={song.id}
          >
            {song.name}
          </Button>
        ))}
        ;
      </VStack>
    </Box>
  );
};
export default mySongList;
