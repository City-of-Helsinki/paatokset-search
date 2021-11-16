import React from 'react';
import { ReactiveComponent } from '@appbaseio/reactivesearch';

import SearchBar from '../components/form/SearchBar';
import SubmitButton from '../components/form/SubmitButton';
import SelectedFiltersContainer from './SelectedFiltersContainer';
import DateSelect from '../components/form/DateSelect';
import CategorySelect from '../components/form/CategorySelect';
import './FormContainer.scss';

type FormErrors = {
  from?: string,
  to?: string
}

class FormContainer extends React.Component {
  state = {
    phrase: '',
    errors: {}
  }

  searchBar = React.createRef<any>();

  handleSubmit = (event: any) => {
    event.preventDefault();
    this.searchBar.current.triggerQuery();
  }

  changePhrase = (value: any) => {
    this.setState({
      phrase: value
    });
  }

  render() {
    const { phrase } = this.state;

    return(
      <div className="wrapper form-wrapper">
        <h1>Hae päätöksiä</h1>
        <form className='container form-container' onSubmit={this.handleSubmit}>
          <SearchBar
            ref={this.searchBar}
            value={phrase}
            setValue={this.changePhrase}
          />
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
          <ReactiveComponent
            componentId='meeting_date'
            render={({ setQuery }) => (
              <DateSelect setQuery={setQuery} />
            )}
          />
          <SubmitButton />
          <SelectedFiltersContainer />
        </form>
      </div>
    );
  }
};

export default FormContainer;
