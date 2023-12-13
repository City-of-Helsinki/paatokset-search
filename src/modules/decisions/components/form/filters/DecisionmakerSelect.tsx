import { Combobox } from 'hds-react';
import { Option, Options } from '../../../types/types';
import { useTranslation } from 'react-i18next';
import SpecialCases from '../../../enum/SpecialCases';

import { useEffect, useCallback, useState } from 'react';

/*
import { Select } from 'hds-react';
import SpecialCases from '../../../enum/SpecialCases';

import formStyles from '../../../../../common/styles/Form.module.scss';
import multiSelectStyles from './Multiselect.module.scss';
import classNames from 'classnames';
*/

type Props = {
  aggregations: any
  setQuery: Function,
  setValue: Function,
  setValues: Function,
  value: Option|null,
  values: Options|null,
  queryValue: Option|null
};

const DecisionmakerSelect = ({aggregations, setQuery, setValue, setValues, value, values, queryValue}: Props) => {

  // Hardcoded values in the list.
  const { t } = useTranslation();
  const specialCases = [
    {label: t('DECISIONS:city-council'), value: SpecialCases.CITY_COUNCIL},
    {label: t('DECISIONS:city-hall'), value: SpecialCases.CITY_HALL},
    {label: t('DECISIONS:trustee'), value: SpecialCases.TRUSTEE},
  ];

  // todo dynamically add values to the dropdown

  const initialDropdownData: any[] = []

  const [decisionMakers , setDecisionMakers] = useState(initialDropdownData);

  let sectors: any[] = [];

  if (
    aggregations &&
    aggregations.sector_id &&
    aggregations.sector_id.buckets.length
  ) {
    sectors = aggregations.sector_id.buckets.map((sector: any) => ({
      label: t('SECTORS:' + sector.key),
      value: sector.key
    }));
  }

  const options = sectors.concat(specialCases).sort((a, b) => a.label.localeCompare(b.label));

  options.unshift({label: t('DECISIONS:show-all'), value: null});

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
      else if (queryValue.value !== null) {
        finalQuery.bool.should.push({ term: { sector_id: queryValue.value }});
        value = queryValue.label;
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

  const onChange = (selected: any) => {
    setDecisionMakers(selected);
    // todo this if needs changes.
    if (value !== null && selected !== null && value.value === selected.value) {
      setValue(null);
    }
    else {
      setValues(selected)
    }
  }

  return (
    <Combobox
      multiselect
      id="asd"
      value={decisionMakers}
      onChange={onChange}
      label={'Päättäjä'}
      placeholder={'Valitse päättäjä'}
      clearButtonAriaLabel={'Clear button'}
      selectedItemRemoveButtonAriaLabel={'selected item remove button area label'}
      toggleButtonAriaLabel={'waht is this'}
      theme={{
        '--focus-outline-color': 'var(--hdbt-color-black)',
        '--multiselect-checkbox-background-selected': 'var(--hdbt-color-black)',
        '--placeholder-color': 'var(--hdbt-color-black)',
      }}
      options={options}
    />
  );
}

export default DecisionmakerSelect;