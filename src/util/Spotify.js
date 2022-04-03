let accessToken, expiresIn;
const CLIENT_ID = '$$$$$$$$$$$$$$$';
const REDIRECT_URI = "https://jamm-gm.surge.sh";

const Spotify = {
    getAccessToken() {
        // if token already set, return it
        if (accessToken) {
            return accessToken
        }
        
        // check for access token match is url after authentication (implicit grant flow)
        const matchingAccessToken = window.location.href.match(/access_token=([^&]*)/);
        const matchingExpiresIn = window.location.href.match(/expires_in=([^&]*)/);

        if (matchingAccessToken && matchingExpiresIn) {
            accessToken = matchingAccessToken[1];
            expiresIn = Number(matchingExpiresIn[1])

            // clear the parameters, so we can use another access token when it expires:
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');

            return accessToken
        }

        else {
            window.location = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&scope=playlist-modify-public&redirect_uri=${REDIRECT_URI}`
        }
    },

    search(term) {
        accessToken = this.getAccessToken();
        return (
            fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
            headers: {Authorization: `Bearer ${accessToken}`}
            })
            .then(response => response.json())
            .then(jsonResponse => {
                if (!jsonResponse.tracks) {
                    return [];
                }
                return jsonResponse.tracks.items.map(track => ({
                    id: track.id,
                    name: track.name,
                    artist: track.artists[0].name,
                    album: track.album.name,
                    uri: track.uri
                }));
            }).catch(error => console.log(error))
        )
    },

    savePlaylist(name, urisArray) {
        if (!name || !urisArray.length) {
            return
        }
        let currentAccessToken = this.getAccessToken();
        const headers = {Authorization: `Bearer ${accessToken}`};
        let userId;

        return (fetch('https://api.spotify.com/v1/me', {
            headers: headers
        })
        .then(response => response.json())
        .then(jsonResponse => {
            userId = jsonResponse.id

            // make a post request to create a new empty playlist
            return (fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({name: name})
                })
                .then(response => response.json())
                .then(jsonResponse => {
                    let playlistID = jsonResponse.id

                    // again, post request to add tracks
                    return (fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistID}/tracks`, {
                        method: 'POST',
                        headers: headers, 
                        body: JSON.stringify({uris: urisArray})
                    }));
                }));
            })
        )
    }
}

export default Spotify