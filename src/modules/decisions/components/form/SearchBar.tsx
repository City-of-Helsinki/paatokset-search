import React, { Component } from 'react';
import { DataSearch } from '@appbaseio/reactivesearch';
import { IconSearch } from 'hds-react';
import { DataSearchProps } from '@appbaseio/reactivesearch/lib/components/search/DataSearch';
import { useTranslation } from 'react-i18next';

import './SearchBar.scss';

const SearchBar = React.forwardRef<Component<DataSearchProps, any, any>, {value: string|undefined, setValue: any}>((props, ref) => {
  const { value, setValue } = props;
  const { t } = useTranslation();

  return (
    <div className='SearchBar'>
      <label>{t('DECISIONS:search-bar-label')}</label>
      <DataSearch
        ref={ref}
        componentId='searchbox'
        dataField={[
          'content_draft_proposal',
          'content_presenter',
          'content_resolution',
          'issue_subject',
          'subject'
        ]}
        aggregationField={'issue_id'}
        placeholder={t('DECISIONS:search-bar-placeholder')}
        className='search-bar search-bar__decisions form-element'
        autosuggest={false}
        iconPosition={'right'}
        icon={<IconSearch />}
        value={value}
        onChange={setValue}
        react={{
          and: 'meeting_date'
        }}
      />
    </div>
  );
});

export default SearchBar;
