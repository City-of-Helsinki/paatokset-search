import React, { useState } from 'react';
import { ReactiveBase } from '@appbaseio/reactivesearch';

import Indices from '../../Indices';
import FormContainer from './components/form/FormContainer';
import ResultsContainer from './components/results/ResultsContainer';

const baseTheme = {
  typography: {
    fontFamily: 'var(--font-default)'
  },
  colors: {
    backgroundColor: '#f7f7f8'
  }
}

type Props = {
  url: string
};

const SearchContainer = ({ url }: Props) => {
  const [searchTriggered, setSearchStatus] = useState<boolean>(false);

  const triggerSearch = () => {
    setSearchStatus(true);
  }

  return (
    <ReactiveBase
      url={url}
      app={Indices.PAATOKSET_POLICYMAKERS}
      theme={baseTheme}
      >
        <FormContainer searchTriggered={searchTriggered} triggerSearch={triggerSearch} />
        {searchTriggered &&
          <ResultsContainer />
        }
      </ReactiveBase>
  )
}

export default SearchContainer;