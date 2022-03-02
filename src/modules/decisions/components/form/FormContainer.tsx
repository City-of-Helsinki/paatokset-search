import React from 'react';
import { ReactiveComponent } from '@appbaseio/reactivesearch';
import { withTranslation } from 'react-i18next';

import FormTitle from './FormTitle';
import SearchBar from './SearchBar';
import SubmitButton from './SubmitButton';
import SelectedFiltersContainer from './filters/SelectedFiltersContainer';
import DateSelect from './filters/date/DateSelect';
import CategorySelect from './filters/CategorySelect';
import DMSelect from './filters/DMSelect';
import { FormErrors } from '../../types/types';
import { updateQueryParam, getQueryParam, deleteQueryParam } from '../../../../utils/QueryString';
import SearchComponents from '../../enum/SearchComponents';
import IndexFields from '../../enum/IndexFields';
import SpecialCases from '../../enum/SpecialCases';

import formStyles from '../../../../common/styles/Form.module.scss';
import styles from './FormContainer.module.scss';
import classNames from 'classnames';

type FormContainerProps = {
  searchTriggered: boolean,
  triggerSearch: Function,
  t?: Function
};

type FormContainerState = {
  phrase: string,
  categories: Array<string>,
  queryCategories: Array<string>,
  dms: Array<any>,
  queryDms: Array<any>,
  from: any,
  queryFrom: any,
  to: any,
  queryTo: any
  errors: FormErrors,
  isDesktop: boolean,
  wildcardPhrase: string
};

class FormContainer extends React.Component<FormContainerProps, FormContainerState> {
  state: FormContainerState = {
    phrase: '',
    categories: [],
    queryCategories: [],
    dms: [],
    queryDms: [],
    errors: {},
    from: undefined,
    to: undefined,
    queryFrom: undefined,
    queryTo: undefined,
    isDesktop: window.matchMedia('(min-width: 1248px)').matches,
    wildcardPhrase: ''
  };

  componentDidMount() {
    const handler = (e: MediaQueryListEvent) => this.setState({ isDesktop: e.matches });
    window.matchMedia('(min-width: 1248px)').addEventListener('change', handler);
    const from = getQueryParam('from');
    if(from) {
      this.setState({
        queryFrom: from,
        from: from
      })
    }
    const to = getQueryParam('to');
    if(to) {
      this.setState({
        queryTo: to,
        to: to
      })
    }

    const initialCategories = getQueryParam(SearchComponents.CATEGORY);
    if(initialCategories) {
      const parsedCategories = JSON.parse(initialCategories);
      this.setState({
        categories: parsedCategories,
        queryCategories: parsedCategories
      });
    }

    const initialDms = getQueryParam(SearchComponents.DM);
    if(initialDms) {
      const { t } = this.props;
      let dms = JSON.parse(initialDms);

      // Decision maker values need to be transformed
      if(t) {  
        for(const dm in dms) {
          switch(dms[dm]) {
            case t('DECISIONS:city-council'):
              dms[dm] = {label: t('DECISIONS:city-council'), value: SpecialCases.CITY_COUNCIL};
              break;
            case t('DECISIONS:city-hall'):
              dms[dm] = {label: t('DECISIONS:city-hall'), value: SpecialCases.CITY_HALL};
              break;
            case t('DECISIONS:trustee'):
              dms[dm] = {label: t('DECISIONS:city-hall'), value: SpecialCases.CITY_HALL};
              break;
            default:
              dms[dm] = {label: dms[dm], value: dms[dm]}
              break;
          }
        }

        this.setState({
          dms: dms,
          queryDms: dms
        });
      }
    }

    const keyword = getQueryParam(SearchComponents.SEARCH_BAR);
    if(keyword) {
      const initialPhrase = JSON.parse(keyword);
      this.setState({
        wildcardPhrase: initialPhrase
      });
    }

    const initialPage = getQueryParam('results');
    if(![from, to, initialCategories, initialDms, keyword, initialPage].every(value => Number(value) === 0)) {
      if(!this.props.searchTriggered) {
        this.props.triggerSearch();
      }
    }
  }

