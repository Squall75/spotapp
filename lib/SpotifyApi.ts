import _ from 'lodash';
import fetch from './customFetch';
export type SpotifyArtistType = {
  id: string;
  name: string;
};

export type SpotifyTrackType = {
  artists: Array<SpotifyArtistType>;
  duration_ms: number;
  id: string;
  linked_from: SpotifyTrackType;
  name: string;
  uri: string;
};

export type SpotifyPlaylistType = {
  collaborative: boolean;
  id: string;
  images?: Array<{ url: string }>;
  name: string;
  owner: SpotifyUserType;
  snapshot_id?: string;
  tracks: {
    href: string;
  };
};

export type SpotifyPlaylistTrackType = {
  added_at: string;
  added_by: SpotifyUserType;
  is_local: boolean;
  track: SpotifyTrackType | null;
};

export type SpotifySavedTrackType = {
  added_at: string;
  track: SpotifyTrackType | null;
};

export type SpotifyUserType = {
  display_name?: string;
  href: string;
  id: string;
  type: 'user';
  uri: string;
};

const apiPrefix = 'https://api.spotify.com/v1';

function NetworkException(message: string, status: number) {
  this.message = message;
  this.status = status;
  this.name = 'NetworkException';
}

function ServerException(json: Object, status: number) {
  this.message = 'There was a Server Exception';
  this.json = json;
  this.status = status;
  this.name = 'ServerException';
}

function ApplicationException(json: Object, status: number) {
  this.message = 'There was an Application Exception';
  this.json = json;
  this.status = status;
  this.name = 'ApplicationException';
}

function InvalidJSONException(body: string, status: number) {
  this.message = 'There was an Invalid JSON Exception';
  this.body = body;
  this.status = status;
  this.name = 'InvalidJSONException';
}

const parseAPIResponse = (response: Response): Object =>
  new Promise((resolve) => resolve(response.text()))
    .catch((err) => {
      throw new NetworkException(err.message, response.status);
    })
    .then((responseBody: string) => {
      let parsedJSON: Object = null;
      try {
        parsedJSON = responseBody === '' ? null : JSON.parse(responseBody);
      } catch (e) {
        // We should never get these unless response is mangled
        // Or API is not properly implemented
        throw new InvalidJSONException(responseBody, response.status);
      }
      if (response.ok) return parsedJSON;
      if (response.status >= 500) {
        throw new ServerException(parsedJSON, response.status);
      } else {
        throw new ApplicationException(parsedJSON, response.status);
      }
    });

export default class SpotifyWebApi {
  token: string;

  constructor() {
    this.token = null;
  }

  setAccessToken(token: string) {
    this.token = token;
  }

  getAccessToken() {
    return this.token;
  }

  async getAllFollowedArtists() {
    let allFollowedArtist;
    let currentArtistTotal = 0;

    const firstRes = await this.getMeFollowedArtists();
    currentArtistTotal = firstRes?.artists.items.length;
    allFollowedArtist = {artists : firstRes?.artists};

    console.log("followedArtsts " + JSON.stringify(allFollowedArtist));

    // Max limit of return artist is 50. If more we will want to call for all
    if (firstRes.artists.total > 50) {

      let followedRes;
      while (currentArtistTotal < firstRes.artists.total) {
        followedRes = await this.getMeFollowedArtists(allFollowedArtist.artists.items[currentArtistTotal-1].id);
        console.log("next followed " + JSON.stringify(followedRes));
        currentArtistTotal += followedRes?.artists.items.length;
        followedRes.artists.items.map(item => allFollowedArtist.artists.items.push(item));
        console.log("total artists: " + JSON.stringify(followedRes.artists));
        console.log("Total followed: " + allFollowedArtist.artists.items.length);
      }
      allFollowedArtist.artists.items.sort((itemA, itemB) => {
        const nameA = itemA.name.toUpperCase();
        const nameB = itemB.name.toUpperCase();
        if (nameA < nameB) {
          return -1;
        } else if (nameA > nameB) {
          return 1;
        }
        return 0;
      });
    }
    return allFollowedArtist;
  }

  async getMe() {
    return await this.getGeneric(`${apiPrefix}/me`);
  }

  async getMeFollowedArtists(artistId?) { 
    if (artistId) {
      return await this.getGeneric(`${apiPrefix}/me/following?type=artist&limit=50&after=${artistId}`)
    }
    return await this.getGeneric(`${apiPrefix}/me/following?type=artist&limit=50`)
  }

  async getAllArtistAlbums(artistId: string) {
    let allArtistAlbums;
    let albumResponse;

    /*
     * First get first list of albums and then use next response url to loop 
     * until no more pages of albums are left to pull. 
    */
    do {
      if (albumResponse?.next)
      {
        albumResponse = await this.getGeneric(albumResponse.next);
        allArtistAlbums.items.push(albumResponse.items);
      }
      else {
        albumResponse = await this.getArtistAlbum(artistId);
        allArtistAlbums = {items: albumResponse?.items}
      }
    } while (albumResponse.next);

    console.log("All Albums " + JSON.stringify(allArtistAlbums));

    return allArtistAlbums;
  
  }

  async getArtistAlbum(artistId: string) { 
    return await this.getGeneric(`${apiPrefix}/artists/${artistId}/albums?limit=50`)
  }

  async getAlbumInfo(albumId: string){
    return await this.getGeneric(`${apiPrefix}/albums/${albumId}`)
  }

  async postPlayerPlayBack(device_id: string, context_uri: string, offset_uri: string) {
      const dataToBeSent = {
        context_uri,
        offset: {uri:offset_uri},
        position_ms: 0
      };
  
      const res = await fetch(
        `${apiPrefix}/me/player/play/?device_id=${device_id}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
          body: JSON.stringify(dataToBeSent),
        }
      );
      return parseAPIResponse(res);
  }

  async getGeneric(url: string, options = {}) {
    const optionsString =
      Object.keys(options).length === 0
        ? ''
        : `?${Object.keys(options)
            .map((k) => `${k}=${options[k]}`)
            .join('&')}`;

    try {
      const res = await fetch(`${url}${optionsString}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });
      return parseAPIResponse(res);
    } catch (e) {
      console.error('e', e);
      return Promise.reject(e);
    }
  }

  async getUserPlaylists(userId: string, options?: { limit?: number }) {
    const url =
      typeof userId === 'string'
        ? `${apiPrefix}/users/${encodeURIComponent(userId)}/playlists`
        : `${apiPrefix}/me/playlists`;
    return await this.getGeneric(url, options);
  }

  async removeTracksFromPlaylist(
    userId: string,
    playlistId: string,
    uris: Array<string | { uri: string; positions: number[] }>
  ) {
    const dataToBeSent = {
      tracks: uris.map((uri) => (typeof uri === 'string' ? { uri: uri } : uri)),
    };

    const res = await fetch(
      `${apiPrefix}/users/${encodeURIComponent(
        userId
      )}/playlists/${playlistId}/tracks`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
        body: JSON.stringify(dataToBeSent),
      }
    );
    return parseAPIResponse(res);
  }

  async getMySavedTracks(options?: { limit?: number }) {
    return this.getGeneric(`${apiPrefix}/me/tracks`, options);
  }

  async removeFromMySavedTracks(trackIds: Array<string>) {
    const res = await fetch(`${apiPrefix}/me/tracks`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify(trackIds),
    });
    return parseAPIResponse(res);
  }
}
