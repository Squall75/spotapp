import {
  ButtonGroup,
  Box,
  IconButton,
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderTrack,
  RangeSliderThumb,
  Center,
  Flex,
  Text,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react';
import {
  MdShuffle,
  MdSkipNext,
  MdSkipPrevious,
  MdOutlinePlayCircleFilled,
  MdOutlinePauseCircleFilled,
  MdOutlineRepeat,
  MdRepeat,
} from 'react-icons/md'

const track = {
  name: '',
  album: {
    images: [{ url: '' }],
  },
  artists: [{ name: '' }],
};

const Player = (props) => {

  const [player, setPlayer] = useState(undefined);
  const [is_paused, setPaused] = useState(false);
  const [is_active, setActive] = useState(false);
  const [current_track, setTrack] = useState(undefined);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      console.log(`Token Web: ${props.token}`);

      if (!player)
      {
        const player = new window.Spotify.Player({
          name: 'Web Playback SDK',
          getOAuthToken: (cb) => {
            cb(props.token);
          },
          volume: 0.5,
        });

        setPlayer(player);

        player.addListener('ready', ({ device_id }) => {
          console.log('Ready with Device ID', device_id);
          {props.setPlayerDeviceId(device_id)}
        });

        player.addListener('not_ready', ({ device_id }) => {
          console.log('Device ID has gone offline', device_id);
        });

        player.connect();

        player.addListener('player_state_changed', (state) => {
          if (!state) {
            return;
          }

          setTrack(state.track_window.current_track);
          props.setSelectedSong(state.track_window.current_track);
          setPaused(state.paused);

          console.log("Change state");
          console.log(state.track_window.current_track.id);

          player.getCurrentState().then((state) => {
            !state ? setActive(false) : setActive(true);
          });
        });
      }
    };
  }, [props]);

  return (
    <Box>
      <Box>
        {current_track?.artists[0].name} - {current_track?.name}
      </Box>
      <Center color="gray.600">
        <ButtonGroup>
          <IconButton
            outline="none"
            variant="link"
            aria-label="shuffle"
            fontSize="24px"
            color='gray.600'
            icon={<MdShuffle />}
          />
          <IconButton
            outline="none"
            variant="link"
            aria-label="skip"
            fontSize="24px"
            icon={<MdSkipPrevious />}
            onClick={() => player.previousTrack()}
          />

          {is_paused ? (
            <IconButton
              outline="none"
              variant="link"
              aria-label="play"
              fontSize="40px"
              icon={<MdOutlinePlayCircleFilled />}
              onClick={() => player.togglePlay()}
            />
          ) : (
            <IconButton
              outline="none"
              variant="link"
              aria-label="pause"
              fontSize="40px"
              icon={< MdOutlinePauseCircleFilled/>}
              onClick={() => player.togglePlay()}
            />
          )}
          <IconButton
            outline="none"
            variant="link"
            aria-label="next"
            fontSize="24px"
            icon={<MdSkipNext />}
            onClick={() => player.nextTrack()}
          />
          <IconButton
            outline="none"
            variant="link"
            aria-label="repeat"
            fontSize="24px"
            color='gray.600'
            icon={<MdOutlineRepeat />}
          />
        </ButtonGroup>
      </Center>
    </Box>
  )
}

export default Player;
