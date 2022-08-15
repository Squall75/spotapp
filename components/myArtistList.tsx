import { Box, Button, Text, VStack } from '@chakra-ui/react';

const MyArtistList = ({ followedArtists, selectedArtists, setSelectedArtists }) => {
  return (
    <Box marginLeft="25px" height="100%">
      <Text fontWeight="bold" color="gray.900" fontSize="sm">Artists {followedArtists?.artists.items.length} A-Z </Text>
      <VStack spacing="5px" height="95%" align="baseline" overflowY="scroll" marginTop="20px">
        {followedArtists?.artists.items.map((artist) => (
          <Button
            variant="unstyled"
            size="sm"
            color={selectedArtists?.id === artist.id ? 'gray.900' : 'gray.600'}
            key={artist.id}
            height="32px"
            onClick={() => setSelectedArtists(artist)}
          >
            {artist.name}{' '}
          </Button>
        ))}
        ;
      </VStack>
    </Box>
  );
};
export default MyArtistList;
