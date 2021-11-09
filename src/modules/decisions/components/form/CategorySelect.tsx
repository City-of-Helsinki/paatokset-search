import React from 'react';
import { Combobox } from 'hds-react';

import './CategorySelect.scss';

type Props = {
  aggregations: any,
  setQuery: Function
}

const CategorySelect = ({aggregations, setQuery}: Props) => {
  let categories = [];

  if(
    aggregations &&
    aggregations.top_category_name &&
    aggregations.top_category_name.buckets.length
    ) {
    categories = aggregations.top_category_name.buckets.map((category: any) => ({
      label: category.key,
      value: category.key
    }));
  }

  const onChange = (categories: Array<any>) => {
    const values = categories.map(category => category.value);
    if(values.length) {
      setQuery({
        query: {
          terms: { 
            top_category_name: values
          }
        },
        value: values
      });
    }
    else {
      setQuery({
        query: null,
        values: []
      });
    }
  }

  return (
    <Combobox
      className='CategorySelect form-element'
      label='Aihe'
      placeholder='Valitse aihe'
      options={categories}
      multiselect={true}
      clearButtonAriaLabel='Clear all selections'
      selectedItemRemoveButtonAriaLabel={`Remove value`}
      toggleButtonAriaLabel='Toggle menu'
      onChange={onChange}
    />
  );
}

export default CategorySelect;
