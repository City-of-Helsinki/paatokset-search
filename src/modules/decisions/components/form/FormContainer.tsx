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
import CategoryMap from '../../enum/CategoryMap';
import SectorMap from '../../enum/SectorMap';
import { Option } from '../../types/types';

import formStyles from '../../../../common/styles/Form.module.scss';
import styles from './FormContainer.module.scss';
import classNames from 'classnames';

type FormContainerProps = {
  langcode: string,
  searchTriggered: boolean,
  triggerSearch: Function,
  t?: Function
};

type FormContainerState = {
  phrase: string,
  categories: Array<Option>,
  queryCategories: Array<Option>,
  dm: Option|null,
  queryDm: Option|null,
  from: any,
  queryFrom: any,
  to: any,
  queryTo: any
  date_selection: any,
  errors: FormErrors,
  isDesktop: boolean,
  wildcardPhrase: string,
  koroRef: any
};

class FormContainer extends React.Component<FormContainerProps, FormContainerState> {
  state: FormContainerState = {
    phrase: '',
    categories: [],
    queryCategories: [],
    dm: null,
    queryDm: null,
    errors: {},
    from: undefined,
    to: undefined,
    date_selection: undefined,
    queryFrom: undefined,
    queryTo: undefined,
    isDesktop: window.matchMedia('(min-width: 1248px)').matches,
    wildcardPhrase: '',
    koroRef: null
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
      const formattedCategories = parsedCategories.map((category:string) => {
        let foundCategory = CategoryMap.find((element) => {
          if (element.label === category) {
            return true;
          }
          return false;
        });

        if (typeof foundCategory === 'undefined') {
          foundCategory = {
            "label": category,
            "value": "00"
          }
        }
        return foundCategory;
      });

      this.setState({
        categories: formattedCategories,
        queryCategories: formattedCategories
      });
    }

    const initialDm = getQueryParam(SearchComponents.DM);
    if(initialDm) {
      const { t } = this.props;
      let dm = JSON.parse(initialDm);

      let foundDm = SectorMap.find((element) => {
        if (element.label === dm) {
          return true;
        }
        return false;
      });

      // Decision maker values need to be transformed
      if(typeof foundDm === 'undefined' && t) {
        switch(dm) {
          case t('DECISIONS:city-council'):
            foundDm = {label: t('DECISIONS:city-council'), value: SpecialCases.CITY_COUNCIL};
            break;
          case t('DECISIONS:city-hall'):
            foundDm = {label: t('DECISIONS:city-hall'), value: SpecialCases.CITY_HALL};
            break;
          case t('DECISIONS:trustee'):
            foundDm = {label: t('DECISIONS:city-hall'), value: SpecialCases.CITY_HALL};
            break;
          default:
            foundDm = {label: dm, value: dm}
            break;
        }
      }

      if (typeof foundDm !== 'undefined') {
        this.setState({
          dm: foundDm,
          queryDm: foundDm
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
    if(![from, to, initialCategories, initialDm, keyword, initialPage].every(value => Number(value) === 0)) {
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

  handleSubmit = (event: any) => {
    if(event) {
     event.preventDefault();
    }
    this.searchBar.current.triggerQuery();
    this.setState({
      queryCategories: this.state.categories,
      queryDm: this.state.dm,
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

  setCategories = (categories: Array<Option>) => {
    this.setState({
      categories: categories
    });
  }

  setDm = (dm: Option|null) => {
    this.setState({
      dm: dm
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

  setSelection = (date_selection: any) => {
    this.setState({
      date_selection: date_selection
    });
  }

  setErrors = (errors: FormErrors) => this.setState({errors});

  onRefChange = (node: any) => {
    this.setState({
      koroRef: node
    });
  }

  render() {
    const { errors, phrase, categories, queryCategories, dm, queryDm, from, to, date_selection, queryFrom, queryTo, isDesktop, wildcardPhrase, koroRef } = this.state;

    let containerStyle: any = {};
    let koroStyle: any = {};

    if(koroRef && isDesktop) {
      containerStyle.marginBottom = `${koroRef.clientHeight}px`;
      koroStyle.backgroundColor = this.props.searchTriggered ? '#f7f7f8' : 'transparent';
      koroStyle.bottom = `-${koroRef.clientHeight}px`;
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
                URLParams={true}
                searchLabel={undefined}
                triggerSearch={this.props.triggerSearch}
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
                    selection={date_selection}
                    setSelection={this.setSelection}
                  />
                )}
                URLParams={true}
              />
              <ReactiveComponent
                componentId={SearchComponents.CATEGORY}
                defaultQuery={() => ({
                  aggs: {
                    top_category_code: {
                      terms: {
                        field: 'top_category_code',
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
                    [IndexFields.SECTOR_ID]: {
                      terms: {
                        field: IndexFields.SECTOR_ID,
                        order: { _key: 'asc'}
                      }
                    }
                  }
                })}
                render={({ aggregations, setQuery }) => (
                  <DMSelect
                    aggregations={aggregations}
                    setQuery={setQuery}
                    setValue={this.setDm}
                    value={dm}
                    queryValue={queryDm}
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
            <div className={styles['FormContainer__koro-wrapper']} ref={this.onRefChange} style={koroStyle}>
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
          dm={dm}
          setDm={this.setDm}
          from={from}
          setFrom={this.setFrom}
          to={to}
          setTo={this.setTo}
          setSelection={this.setSelection}
        />
      </div>
    );
  }
};

export default withTranslation()(FormContainer);
