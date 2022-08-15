import { Box, Button, Text, VStack } from '@chakra-ui/react';

const mySongList = ({ songs, selectedSong, playerDeviceId, spotifyAPI }) => {

  const playSong = (song) => {
    spotifyAPI.postPlayerPlayBack(playerDeviceId, songs.uri, song.uri);
  };

  return (
    <Box marginLeft="25px">
      <Text fontWeight="bold" color="gray.900" fontSize="sm">
        {songs?.tracks.items.length} Songs By Album
      </Text>
      <VStack spacing="-5px" align="baseline">
        {songs?.tracks.items.map((song) => (
          <Button
            variant="unstyled"
            size="sm"
            color={selectedSong?.id === song.id ? 'gray.900' : 'gray.600'}
            key={song.id}
            onClick={() => playSong(song)}
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
