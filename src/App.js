import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './App.css';

const DEFAULT_QUERY = 'redux';
const DEFAULT_HPP = '100';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';

// Inline styles
const largeColumn = {
  width: '40%',
}

const midColumn = {
  width: '30%',
}

const smallColumn = {
  width: '10%',
}

class App extends Component {
  constructor(props) {
    super(props); // Sets this.props to be used in constructor

    this.state = {
      results: null,
      searchKey: '',
      searchTerm: DEFAULT_QUERY,
      error: null
    };

    this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
  }

  needsToSearchTopStories(searchTerm) {
    return !this.state.results[searchTerm];
  }

  fetchSearchTopStories(searchTerm, page = 0) {
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result))
      .catch(error => this.setState({error}));
  }

  componentDidMount() {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    this.fetchSearchTopStories(searchTerm);
  }

  // Removes object from list
  onDismiss(id) {
    const { searchKey, results} = this.state;
    const { hits, page } = results[searchKey];

    const isNotId = (item) => item.objectID !== id;
    const updatedHits = hits.filter(isNotId);

    this.setState({
      results: { ...results, [searchKey]: { hits: updatedHits, page }}
    });
  }

  onSearchChange(event) {
    this.setState({ searchTerm : event.target.value });
  }

  onSearchSubmit(event) {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });

    if (this.needsToSearchTopStories(searchTerm)) {
      this.fetchSearchTopStories(searchTerm);
    }

    event.preventDefault();
  }

  setSearchTopStories(result) {
    const { hits, page } = result;
    const { searchKey, results } = this.state;

    const oldHits = results && results[searchKey] ? results[searchKey].hits : [];
    const updatedHits = [...oldHits, ...hits];

    this.setState({
      results: { ...results, [searchKey]: { hits: updatedHits, page }}
    });
  }

  render() {
    const { searchTerm, results, searchKey, error } = this.state;
    const page = (results && results[searchKey] && results[searchKey].page) || 0;
    const list = (results && results[searchKey] && results[searchKey].hits) || [];

    return (
      <div className="page">
        <div className="interactions">
          <Search
            value={searchTerm}
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}
          >
            Search:
          </Search>
          { results ?
            <div>
              <Table
                list={list}
                onDismiss={this.onDismiss}
              />
              <div className="interactions">
                <Button onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}>
                  More
                </Button>
              </div>
            </div>
          : null
          }
        </div>
        { error ? <div className="interactions"><p>Something went wrong.</p></div>
          : <Table list={list} onDismiss={this.onDismiss}/>}
      </div>
    );
  }
}

// Functional stateless component
const Search = ({ children, value, onChange, onSubmit }) =>
  <form onSubmit={onSubmit}>
    {children}
    <input
      type="text"
      value={value}
      onChange={onChange}
      />
    <button type="submit">
      {children}
    </button>
  </form>

// Functional stateless component
const Table = ({ list, onDismiss }) =>
  <div className="table">
    {list.map((item) =>
      <div key="{item.objectID}" className="table-row">
        <span style={largeColumn}>
          <a href={item.url}>{item.title}</a>
        </span>
        <span style={midColumn}>
          {item.author}
        </span>
        <span style={smallColumn}>
          {item.num_components}
        </span>
        <span style={smallColumn}>
          {item.points}
        </span>
        <span style={smallColumn}>
          <Button
            // higher order function that passes objectID param
            onClick={() => onDismiss(item.objectID)}
            className="button-inline"
          >
            Dismiss
          </Button>
        </span>
      </div>
    )}
  </div>

Table.propTypes = {
  list: PropTypes.arrayOf(
    PropTypes.shape({
      objectID: PropTypes.string.isRequired,
      author: PropTypes.string,
      url: PropTypes.string,
      num_comments: PropTypes.number,
      points: PropTypes.number,
    })
  ).isRequired,
  onDismiss: PropTypes.func.isRequired,
}

// Functional stateless component
const Button = ({className, onClick, children}) =>
  <button
    className={className}
    onClick={onClick}
    type="button"
  >
    { children }
  </button>

Button.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
}

Button.defaultProps = {
  className: '',
}

export default App;

export {
  Button,
  Search,
  Table,
}
