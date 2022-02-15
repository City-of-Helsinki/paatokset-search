import React, { Component } from 'react';

import SearchBar from './SearchBar';
import SubmitButton from './SubmitButton';
import { ReactiveComponent } from '@appbaseio/reactivesearch';
import SearchComponents from '../../enum/SearchComponents';
import IndexFields from '../../enum/IndexFields';
import SelectedFilters from '../../../../common/components/form/SelectedFilters';
import { getQueryParam } from '../../../../utils/QueryString';

import SectorSelect from './filters/SectorSelect';
import formStyles from '../../../../common/styles/Form.module.scss';
import classNames from 'classnames';

type Props = {
  searchTriggered: boolean,
  triggerSearch: Function
}

type FormContainerState = {
  phrase: string,
  sectors: string[],
  querySectors: string[],
  filters: any[]
};

const getInitialValue = (key: string) => {
  const queryParam = getQueryParam(key);
  if(queryParam) {
    return JSON.parse(queryParam); 
  }
  return [];
}

class FormContainer extends Component<Props> {
  state: FormContainerState = {
    phrase: '',
    sectors: [],
    querySectors: [],
    filters: []
  };

  componentDidMount() {
    const initialOrgans = getInitialValue(SearchComponents.ORGAN);
    if(initialOrgans) {
      this.setState({
        organs: initialOrgans,
        queryOrgans: initialOrgans
      });
    }
    const initialSectors = getInitialValue(SearchComponents.SECTOR);
    if(initialSectors) {
      this.setState({
        sectors: initialSectors,
        querySectors: initialSectors
      });
    }

    const initialPhrase = getInitialValue(SearchComponents.SEARCH_BAR);
    if(initialPhrase && !this.props.searchTriggered) {
      this.props.triggerSearch();
    }
  }

  setPhrase = (value: string) => {
    this.setState({
      phrase: value
    });
  }

  setSectors = (sectors: string[]) => {
    this.setState({
      sectors: sectors
    });
  }

  searchBar = React.createRef<any>();

  deleteFilter = (value: string, type: string) => {
    let values = [...this.state.sectors];
    values.splice(values.indexOf(value), 1);
    this.setSectors(values);
  }

  getFilters = () => {
    const { sectors } = this.state;
    const sectorFilters = sectors.map(sector => ({value: sector, type: SearchComponents.SECTOR, deleteFilter: this.deleteFilter}));
    return sectorFilters;
  }

  clearAllFilters = () => {
    this.setState({
      sectors: []
    });
  }

  handleSubmit = (event: any) => {
    if(event) {
      event.preventDefault();
    }

    if(this.searchBar.current) {
      if(!this.props.searchTriggered) {
        this.props.triggerSearch();
      }

      this.searchBar.current.triggerQuery();
    }

    this.setState({
      querySectors: this.state.sectors
    });
  }

  render() {
    const { phrase, sectors, querySectors } = this.state;

    return (
      <div className={classNames(
          formStyles.FormContainer,
          'wrapper'
        )}
      >
        <form className={formStyles.FormContainer__form} onSubmit={this.handleSubmit}>
          <div className={formStyles['FormContainer__upper-fields']}>
            <SearchBar
              ref={this.searchBar}
              value={phrase}
              setValue={this.setPhrase}
            />
            <SubmitButton isDesktop={true} />
          </div>
          <div className={formStyles['FormContainer__lower-fields']}>
            <ReactiveComponent
              componentId={SearchComponents.SECTOR}
              defaultQuery={() => ({
                aggs: {
                  [IndexFields.SECTOR]: {
                    terms: {
                      field: IndexFields.SECTOR
                    }
                  }
                }
              })}
              render={({ aggregations, setQuery }) => (
                <SectorSelect
                  aggregations={aggregations}
                  value={sectors}
                  setValue={this.setSectors}
                  setQuery={setQuery}
                  queryValue={querySectors}
                />
              )}
              URLParams={true}
            />
          </div>
          <SubmitButton />
          <SelectedFilters
            filters={this.getFilters()}
            clearAll={this.clearAllFilters}
          />
        </form>
      </div>
    );
  }
}

export default FormContainer;