  componentDidUpdate(prevProps: any, prevState: any) {
    const { queryFrom, queryTo } = this.state;

    if(queryFrom !== prevState.queryFrom) {
      if(queryFrom) {
        updateQueryParam('from', this.state.queryFrom);
      }
      else {
        deleteQueryParam('from');
      }
    }
    if(queryTo !== prevState.queryTo) {
      if(queryTo) {
        updateQueryParam('to', this.state.queryTo);
      }
      else {
        deleteQueryParam('to');
      }
    }
  }

  searchBar = React.createRef<any>();
  koro = React.createRef<any>();

  handleSubmit = (event: any) => {
    if(event) {
     event.preventDefault();
    }    
    this.searchBar.current.triggerQuery();
    this.setState({
      queryCategories: this.state.categories,
      queryDms: this.state.dms,
      queryFrom: this.state.from,
      queryTo: this.state.to,
      wildcardPhrase: this.state.phrase
    });

    if(!this.props.searchTriggered) {
      this.props.triggerSearch();
    }
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

  setDms = (dms: Array<string>) => {
    this.setState({
      dms: dms
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
    const { errors, phrase, categories, queryCategories, dms, queryDms, from, to, queryFrom, queryTo, isDesktop, wildcardPhrase } = this.state;

    let containerStyle: any = {};
    let koroStyle: any = {};
    
    if(isDesktop && this.koro.current) {
      containerStyle.marginBottom = `${this.koro.current.clientHeight}px`;
      koroStyle.backgroundColor = this.props.searchTriggered ? '#f7f7f8' : 'transparent';
      koroStyle.bottom = `-${this.koro.current.clientHeight}px`;
    }

    return(
      <div style={{background: '#f7f7f8'}}>
        <div
          className={classNames(
            formStyles.FormContainer,
            styles.FormContainer,
            'wrapper'
          )}
          style={containerStyle}
        >
          <FormTitle />
          <form className={classNames(
              formStyles.FormContainer__form,
              'container'
            )}
            onSubmit={this.handleSubmit}
          >
            <div className={formStyles['FormContainer__upper-fields']}>
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
            <div className={formStyles['FormContainer__lower-fields']}>
              <ReactiveComponent
                componentId={SearchComponents.MEETING_DATE}
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
                URLParams={true}
              />
              <ReactiveComponent
                componentId={SearchComponents.CATEGORY}
                defaultQuery={() => ({
                  aggs: {
                    top_category_name: {
                      terms: {
                        field: 'top_category_name',
                        order: { _key: 'asc' }
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
                URLParams={true}
              />
              <ReactiveComponent
                componentId={SearchComponents.DM}
                defaultQuery={() => ({
                  aggs: {
                    [IndexFields.SECTOR]: {
                      terms: {
                        field: IndexFields.SECTOR,
                        order: { _key: 'asc'}
                      }
                    }
                  }
                })}
                render={({ aggregations, setQuery }) => (
                  <DMSelect
                    aggregations={aggregations}
                    setQuery={setQuery}
                    setValue={this.setDms}
                    value={dms}
                    queryValue={queryDms}
                  />
                )}
                URLParams={true}
              />
              <ReactiveComponent
                componentId={SearchComponents.WILDCARD}
                customQuery={(props) => {
                  return {query: {
                    wildcard: {
                      'subject.keyword': `*${wildcardPhrase}*`
                    }
                  }}
                }}
              />
            </div>
            <SubmitButton
              type='mobile'
              disabled={errors.to !== undefined || errors.from !== undefined}
            />
          </form>
          {isDesktop &&
            <div className={styles['FormContainer__koro-wrapper']} ref={this.koro} style={koroStyle}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                width="100%" height="50"
                fill="currentColor"
                className={styles.FormContainer__koro}
              >
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
        <SelectedFiltersContainer
          categories={categories}
          setCategories={this.setCategories}
          dms={dms}
          setDms={this.setDms}
        />
      </div>
    );
  }
};

export default withTranslation()(FormContainer);
