import React from 'react';
import './App.css';
import '../Playlist/Playlist';
import '../SearchBar/SearchBar';
import '../SearchResults/SearchResults';
import { SearchBar } from '../SearchBar/SearchBar';
import { SearchResults } from '../SearchResults/SearchResults';
import { Playlist } from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';
import { PlaylistList } from '../PlaylistList/PlaylistList';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      playlistName: 'New Playlist',
      playlistTracks: [],
      playlistId: null,
      allPlaylists: []
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
    this.filterResults = this.filterResults.bind(this);
    this.selectPlaylist = this.selectPlaylist.bind(this)
  }

  filterResults(result) {
    let filteredResults = result;

    for (let i = 0; i < result.length; i++) {
      for (let x = 0; x < this.state.playlistTracks.length; x++)
      if (this.state.playlistTracks[x].id === result[i].id) {
        filteredResults = filteredResults.filter(item => item.id !== result[i].id)
      };
    };
    return filteredResults
  }

  addTrack(track) {
    // if the track already exist, return
    if (this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
      return
    }
    // else add to array
    else {
      this.setState({
        playlistTracks: [...this.state.playlistTracks, track]
      })
    }
  }

  removeTrack(track) {
    // if the track exist remove it
    if (this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
      // return every track not equal to track
      const filteredTracks = this.state.playlistTracks.filter(item => item !== track);
      this.setState({
        playlistTracks: filteredTracks
      })
    }

    //else return
    else {
      return
    }
  }

  updatePlaylistName(name) {
    this.setState({
      playlistName: name
    })
  }

  savePlaylist() {
    const trackURIs = this.state.playlistTracks.map(track => track.uri)
    Spotify.savePlaylist(this.state.playlistName, trackURIs, this.state.playlistId).then(() => {
      this.setState({
        playlistName: 'New Playlist',
        playlistTracks: [],
        playlistId: null
      });
      document.getElementById('spotify-save').innerHTML = "Saved!"
      setInterval( () => document.getElementById('spotify-save').innerHTML = 'SAVE TO SPOTIFY', 1500)
      
      Spotify.getUserPlaylists().then(result => {
        this.setState({
            allPlaylists: result
        })
    })
    });
  }

  search(term) {
    Spotify.search(term).then(results => {
      const filterResults = this.filterResults(results)
      this.setState({
        searchResults: filterResults
      })
    });
  }

  selectPlaylist(name, id) {
    Spotify.getPlaylist(id).then(results => {
      this.setState({
        playlistTracks: results,
        playlistName: name,
        playlistId: id
      });
      document.getElementById('spotify-save').innerHTML = 'SAVE TO SPOTIFY';
    })
  }

  componentDidMount() {
    Spotify.getUserPlaylists().then(result => {
        this.setState({
            allPlaylists: result
        })
    })
}

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search}/>
          <div className="App-playlist">
          <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack}/>
          <Playlist playlistTracks={this.state.playlistTracks} 
                    playlistName={this.state.playlistName} 
                    onRemove={this.removeTrack}
                    onNameChange={this.updatePlaylistName}
                    onSave={this.savePlaylist}
                    />
          
          </div>
          <br></br>
          <div className='App-playlist'>
          <PlaylistList onSelect={this.selectPlaylist} playlists={this.state.allPlaylists}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
