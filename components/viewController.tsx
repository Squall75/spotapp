import {Box} from "@chakra-ui/layout";
import { useState } from 'react';
import CollectionLayout from "./CollectionLayout";
import MarketPlaceLayout from "./marketPlaceLayout";

const ViewController = ({api}) => {

  const [viewCollection, setViewCollection] = useState(true);
 
  return (
    <Box>
      {viewCollection ? (
        <CollectionLayout api={api} />
      ) : (
        <MarketPlaceLayout /> 
      )
      }
    </Box>
  );
};

export default ViewController;
