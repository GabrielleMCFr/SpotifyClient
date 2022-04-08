import React from 'react';
import './SearchBar.css'

export class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.search = this.search.bind(this);
        this.handleTermChange = this.handleTermChange.bind(this);
    }

    search() {
        this.props.onSearch(this.state.term);
    }

    handleTermChange(e) {
        this.setState({
            term: e.target.value
        })
    }

    render() {
        return (
        <div className="SearchBar" id="search" tabIndex={1}>
            <input placeholder="Enter A Song, Album, or Artist" onChange={this.handleTermChange}/>
            <button className="SearchButton" onClick={this.search}>SEARCH</button>
        </div>
        );
    }
}