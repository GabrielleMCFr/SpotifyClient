import React from "react";
import './TrackList.css';
import { Track } from "../Track/Track";

export class TrackList extends React.Component {
    render() {
        // inside tracklist div, You will add a map method that renders a set of Track components
        // I had to make sure the array exist with the '?' or the map method didnt find the array. I think it didn't see it, but the whole object; 
        return (
            <div className="TrackList">
                {
                    this.props.tracks?.map(track => {
                        return <Track track={track} 
                                    key={track.id} 
                                    onAdd={this.props.onAdd}
                                    onRemove={this.props.onRemove}
                                    isRemoval={this.props.isRemoval}
                                    />
                    })
                }
            </div>
        );
    }
}