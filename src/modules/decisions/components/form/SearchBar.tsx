import React, { Component } from 'react';
import { DataSearch } from '@appbaseio/reactivesearch';
import { IconSearch } from 'hds-react';
import { DataSearchProps } from '@appbaseio/reactivesearch/lib/components/search/DataSearch';
import { useTranslation } from 'react-i18next';

import IndexFields from '../../enum/IndexFields';
import SearchComponents from '../../enum/SearchComponents';
import './SearchBar.scss';

const SearchBar = React.forwardRef<Component<DataSearchProps, any, any>, {value: string|undefined, setValue: any}>((props, ref) => {
  const { value, setValue } = props;
  const { t } = useTranslation();

  return (
    <div className='SearchBar'>
      <label>{t('DECISIONS:search-bar-label')}</label>
      <DataSearch
        ref={ref}
        componentId={SearchComponents.SEARCH_BAR}
        dataField={[
          IndexFields.CONTENT_DRAFT_PROPOSAL,
          IndexFields.CONTENT_PRESENTER,
          IndexFields.CONTENT_RESOLUTION,
          IndexFields.ISSUE_SUBJECT,
          IndexFields.SUBJECT
        ]}
        aggregationField={IndexFields.ISSUE_ID}
        placeholder={t('DECISIONS:search-bar-placeholder')}
        className='SearchBar__input form-element'
        autosuggest={false}
        iconPosition={'right'}
        icon={<IconSearch />}
        value={value}
        onChange={setValue}
        URLParams={true}
      />
    </div>
  );
});

export default SearchBar;
