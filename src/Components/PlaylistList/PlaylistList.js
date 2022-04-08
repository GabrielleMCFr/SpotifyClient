import React from "react";
import { PlaylistItem } from "../PlaylistItem/PlaylistItem";
import './PlaylistList.css';
import Spotify from "../../util/Spotify";

export class PlaylistList extends React.Component {

    render() {
        return (
            <div className="PlaylistList" id="playlist" tabIndex={1}>
                <h2>Your playlists</h2>
                {
                    this.props.playlists?.map(item => {
                        return (
                            <PlaylistItem playlist={item} 
                                    key={item.id}
                                    name={item.name}
                                    onSelect={this.props.onSelect}
                                />
                    )})
                }
            </div>
        )
    }
}