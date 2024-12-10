import React, { Component } from 'react';
import { DataSearch } from '@appbaseio/reactivesearch';
import { DataSearchProps } from '@appbaseio/reactivesearch/lib/components/search/DataSearch';
import { useTranslation } from 'react-i18next';

import SearchBarWrapper from '../../../../common/components/form/SearchBarWrapper';
import SearchBarAutocomplete from '../../../../common/components/form/SearchBarAutocomplete';
import IndexFields from '../../enum/IndexFields';
import SearchComponents from '../../enum/SearchComponents';

const SearchBar = React.forwardRef<Component<DataSearchProps, any, any>, {value: string|undefined, setValue: any, URLParams: any, searchLabel: string|undefined, triggerSearch: any}>((props, ref) => {
  const { value, setValue, URLParams, searchLabel, triggerSearch } = props;
  const { t } = useTranslation();

  const dataSearch = (
    <DataSearch
      ref={ref}
      componentId={SearchComponents.SEARCH_BAR}
      dataField={[
        IndexFields.SUBJECT,
        IndexFields.ISSUE_SUBJECT,
        IndexFields.DECISION_CONTENT,
        IndexFields.DECISION_MOTION
      ]}
      fieldWeights={[100,50,10,1]}
      placeholder={t('DECISIONS:search-bar-placeholder')}
      autosuggest={true}
      value={value}
      onChange={setValue}
      onValueSelected={function(value:any) {
        setValue(value);
        triggerSearch(value);
      }}
      URLParams={URLParams}
      render={function ({data, downshiftProps: { isOpen, getItemProps, highlightedIndex, selectedItem }}) {
        const uniqueSuggestions:string[] = [];
        const parsedData = [];
        for (let i = 0; i < data.length; i++) {
          let subject:string = data[i].source[IndexFields.SUBJECT][0];
          if (uniqueSuggestions.includes(subject)) {
            continue;
          }

          if (
            typeof data[i].source[IndexFields.HAS_TRANSLATION] !== 'undefined' &&
            data[i].source[IndexFields.HAS_TRANSLATION][0] === true &&
            data[i].source[IndexFields.LANGUAGE].toString() !== t('SEARCH:langcode')
          ) {
            continue;
          }

          uniqueSuggestions.push(subject);
          parsedData.push({
            label: subject,
            value: subject
          });
        }
        return isOpen && parsedData.length > 0 && (
          <SearchBarAutocomplete parsedData={parsedData} getItemProps={getItemProps} highlightedIndex={highlightedIndex} selectedItem={selectedItem} />
        );
      }}
    />
  );

  const label = searchLabel ? searchLabel : t('DECISIONS:search-bar-label');

  return (
    <SearchBarWrapper
      label={label}
      dataSearch={dataSearch}
    />
  );
});

export default SearchBar;
