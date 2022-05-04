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

  const getTranslatedCategory = (category: string) => {
    switch (category) {
      case "Hallintoasiat":
        return t("CATEGORIES:00");
      case "Henkilöstöasiat":
        return t("CATEGORIES:01");
      case "Talousasiat, verotus ja omaisuuden hallinta":
        return t("CATEGORIES:02");
      case "Lainsäädäntö ja lainsäädännön soveltaminen":
        return t("CATEGORIES:03");
      case "Kansainvälinen toiminta ja maahanmuuttopolitiikka":
        return t("CATEGORIES:04");
      case "Sosiaalitoimi":
        return t("CATEGORIES:05");
      case "Terveydenhuolto":
        return t("CATEGORIES:06");
      case "Tiedon hallinta":
        return t("CATEGORIES:07");
      case "Liikenne":
        return t("CATEGORIES:08");
      case "Turvallisuus ja yleinen järjestys":
        return t("CATEGORIES:09");
      case "Maankäyttö, rakentaminen ja asuminen":
        return t("CATEGORIES:10");
      case "Ympäristöasia":
        return t("CATEGORIES:11");
      case "Opetus- ja sivistystoimi":
        return t("CATEGORIES:12");
      case "Tutkimus- ja kehittämistoiminta":
        return t("CATEGORIES:13");
      case "Elinkeino- ja työvoimapalvelut":
        return t("CATEGORIES:14");
      default:
        return category;
    }
  }

  if(
    aggregations &&
    aggregations.top_category_name &&
    aggregations.top_category_name.buckets.length
    ) {
    categories = aggregations.top_category_name.buckets.map((category: any) => ({
      label: getTranslatedCategory(category.key),
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
