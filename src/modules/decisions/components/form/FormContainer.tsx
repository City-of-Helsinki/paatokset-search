import React from 'react';
import { ReactiveComponent } from '@appbaseio/reactivesearch';
import { withTranslation } from 'react-i18next';

import FormTitle from './FormTitle';
import SearchBar from './SearchBar';
import SubmitButton from './SubmitButton';
import SelectedFiltersContainer from './filters/SelectedFiltersContainer';
import DateSelect from './filters/date/DateSelect';
import CategorySelect from './filters/CategorySelect';
import { FormErrors } from '../../types/types';
import { updateQueryParam, getQueryParam, deleteQueryParam } from '../../../../utils/QueryString';
import SearchComponents from '../../enum/SearchComponents';
import IndexFields from '../../enum/IndexFields';
import SpecialCases from '../../enum/SpecialCases';
import CategoryMap from '../../enum/CategoryMap';
import SectorMap from '../../enum/SectorMap';
import { Option, Options } from '../../types/types';

import formStyles from '../../../../common/styles/Form.module.scss';
import styles from './FormContainer.module.scss';
import classNames from 'classnames';
import DecisionmakerSelect from './filters/DecisionmakerSelect';

type FormContainerProps = {
  langcode: string,
  searchTriggered: boolean,
  formDescription: string,
  triggerSearch: Function,
  t?: Function
};

type FormContainerState = {
  phrase: string,
  categories: Array<Option>,
  queryCategories: Array<Option>,
  selectedCategories: Array<Option>,
  dms: Options|null,
  queryDms: Options|null,
  selectedDms: Options|null,
  from: any,
  queryFrom: any,
  selectedFrom: any,
  to: any,
  queryTo: any
  selectedTo: any,
  date_selection: any,
  errors: FormErrors,
  isDesktop: boolean,
  wildcardPhrase: string,
  koroRef: any,
  decisionmakers: any,
};

class FormContainer extends React.Component<FormContainerProps, FormContainerState> {
  state: FormContainerState = {
    phrase: '',
    categories: [],
    queryCategories: [],
    selectedCategories: [],
    dms: null,
    queryDms: null,
    selectedDms: null,
    errors: {},
    from: undefined,
    to: undefined,
    date_selection: undefined,
    queryFrom: undefined,
    queryTo: undefined,
    selectedFrom: undefined,
    selectedTo: undefined,
    isDesktop: window.matchMedia('(min-width: 1248px)').matches,
    wildcardPhrase: '',
    koroRef: null,
    decisionmakers: [],
  };

