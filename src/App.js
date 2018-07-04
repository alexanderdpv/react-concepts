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

class App extends Component {
  constructor(props) {
    super(props); // Sets this.props to be used in constructor

    this.state = {
      list: list,
    };

    this.onDismiss = this.onDismiss.bind(this);
  }

  // Removes object from list
  onDismiss(id) {
    const isNotId = (item) => item.objectID !== id;
    const updatedList = this.state.list.filter(isNotId);

    this.setState({ list : updatedList });
  }

  render() {
    return (
      <div className="App">
        {this.state.list.map((item) => {
          return (
            <div key="{item.objectID}">
              <span>
                <button
                  onClick = {() => this.onDismiss(item.objectID)}
                  type = "button"
                >
                  Dismiss
                </button>
              </span>
              <span>{item.author}</span>
              <span>{item.num_components}</span>
              <span>{item.points}</span>
            </div>
          );
        })}
      </div>
    );
  }
}

export default App;
