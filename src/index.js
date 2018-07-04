import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

// Entry hook for React App into DOM element
ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();

// Hot module replacement
if (module.hot) {
  module.hot.accept();
}
