import {Box, Text} from '@chakra-ui/layout'
import { Button } from '@chakra-ui/react'

const SpotifyAuthForm = ({handleLoginClick}) => {
    return (
        <Box>
            <Text>Authenticate with Spotify </Text>
            <Button colorScheme='whatsapp' size='lg' onClick={handleLoginClick}>Spotify Auth</Button>
        </Box>
    )
}
export default SpotifyAuthForm