import { Box, Button, HStack } from "@chakra-ui/react";

const minorNavComponent = () => {
  return (
    <Box
      width="100%"
      height="100%"
      paddingX="15px"
      color="gray"
      >
        <HStack spacing="10px">
          <Button variant="unstyled" fontWeight="bold" color="gray.900" fontSize="x-small">MUSIC</Button>
          <Button variant="unstyled" color="gray.600" fontSize="x-small">VIDEOS</Button>
          <Button variant="unstyled" color="gray.600" fontSize="x-small">PICTURES</Button>
          <Button variant="unstyled" color="gray.600" fontSize="x-small">PODCASTS</Button>
        </HStack>
    </Box>
  )
}

export default minorNavComponent;
