import React from 'react';
import { SelectedFilters, StateProvider } from '@appbaseio/reactivesearch';

import './SelectedFiltersContainer.scss';

const SelectedFiltersContainer = () => {
  const shouldRender = (searchState: any) => {
    let shouldRender = true;

    try {
      shouldRender = searchState.top_category_name.value.length > 0;
    }
    catch(e: unknown) {
      shouldRender = false;
    }

    return shouldRender;
  };

  return (
    <StateProvider>
      {({ searchState }) => {
        return shouldRender(searchState) ?
          <div className='form-element selected-filters-container'>
            <SelectedFilters
              className='selected-filters'
            />
          </div> :
          null;
      }}
    </StateProvider>
  );
};

export default SelectedFiltersContainer;
