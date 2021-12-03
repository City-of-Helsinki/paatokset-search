import React from 'react';
import { ReactiveComponent } from '@appbaseio/reactivesearch';

import FormTitle from './FormTitle';
import SearchBar from './SearchBar';
import SubmitButton from './SubmitButton';
import SelectedFiltersContainer from './filters/SelectedFiltersContainer';
import DateSelect from './filters/date/DateSelect';
import CategorySelect from './filters/CategorySelect';
import { FormErrors } from '../../types/types';

import './FormContainer.scss';

type FormContainerState = {
  phrase: string,
  categories: Array<string>,
  queryCategories: Array<string>,
  from: any,
  queryFrom: any,
  to: any,
  queryTo: any
  errors: FormErrors
};

class FormContainer extends React.Component {
  state: FormContainerState = {
    phrase: '',
    categories: [],
    queryCategories: [],
    errors: {},
    from: undefined,
    to: undefined,
    queryFrom: undefined,
    queryTo: undefined,
  };

  searchBar = React.createRef<any>();

  handleSubmit = (event: any) => {
    console.log('handleSubmit')
    event.preventDefault();
    this.searchBar.current.triggerQuery();
    this.setState({
      queryCategories: this.state.categories
    });
    this.setState({
      queryFrom: this.state.from,
      queryTo: this.state.to
    })
  };

  changePhrase = (value: any) => {
    this.setState({
      phrase: value
    });
  };

  setCategories = (categories: Array<string>) => {
    this.setState({
      categories: categories
    });
  }

  setFrom = (from: any) => {
    this.setState({
      from: from
    });
  }

  setTo = (to: any) => {
    this.setState({
      to: to
    });
  }

  setErrors = (errors: FormErrors) => this.setState({errors});

  render() {
    const { errors, phrase, categories, queryCategories, from, to, queryFrom, queryTo } = this.state;

    return(
      <div className='FormContainer wrapper form-wrapper'>
        <FormTitle />
        <form className='container form-container' onSubmit={this.handleSubmit}>
          <div className='FormContainer__upper-fields'>
            <SearchBar
              ref={this.searchBar}
              value={phrase}
              setValue={this.changePhrase}
            />
            <SubmitButton
              type='desktop'
              disabled={errors.to !== undefined || errors.from !== undefined}
            />
          </div>
          <div className='FormContainer__lower-fields'>
            <ReactiveComponent
              componentId='meeting_date'
              defaultQuery={() => ({
                query: {
                  range: {
                    meeting_date: {}
                  }
                }
              })}
              render={({ setQuery }) => (
                <DateSelect
                  setQuery={setQuery}
                  errors={errors}
                  setErrors={this.setErrors}
                  to={to}
                  from={from}
                  setFrom={this.setFrom}
                  setTo={this.setTo}
                  queryFrom={queryFrom}
                  queryTo={queryTo}
                />
              )}
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
                <CategorySelect 
                  aggregations={aggregations}
                  setQuery={setQuery}
                  setValue={this.setCategories}
                  value={categories}
                  queryValue={queryCategories}
                />
              )}
            />
          </div>
          <SubmitButton
            type='mobile'
            disabled={errors.to !== undefined || errors.from !== undefined}
          />
          <SelectedFiltersContainer
            categories={categories}
            setCategories={this.setCategories}
          />
        </form>
      </div>
    );
  }
};

export default FormContainer;
