import { Box, HStack, Link, Text, VStack } from '@chakra-ui/react';
import Image from 'next/image';
import { getUrlImageOfSize } from '../lib/helperFunctions';

const myAlbumList = ({ albums, selectedAlbum, setSelectedAlbum }) => {

  return (
    <Box marginLeft="25px">
      <Text fontWeight="bold" color="gray.900" fontSize="sm">
        Albums
      </Text>
      <HStack spacing="5px" wrap="wrap" marginTop="20px">
        {albums?.items.map((albumDetails) => {
          const imageUrl = getUrlImageOfSize(albumDetails.images, 300);

          if (imageUrl) {
            return (
              <VStack
                w="128px"
                h="128px"
                onClick={() => setSelectedAlbum(albumDetails)}
                key={albumDetails.id}
              >
                <Image src={imageUrl} width="96px" height="96px" />
                <Link
                  color={
                    selectedAlbum?.id === albumDetails.id
                      ? 'gray.900'
                      : 'gray.600'
                  }
                  fontSize="small"
                  key={albumDetails.id}
                  width="96px"
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
