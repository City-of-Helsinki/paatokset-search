import React, { useEffect, useCallback } from 'react';
import { Combobox } from 'hds-react';
import { useTranslation } from 'react-i18next';

import './CategorySelect.scss';

type Props = {
  aggregations: any,
  setQuery: Function,
  setValue: Function,
  value: Array<string>,
  queryValue: Array<string>
}

const CategorySelect = ({ aggregations, setQuery, setValue, value, queryValue }: Props) => {
  let categories: Array<any> = [];
  const { t } = useTranslation();

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
    if(queryValue.length) {
      setQuery({
        query: {
          terms: { 
            top_category_name: queryValue
          }
        },
        value: queryValue
      });
    }
    else {
      setQuery({
        query: null,
        values: []
      });
    }
  }, [queryValue, setQuery]);

  useEffect(() => {
    triggerQuery();
  }, [queryValue, setQuery, triggerQuery])

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
      label={t('DECISIONS:topic')}
      placeholder={t('DECISIONS:choose-topic')}
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
