import { useEffect, useCallback } from 'react';
import { Select } from 'hds-react';
import { useTranslation } from 'react-i18next';

import SpecialCases from '../../../enum/SpecialCases';
import { Option } from '../../../types/types';

import formStyles from '../../../../../common/styles/Form.module.scss';
import multiSelectStyles from './Multiselect.module.scss';
import classNames from 'classnames';

type Props = {
  aggregations: any
  setQuery: Function,
  setValue: Function,
  value: Option|null,
  queryValue: Option|null
};

const DMSelect = ({ aggregations, setQuery, setValue, value, queryValue }: Props) => {
  let sectors: Array<any> = [];
  const { t } = useTranslation();

  const specialCases = [
    {label: t('DECISIONS:city-council'), value: SpecialCases.CITY_COUNCIL},
    {label: t('DECISIONS:city-hall'), value: SpecialCases.CITY_HALL},
    {label: t('DECISIONS:trustee'), value: SpecialCases.TRUSTEE}
  ];

  if(
    aggregations &&
    aggregations.sector &&
    aggregations.sector.buckets.length
  ) {
    sectors = aggregations.sector.buckets.map((sector: any) => ({
      label: sector.key,
      value: sector.key
    }));
  }

  const options = sectors.concat(specialCases).sort((a, b) => a.label.localeCompare(b.label));

  const triggerQuery = useCallback(() => {
    if(queryValue) {
      const specialCaseValues = [
        SpecialCases.CITY_COUNCIL,
        SpecialCases.CITY_HALL,
        SpecialCases.TRUSTEE
      ];
      let finalQuery: any = {bool: {should: []}};
      let value: string|null = null;
      if(specialCaseValues.includes(queryValue.value)) {
        finalQuery.bool.should.push({ term: { special_status: queryValue.value }});
        value = queryValue.label;
      }
      else {
        finalQuery.bool.should.push({ term: { sector: queryValue.value }});
        value = queryValue.value;
      }

      setQuery({
        query: finalQuery,
        value: value
      });
    }
    else {
      setQuery({
        query: null,
        values: null
      });
    }
  }, [queryValue, setQuery]);

  useEffect(() => {
    triggerQuery();
  }, [queryValue, setQuery, triggerQuery])

  const onChange = (dm: any) => {
    setValue(dm);
  }

  const currentValue: Option|Option[] = value || [];

  return (
    <Select
      className={classNames(
          formStyles['form-element'],
          multiSelectStyles.Multiselect
      )}
      value={currentValue}
      options={options}
      label={t('DECISIONS:decisionmaker')}
      placeholder={t('DECISIONS:choose-decisionmaker')}
      clearButtonAriaLabel='Clear all selections'
      selectedItemRemoveButtonAriaLabel={`Remove value`}
      onChange={onChange}
    />
  )
}

export default DMSelect;
