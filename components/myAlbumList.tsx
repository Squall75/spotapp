import { Box, Button, HStack, Link, Text, VStack } from '@chakra-ui/react';
import Image from 'next/image';

const myAlbumList = ({ albums, selectedAlbum, setSelectedAlbum }) => {
  const getUrlImageOfSize = (images, imageSize: number) => {
    let url;

    for (let i = 0; i < images?.length; i++) {
      if (imageSize === images[i].height) {
        url = images[i].url;
      }
    }
    return url;
  };

  return (
    <Box marginLeft="25px">
      <Text color="gray.600" fontSize="sm">
        Albums
      </Text>
      <HStack spacing="5px" wrap="wrap">
        {albums?.items.map((albumDetails) => {
          const imageUrl = getUrlImageOfSize(albumDetails.images, 64);

          if (imageUrl) {
            return (
              <VStack
                w="128px"
                h="128px"
                onClick={() => setSelectedAlbum(albumDetails)}
              >
                <Image src={imageUrl} width="64px" height="64px" />
                <Link
                  color={
                    selectedAlbum?.id === albumDetails.id
                      ? 'gray.900'
                      : 'gray.600'
                  }
                  fontSize="x-small"
                  key={albumDetails.id}
                  width="64px"
                  overflow="hidden"
                  whiteSpace="nowrap"
                  textOverflow="ellipsis"
                >
                  {albumDetails.name}
                </Link>
              </VStack>
            );
          }

          // No Ablum artwork, don't add to list
          return;
        })}
        ;
      </HStack>
    </Box>
  );
};
export default myAlbumList;
