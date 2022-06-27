import { Box, Button, Text, VStack } from '@chakra-ui/react';

const mySongList = ({ songs, selectedSong, playerDeviceId, spotifyAPI }) => {

  const playSong = (song) => {
    console.log('Play for song ' + song.uri + ' song track ' + song.track_number);
    console.log('using playerdevice id' + playerDeviceId);
    spotifyAPI.postPlayerPlayBack(playerDeviceId, songs.uri, song.uri);
  };

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
