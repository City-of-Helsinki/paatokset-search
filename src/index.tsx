import React from 'react';
import ReactDOM from 'react-dom';
import DecisionsContainer from './modules/decisions/containers/SearchContainer';
import * as serviceWorker from './serviceWorker';

// Global styles
import './index.scss';

// Determine which data source we use once policymakers search is implemented
const decisions = true;

ReactDOM.render(
  <React.StrictMode>
    <section>
      {decisions ?
        <DecisionsContainer /> :
        null
      }
    </section>
  </React.StrictMode>,
  document.getElementById('paatokset_search')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
