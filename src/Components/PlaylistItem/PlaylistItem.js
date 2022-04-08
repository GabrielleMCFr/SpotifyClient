import React from "react";
import './PlaylistItem.css';

export class PlaylistItem extends React.Component {
    constructor(props) {
        super(props);
        this.selectPlaylist = this.selectPlaylist.bind(this);
    }

    selectPlaylist() {
        this.props.onSelect(this.props.playlist.name, this.props.playlist.id)
        document.getElementById('search').focus({preventScroll:false})
    }

    render() {
        return (
            <div className="Item">
                <div>
                    <p>{this.props.playlist.name}</p>
                </div>
                
                <button className="Item-action" onClick={this.selectPlaylist} title="Edit">✍</button>
            
            </div>
        )
    }
}