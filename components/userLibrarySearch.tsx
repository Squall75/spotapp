import { Box, Input } from "@chakra-ui/react";
import { useState } from "react";

const userLibrarySearch = ({followedArtists, setFollowedArtists, unfilteredArtists}) => {

  const [preFiltered, setPreFiltered] = useState(Object.assign({}, unfilteredArtists));

  let updatedSearchArtists = Object.assign({}, unfilteredArtists); // So we actually have a new object later for updating components

  const onSearch = (searchValue) => {
    // Check to see if this is the first time search is being used this session
    if (JSON.stringify(preFiltered) === '{}') {
      const deepCopy = JSON.parse(JSON.stringify(followedArtists));
      console.log("Setting Prefiltered results: " + JSON.stringify(deepCopy));
      setPreFiltered(deepCopy);
    }

    if (searchValue !== '') {
      const filteredResults = preFiltered?.artists.items.filter((artist) => {
        return Object.values(artist.name).join('').toLowerCase().includes(searchValue.toLowerCase())
      });
      updatedSearchArtists.artists.items = filteredResults;
      setFollowedArtists(updatedSearchArtists);

    } else {
      console.log("Setting followed back to original" + JSON.stringify(preFiltered));
      setFollowedArtists(JSON.parse(JSON.stringify(preFiltered)));
    }
  }
  return (
    <Box>
        <Input placeholder='Search' onChange={(e) => {onSearch(e.target.value)}}/>
    </Box>
  )
}

export default userLibrarySearch;
