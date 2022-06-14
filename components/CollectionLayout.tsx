import { Box, HStack } from "@chakra-ui/layout";
import { useEffect, useState } from "react";
import MajorNavComponent from "./majorNavComponent";
import MinorNavComponent from "./minorNavComponent";
import MyAlbumList from "./myAlbumList";
import MyArtistList from "./myArtistList";
import MySongList from "./mySongList";

const CollectionLayout = ({api}) => {

  const [spotifyAPI, setSpotifyAPI] = useState(api);
  const [followedArtists, setFollowedArtists] = useState(null);
  const [selectedArtists, setSelectedArtists] = useState(null);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [selectedSong, setSelectedSong] = useState(null);
  const [artistAlubms, setArtistAlbums] = useState(null);
  const [albumSongs, setAlbumSongs] = useState(null);

  useEffect(() => {
    const getArtists = async () => {
      console.log('Use Effect Library');
      console.log("Spotify API Token " + spotifyAPI.getAccessToken())
      const artists = await spotifyAPI.getMeFollowedArtists();
      console.log(JSON.stringify(artists));
      setFollowedArtists(artists);

      // Set current Selected Artist as first from the list of artist
      setSelectedArtists(artists?.artists.items[0]);
    };
    getArtists().catch(console.error);
  }, [spotifyAPI]);

  useEffect(() => {
    const getSelectedArtistAlbums = async () => {
      const currentAlbums = await spotifyAPI.getArtistAlbum(selectedArtists.id);
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
        <Box position="absolute" width="100%">
          <MajorNavComponent />
        </Box>
        <Box position="absolute" top="20px" width="100%" left="0">
          <MinorNavComponent />
        </Box>
      </Box>
      <HStack position="absolute" top="100px" alignItems="start">
        <Box width="250px" left="0">
          <MyArtistList followedArtists={followedArtists}/>
        </Box>
        <Box marginLeft="250px">
          <MyAlbumList albums={artistAlubms} selectedAlbum={selectedAlbum} setSelectedAlbum={setSelectedAlbum}/>
        </Box>
        <Box marginLeft="100px">
          <MySongList songs={albumSongs} selectedSong={selectedSong}/>
        </Box>
      </HStack>
    </Box>
  );
};

export default CollectionLayout;