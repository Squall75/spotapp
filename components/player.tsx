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
  useInterval,
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
} from 'react-icons/md';
import Image from 'next/image';
import { getUrlImageOfSize } from '../lib/helperFunctions';
import { formatTime } from '../lib/formatter';

const track = {
  name: '',
  album: {
    images: [{ url: '' }],
  },
  artists: [{ name: '' }],
};

const Player = (props) => {

  const [player, setPlayer] = useState(undefined);
  const [is_paused, setPaused] = useState(true);
  const [is_active, setActive] = useState(false);
  const [current_track, setTrack] = useState(undefined);
  const [seek, setSeek] = useState(0.0);
  const [duration, setDuration] = useState(0.0);

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

          setSeek(state.position);
          setDuration(state.duration);

          console.log("Change state");

          player.getCurrentState().then((state) => {
            !state ? setActive(false) : setActive(true);
          });
        });
      }
    };
  }, [props]);

  /*
   * Create an interval for updating current playback position.
  */ 
  let position = 0;
  useInterval(() => {
    position = seek;
    setSeek(position += is_paused ? 0 : 300);
  }, 300);

  const imageUrl = getUrlImageOfSize(current_track?.album.images, 64);


  return (
    <Flex>
      <Flex width="35%" justifyContent="flex-end" paddingRight="30px">
       {imageUrl ? <Image src={imageUrl} width="64px" height="64px" /> : null}
      </Flex>
      <Box width="65%">
        <Flex justifyContent="left">
          {current_track?.artists[0].name} - {current_track?.name}
        </Flex>
        <Box color="gray.600">
          <Flex justify="center" align="center">
            <Flex width="75%">
              <Box width="4%" display="flex" justifyContent="flex-end" paddingRight="10px">
                <Text fontSize="xs">{formatTime(seek)}</Text>
              </Box>
              <Box width="60%">
                <RangeSlider
                  aria-label={['min', 'max']}
                  step={0.1}
                  min={0}
                  max={duration ? (duration.toFixed(2) as unknown as number) : 0}
                  id="player-range"
                  value={[seek]
                  }
                  >
                  <RangeSliderTrack bg="gray.800">
                    <RangeSliderFilledTrack bg="gray.600" />
                  </RangeSliderTrack>
                  <RangeSliderThumb index={0} />
                </RangeSlider>
              </Box>
              <Box width="20%" display="flex" justifyContent="flex-start" paddingLeft="10px">
                <Text fontSize="xs">{formatTime(duration)}</Text>
              </Box>
            </Flex>
            <Box width="25%">
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
                    onClick={() => {
                        player.togglePlay(); 
                        console.log("Pause Player Clicked");
                        }
                    }
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
            </Box>
          </Flex>
        </Box>
      </Box>
    </Flex>
  )
}

export default Player;
