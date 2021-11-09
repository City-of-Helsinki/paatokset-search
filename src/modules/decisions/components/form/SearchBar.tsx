import React, { useState } from 'react';
import { DataSearch } from '@appbaseio/reactivesearch';
import { IconSearch } from 'hds-react';

const SearchBar = () => {
  const [value, setValue] = useState('');

  const handleKeyPress = (e: KeyboardEvent, triggerQuery: Function) => {
    if(e.key === 'Enter') {
      triggerQuery();
    }
  }

  return (
    <React.Fragment>
      <label>Mitä etsit?</label>
      <DataSearch
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
        onKeyPress={handleKeyPress}
      />
    </React.Fragment>
  );
};

export default SearchBar;