  componentDidMount() {
    const handler = (e: MediaQueryListEvent) => this.setState({ isDesktop: e.matches });
    window.matchMedia('(min-width: 1248px)').addEventListener('change', handler);
    const from = getQueryParam('from');
    if(from) {
      this.setState({
        queryFrom: from,
        selectedFrom: from,
        from: from
      })
    }
    const to = getQueryParam('to');
    if(to) {
      this.setState({
        queryTo: to,
        selectedTo: to,
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
        selectedCategories: formattedCategories,
        queryCategories: formattedCategories
      });
    }

    const initialDms = getQueryParam(SearchComponents.DM);

    if(initialDms) {
      const { t } = this.props;
      let dmsString = JSON.parse(initialDms);
      let dms = dmsString.split(',');
      const foundDms : {value: string, label: string}[] = []

      dms.forEach((dm:string)=> {
        let foundDm= SectorMap.find((element) => element.label === dm);
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
          foundDms.push(foundDm);
        }
      });

      if (foundDms) {
        this.setState({
          dms: foundDms,
          selectedDms: foundDms,
          queryDms: foundDms
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

    this.updateFilters();

    if(!this.props.searchTriggered) {
      this.props.triggerSearch();
    }
  };

  changePhrase = (value: any) => {
    this.setState({
      phrase: value
    });
  };

  setCategories = (categories: Array<Option>, update?: Boolean) => {
    this.setState({
      categories: categories
    });

    if (update) {
      this.setState({
        selectedCategories: categories,
        queryCategories: categories
      });
    }
  }

  setDms = (dms: Options|null, update?: Boolean) => {
    this.setState({
      dms: dms,
    });

    if (update) {
      this.setState({
        selectedDms: dms,
        queryDms: dms
      });
    }
  }

  setFrom = (from: any, update ?: Boolean) => {
    this.setState({
      from: from
    });

    if (update) {
      this.setState({
        selectedFrom: from,
        queryFrom: from
      })
    }
  }

  setTo = (to: any, update ?: Boolean) => {
    this.setState({
      to: to
    });

    if (update) {
      this.setState({
        queryTo: to,
        selectedTo: to
      })
    }
  }

  setSelection = (date_selection: any) => {
    this.setState({
      date_selection: date_selection
    });
  }

  updateFilters = () => {
    this.setState({
      selectedFrom: this.state.from,
      selectedTo: this.state.to,
      selectedDms: this.state.dms,
      selectedCategories: this.state.categories
    })
  }

  setErrors = (errors: FormErrors) => this.setState({errors});

  onRefChange = (node: any) => {
    this.setState({
      koroRef: node
    });
  }

  handleDecisionMakerLabels = (data: any) => {
    const aggregations = data?.aggregations;

    if (
      aggregations &&
      aggregations["decisionmaker_searchfield_data.keyword"].buckets.length
    ) {
      // handle query parameters.
      if (this.state.dms) {
        const updated = this.state.dms.map((option) => {
          if(option && option.label !== option.value) {
            return option;
          }

          const keyValueString = aggregations["decisionmaker_searchfield_data.keyword"].buckets.find((keyValueString: {key: string}) => {
            return keyValueString.key.split(':')[0] === option.value
          });

          if (!keyValueString) {
            return option
          }

          const key = keyValueString.key.split(':')[0];
          const label = keyValueString.key.split(':')[1];

          return {label: label, value: key}
        });
        updated && this.setDms(updated, true)
      }

      const decisionmakers = aggregations["decisionmaker_searchfield_data.keyword"].buckets
        .reduce((acc: any[], curr: {key: string})=> {
          let exists = false;
          acc.some((data: {key: string})=> {
            if (data.key.split(':')[0] === curr.key.split(':')[0]) {
              exists = true;
              return true;
            }
          });
          if (!exists) {
            acc.push(curr)
          }
          return acc
        }, [])
        .map((data: {key: string}) => ({
          label: data.key.split(':')[1],
          value: data.key.split(':')[0]
        }));

      let dms: Options = [];
      if (this.state.dms) {
        dms = decisionmakers.concat(this.state.dms);
      } else {
        dms = decisionmakers;
      }

      this.setState({
        dms: dms,
      });
    }
  }

  render() {
    const {
      errors,
      phrase,
      categories,
      queryCategories,
      selectedCategories,
      dms,
      queryDms,
      selectedDms,
      from,
      to,
      date_selection,
      queryFrom,
      queryTo,
      selectedFrom,
      selectedTo,
      isDesktop,
      wildcardPhrase,
      koroRef
    } = this.state;

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
          { this.props.formDescription && (
            <div className="container">
              <p className={formStyles['FormContainer__description']}>{ this.props.formDescription }</p>
            </div>
          )}
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
                        size: 100,
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
                onData={this.handleDecisionMakerLabels}
                defaultQuery={() => ({
                    aggs: ({
                      [IndexFields.SECTOR_ID]: {
                        terms: {
                          field: IndexFields.SECTOR_ID,
                          size: 100,
                          order: { _key: 'asc'}
                        }
                      },
                      [IndexFields.POLICYMAKER_ID]: {
                        terms: {
                          field: IndexFields.POLICYMAKER_ID,
                          size: 1000,
                          order: { _key: 'asc'}
                        }
                      },
                      [IndexFields.POLICYMAKER_STRING]: {
                        terms: {
                          field: IndexFields.POLICYMAKER_STRING,
                          size: 1000,
                          order: { _key: 'asc'}
                        }
                      },
                    })
                  })}
                render={({aggregations, setQuery}) => (
                  <DecisionmakerSelect
                    aggregations={aggregations}
                    setQuery={setQuery}
                    setValues={this.setDms}
                    values={dms}
                    queryValues={queryDms}
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
          categories={selectedCategories}
          setCategories={this.setCategories}
          dms={selectedDms}
          setDms={this.setDms}
          from={selectedFrom}
          setFrom={this.setFrom}
          to={selectedTo}
          setTo={this.setTo}
          setSelection={this.setSelection}
        />
      </div>
    );
  }
};

export default withTranslation()(FormContainer);
