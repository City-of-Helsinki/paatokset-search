import React, { Component } from 'react';
import { DataSearch } from '@appbaseio/reactivesearch';
import { IconSearch } from 'hds-react';
import { DataSearchProps } from '@appbaseio/reactivesearch/lib/components/search/DataSearch';

const SearchBar = React.forwardRef<Component<DataSearchProps, any, any>, {value: string|undefined, setValue: any}>((props, ref) => {
  const { value, setValue } = props;

  return (
    <React.Fragment>
      <label>Mitä etsit?</label>
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
        placeholder='Etsi hakusanalla, esim. puisto'
        className='search-bar search-bar__decisions form-element'
        autosuggest={false}
        iconPosition={'right'}
        icon={<IconSearch />}
        value={value}
        onChange={setValue}
      />
    </React.Fragment>
  );
});

export default SearchBar;
