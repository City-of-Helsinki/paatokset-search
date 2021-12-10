import React from 'react';
import { ReactiveBase } from '@appbaseio/reactivesearch';

import FormContainer from './components/form/FormContainer';
import ResultsContainer from './components/results/ResultsContainer';

const baseTheme = {
  typography: {
    fontFamily: 'var(--font-default)'
  },
  colors: {
    background: '#f7f7f8'
  }
}

const SearchContainer = () => {
  return (
    <ReactiveBase
      url={process.env.REACT_APP_ELASTIC_URL || 'http://localhost:9200'}
      app={process.env.REACT_APP_NAME || 'paatokset_decisions'}
      theme={baseTheme}
      >
        <FormContainer />
        <ResultsContainer />
      </ReactiveBase>
  )
}

export default SearchContainer;