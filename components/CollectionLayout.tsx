import { Box, Flex, HStack } from "@chakra-ui/layout";
import { useEffect, useState } from "react";
import MajorNavComponent from "./majorNavComponent";
import MinorNavComponent from "./minorNavComponent";
import MyAlbumList from "./myAlbumList";
import MyArtistList from "./myArtistList";
import MySongList from "./mySongList";
import Player from "./player";
import UserLibrarySearch from "./userLibrarySearch";

const CollectionLayout = ({api}) => {

  const [spotifyAPI, setSpotifyAPI] = useState(api);
  const [followedArtists, setFollowedArtists] = useState(null);
  const [unfilteredArtists, setUnfilteredArtists] = useState(null);
  const [selectedArtists, setSelectedArtists] = useState(null);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [selectedSong, setSelectedSong] = useState(null);
  const [artistAlubms, setArtistAlbums] = useState(null);
  const [albumSongs, setAlbumSongs] = useState(null);

  const [playerDeviceId, setPlayerDeviceId] = useState(null);

  useEffect(() => {
    const getArtists = async () => {
      console.log('Use Effect Library');
      console.log("Spotify API Token " + spotifyAPI.getAccessToken())
      const artists = await spotifyAPI.getAllFollowedArtists();
      console.log(JSON.stringify(artists));
      setFollowedArtists(artists);
      setUnfilteredArtists(artists);

      // Set current Selected Artist as first from the list of artist
      setSelectedArtists(artists?.artists.items[0]);
    };
    getArtists().catch(console.error);
  }, [spotifyAPI]);

  useEffect(() => {
    const getSelectedArtistAlbums = async () => {
      const currentAlbums = await spotifyAPI.getAllArtistAlbums(selectedArtists?.id);
      console.log("Current Albums " + JSON.stringify(currentAlbums))
      setArtistAlbums(currentAlbums);

      setSelectedAlbum(currentAlbums?.items[0]);
    };
    getSelectedArtistAlbums().catch(console.error);
  }, [spotifyAPI, selectedArtists]);

  useEffect(() => {
    const getSelectedSongs = async () => {
      const albumDetails = await spotifyAPI.getAlbumInfo(selectedAlbum.id);
      console.log("Tracks" + JSON.stringify(albumDetails))
      setAlbumSongs(albumDetails);

      setSelectedSong(albumDetails?.tracks.items[0]);
    };
    getSelectedSongs().catch(console.error);
  }, [spotifyAPI, selectedAlbum]);

  return (
    <Box width="100vw" height="100vh">
      <Box
        width="100%"
        height="50px"
        position="absolute"
        top="0px"
        left="0px"
        right="0px"
      >
        <Box position="absolute" width="70%">
          <MajorNavComponent />
        </Box>
        <Box position="absolute" top="20px" width="70%" left="0">
          <MinorNavComponent />
        </Box>
        <Box position="absolute" right="0" top="10px" width="30%">
          <UserLibrarySearch followedArtists={followedArtists} setFollowedArtists={setFollowedArtists} unfilteredArtists={unfilteredArtists}/>
        </Box>
      </Box>
      <HStack
        position="absolute"
        top="100px"
        alignItems="start"
        height="calc(100vh - 200px)"
        marginBottom="100px"
        bg="gray.400"
      >
        <Box width="calc(100vw/4)" left="0" height="calc(100vh - 200px)">
          <MyArtistList followedArtists={followedArtists} selectedArtists={selectedArtists} setSelectedArtists={setSelectedArtists}/>
        </Box>
        <Box marginLeft="250px" bg="gray.100" height="calc(100vh - 200px)" width="calc(100vw/2)" overflowY="scroll">
          <MyAlbumList albums={artistAlubms} selectedAlbum={selectedAlbum} setSelectedAlbum={setSelectedAlbum}/>
        </Box>
        <Box marginLeft="100px" height="calc(100vh - 200px)" width="calc(100vw/4)" overflowY="scroll">
          <MySongList songs={albumSongs} selectedSong={selectedSong} playerDeviceId={playerDeviceId} spotifyAPI={spotifyAPI}/>
        </Box>
      </HStack>
      <Box position="absolute" left="0" bottom="0">
        <Flex align="center">
          <Box height="100px" width="100vw" padding="10px">
            <Player token={spotifyAPI.getAccessToken()} setPlayerDeviceId={setPlayerDeviceId} setSelectedSong={setSelectedSong}/>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
};

export default CollectionLayout;