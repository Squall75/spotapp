import { Box, Button, HStack } from "@chakra-ui/react";

const majorNavComponent = () => {
  return (
    <Box
      width="100%"
      height="100%"
      paddingX="20px"
      >
        <HStack spacing="24px">
          <Button variant="unstyled">quickplay</Button>
          <Button variant="unstyled" color="gray.600" fontWeight="bold">collection</Button>
        </HStack>
    </Box>
  )
}

export default majorNavComponent;
