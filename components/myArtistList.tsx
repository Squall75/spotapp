import { Box, Button, Text, VStack } from '@chakra-ui/react';

const MyArtistList = ({ followedArtists }) => {
  return (
    <Box marginLeft="25px" height="100%">
      <Text color="gray.600" fontSize="sm">Artists {followedArtists?.artists.items.length} A-Z </Text>
      <VStack spacing="-10px" align="baseline">
        {followedArtists?.artists.items.map((artist) => (
          <Button variant="unstyled" size="sm" color="gray.600" key={artist.id}>{artist.name} </Button>
        ))}
        ;
      </VStack>
    </Box>
  );
};

export default MyArtistList;
