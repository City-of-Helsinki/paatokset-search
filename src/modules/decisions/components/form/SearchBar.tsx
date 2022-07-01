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
        IndexFields.DECISION_CONTENT,
        IndexFields.DECISION_MOTION,
        IndexFields.ISSUE_SUBJECT,
        IndexFields.SUBJECT
      ]}
      placeholder={t('DECISIONS:search-bar-placeholder')}
      autosuggest={false}
      value={value}
      onChange={setValue}
      URLParams={true}
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
