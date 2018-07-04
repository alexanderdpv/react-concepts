import React, { Component } from 'react';
import './App.css';

const list = [
  {
    title: 'React',
    url: 'https://facebook.github.io/react/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0
  }
];

const isSearched = (searchTerm) => (item) => {
  return item.title.toLowerCase().includes(searchTerm.toLowerCase());
}

class App extends Component {
  constructor(props) {
    super(props); // Sets this.props to be used in constructor

    this.state = {
      list: list,
      searchTerm: ''
    };

    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
  }

  // Removes object from list
  onDismiss(id) {
    const isNotId = (item) => item.objectID !== id;
    const updatedList = this.state.list.filter(isNotId);

    this.setState({ list : updatedList });
  }

  onSearchChange(event) {
    this.setState({ searchTerm : event.target.value });
  }

  render() {
    const { list, searchTerm } = this.state;

    return (
      <div className="App">
        <Search
          value={searchTerm}
          onChange={this.onSearchChange}
        />
        <Table
          list={list}
          pattern={searchTerm}
          onDismiss={this.onDismiss}
        />
      </div>
    );
  }
}

class Search extends Component {
  render() {
    const { onChange, value } = this.props;

    return (
      <form>
        <input
          type="text"
          onChange={onChange}
          value={value}/>
      </form>
    )
  }
}

class Table extends Component {
  render() {
    const { list, pattern, onDismiss } = this.props;

    return (
      <div>
        {list.filter(isSearched(pattern)).map((item) =>
          <div key="{item.objectID}">
            <span>
              <a href="{item.url}">{item.title}</a>
            </span>
            <span>{item.author}</span>
            <span>{item.num_components}</span>
            <span>{item.points}</span>
            <span>
              <button
                // higher order function that passes objectID param
                onClick={() => onDismiss(item.objectID)}
                type="button"
              >
                Dismiss
              </button>
            </span>
          </div>
        )}
      </div>
    )
  }
}

export default App;
