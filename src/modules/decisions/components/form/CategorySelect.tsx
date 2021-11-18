import React, { useEffect, useCallback } from 'react';
import { Combobox } from 'hds-react';

import './CategorySelect.scss';

type Props = {
  aggregations: any,
  setQuery: Function,
  setValue: Function,
  value: Array<string>
}

const CategorySelect = ({aggregations, setQuery, setValue, value}: Props) => {
  let categories: Array<any> = [];

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

  const triggerQuery = useCallback(() => {
    if(value.length) {
      setQuery({
        query: {
          terms: { 
            top_category_name: value
          }
        },
        value: value
      });
    }
    else {
      setQuery({
        query: null,
        values: []
      });
    }
  }, [value, setQuery]);

  useEffect(() => {
    triggerQuery();
  }, [value, setQuery, triggerQuery])

  const onChange = (categories: Array<any>) => {
    const values = categories.map(category => category.value);
    setValue(values);
  }

  const formattedValue: Array<any> = value.map((category) => {
    return {value: category, label: category};
  });

  return (
    <Combobox
      className='CategorySelect form-element'
      label='Aihe'
      placeholder='Valitse aihe'
      options={categories}
      value={formattedValue}
      multiselect={true}
      clearButtonAriaLabel='Clear all selections'
      selectedItemRemoveButtonAriaLabel={`Remove value`}
      toggleButtonAriaLabel='Toggle menu'
      onChange={onChange}
    />
);
}

export default CategorySelect;
