import React, { Component } from 'react';
import { DataSearch } from '@appbaseio/reactivesearch';
import { DataSearchProps } from '@appbaseio/reactivesearch/lib/components/search/DataSearch';
import { useTranslation } from 'react-i18next';

import SearchBarWrapper from '../../../../common/components/form/SearchBarWrapper';
import IndexFields from '../../enum/IndexFields';
import SearchComponents from '../../enum/SearchComponents';

const SearchBar = React.forwardRef<Component<DataSearchProps, any, any>, {value: string|undefined, setValue: any}>((props, ref) => {
  const { value, setValue } = props;
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
      URLParams={true}
      render={function ({data, downshiftProps: { isOpen, getItemProps, highlightedIndex, selectedItem }}) {
        const uniqueSuggestions:string[] = [];
        const parsedData = [];
        for (let i = 0; i < data.length; i++) {
          let subject = data[i].source.subject[0];
          if (uniqueSuggestions.includes(subject)) {
            continue;
          }

          if (data[i].source.has_translation === true && data[i].source._language !== t('SEARCH:langcode')) {
            continue;
          }

          uniqueSuggestions.push(subject);
          parsedData.push({
            label: subject,
            value: subject
          });
        }
        return isOpen && parsedData.length > 0 && (
          <div className="search-autocomplete__wrapper">
            <div className="search-autocomplete">
              { parsedData.map((suggestion: any, index: Number) => (
                <div className="search-autocomplete__item" key={suggestion.value} {...getItemProps({
                    item: suggestion,
                    style: {
                      color: highlightedIndex === index ? 'white' : 'black',
                      backgroundColor: highlightedIndex === index ? 'black' : 'white',
                      fontWeight: selectedItem === suggestion ? 'bold' : 'normal',
                    }
                  })}>
                  {suggestion.value}
                </div>
              ))}
            </div>
          </div>
        );
      }}
    />
  );

  const label = t('DECISIONS:search-bar-label');

  return (
    <SearchBarWrapper
      label={label}
      dataSearch={dataSearch}
    />
  );
});

export default SearchBar;
