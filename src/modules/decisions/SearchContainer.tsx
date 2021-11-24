import React from 'react';
import { ReactiveBase } from '@appbaseio/reactivesearch';

import FormContainer from './components/form/FormContainer';
import ResultsContainer from './components/results/ResultsContainer';

const SearchContainer = () => {
  return (
    <ReactiveBase
      url='http://localhost:9200'
      app='paatokset_decisions'
      >
        <FormContainer />
        <ResultsContainer />
      </ReactiveBase>
  )
}

export default SearchContainer;