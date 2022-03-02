import React, { useEffect, useCallback } from 'react';
import { Select } from 'hds-react';
import { useTranslation } from 'react-i18next';

import formStyles from '../../../../../common/styles/Form.module.scss';
import multiselectStyle from './Multiselect.module.scss';
import classNames from 'classnames';

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
    <Select
      multiselect
      className={classNames(
        multiselectStyle.Multiselect,
        formStyles['form-element']
      )}
      label={t('DECISIONS:topic')}
      placeholder={t('DECISIONS:choose-topic')}
      options={categories}
      value={formattedValue}
      clearButtonAriaLabel='Clear all selections'
      selectedItemRemoveButtonAriaLabel={`Remove value`}
      onChange={onChange}
    />
  );
}

export default CategorySelect;
