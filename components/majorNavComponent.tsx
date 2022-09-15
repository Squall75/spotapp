import { Box, Button, HStack } from "@chakra-ui/react";

const majorNavComponent = () => {
  return (
    <Box
      width="100%"
      height="100%"
      paddingX="20px"
      >
        <HStack fontSize="md" spacing="24px">
          <Button fontSize="xl" variant="unstyled" color="gray.600">quickplay</Button>
          <Button fontSize="xl" variant="unstyled" color="gray.900" fontWeight="bold">collection</Button>
          <Button fontSize="xl" variant="unstyled" color="gray.600">marketplace</Button>
        </HStack>
    </Box>
  )
}

export default majorNavComponent;
