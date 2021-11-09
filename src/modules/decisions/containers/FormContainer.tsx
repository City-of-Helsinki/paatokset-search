import React from 'react';
import { ReactiveComponent } from '@appbaseio/reactivesearch';

import SearchBar from '../components/form/SearchBar';
import SubmitButton from '../components/form/SubmitButton';
import SelectedFiltersContainer from './SelectedFiltersContainer';
import DateSelect from '../components/form/DateSelect';
import CategorySelect from '../components/form/CategorySelect';
import './FormContainer.scss';

const FormContainer = () => {
  return(
    <div className="wrapper form-wrapper">
      <h1>Hae päätöksiä</h1>
      <form className='container form-container'>
        <SearchBar />
        <ReactiveComponent
          componentId='top_category_name'
          defaultQuery={() => ({
            aggs: {
              top_category_name: {
                terms: {
                  field: 'top_category_name'
                }
              }
            }
          })}
          render={({ aggregations, setQuery }) => (
            <CategorySelect aggregations={aggregations} setQuery={setQuery} />
          )}
        />
        <DateSelect />
        <SubmitButton />
        <SelectedFiltersContainer />
      </form>
    </div>
  );
};

export default FormContainer;