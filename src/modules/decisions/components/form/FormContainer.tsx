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
  errors: FormErrors,
  isDesktop: boolean
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
    isDesktop: window.matchMedia('(min-width: 1200px)').matches
  };

  componentDidMount() {
    const handler = (e: MediaQueryListEvent) => this.setState({ isDesktop: e.matches });
    window.matchMedia('(min-width: 1200px)').addEventListener('change', handler);
  }

  searchBar = React.createRef<any>();
  koro = React.createRef<any>();

  handleSubmit = (event: any) => {
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
    const { errors, phrase, categories, queryCategories, from, to, queryFrom, queryTo, isDesktop } = this.state;

    let containerStyle: any = {};
    let koroStyle: any = {};
    
    if(isDesktop && this.koro.current) {
      containerStyle.marginBottom = `${this.koro.current.clientHeight}px`;
      koroStyle.bottom = `-${this.koro.current.clientHeight}px`;
    }

    return(
      <div className='FormContainer wrapper form-wrapper' style={containerStyle}>
        <FormTitle />
        <form className='form-container' onSubmit={this.handleSubmit}>
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
        {isDesktop &&
          <div className='FormContainer__koro-wrapper' ref={this.koro} style={koroStyle}>
            <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="100%" height="50" fill="currentColor" className='FormContainer__koro'>
              <defs>
                <pattern id="koros1164540240" x="0" y="0" width="67" height="51" patternUnits="userSpaceOnUse">
                  <path d="M 67 70 V 30.32 h 0 C 50.25 30.32 50.25 20 33.5 20 S 16.76 30.32 0 30.32 H 0 V 70 Z"></path>
                </pattern>
              </defs>
              <rect fill="url(#koros1164540240)" width="100%" height="50"></rect>
            </svg>
          </div>
        }
      </div>
    );
  }
};

export default FormContainer;
