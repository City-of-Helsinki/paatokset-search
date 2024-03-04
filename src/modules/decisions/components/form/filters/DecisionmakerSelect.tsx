import { Combobox } from 'hds-react';
import { Option, Options } from '../../../types/types';
import { useTranslation } from 'react-i18next';
import SpecialCases from '../../../enum/SpecialCases';

import { useEffect, useCallback, useState, useMemo } from 'react';
import formStyles from '../../../../../common/styles/Form.module.scss';
import sectorMap from '../../../enum/SectorMap';

type Props = {
  aggregations: any
  setQuery: Function,
  setValues: Function,
  values: Options|null,
  opts: Options|null,
  queryValues: Options|null
};

const DecisionmakerSelect = ({aggregations, setQuery, setValues, values, opts, queryValues}: Props) => {
  const { t } = useTranslation();
  const specialCases = [
    {label: t('DECISIONS:city-council'), value: SpecialCases.CITY_COUNCIL, key:SpecialCases.CITY_COUNCIL},
    {label: t('DECISIONS:city-hall'), value: SpecialCases.CITY_HALL, key: SpecialCases.CITY_HALL},
    {label: t('DECISIONS:trustee'), value: SpecialCases.TRUSTEE, key: SpecialCases.TRUSTEE},
  ];

  const [selected, setSelected] = useState(queryValues);

  let sectors: any[] = [];
  if (
    aggregations &&
    aggregations.sector_id &&
    aggregations.sector_id.buckets.length
  ) {
    sectors = aggregations.sector_id.buckets.map((sector: any) => ({
      label: t('SECTORS:' + sector.key),
      value: sector.key,
      key: sector.key
    }));
  }

  let options = sectors.concat(specialCases, opts ?? []).sort((a, b) => a.label.localeCompare(b.label));
  options.unshift({label: t('DECISIONS:show-all'), value: null});

  const triggerQuery = useCallback(() => {
    if(queryValues) {
      const specialCaseValues = [
        SpecialCases.CITY_COUNCIL,
        SpecialCases.CITY_HALL,
        SpecialCases.TRUSTEE
      ];
      let finalQuery: any = {bool: {should: []}};
      let value: string|null = null;

      const values: string[] = [];
      queryValues.forEach((queryValue) => {

        const sector = sectorMap.find((item)=>{
          return item.value === queryValue.value;
        });

        if (sector) {
          finalQuery.bool.should.push({ term: { sector_id: queryValue.value }});
          value = queryValue.value;
          values.push(value);
        }
        else if(specialCaseValues.includes(queryValue.value)) {
          finalQuery.bool.should.push({ term: { special_status: queryValue.value }});
          value = queryValue.value;
          values.push(value);
        }
        else if(queryValues?.find((option: Option) => option.value === queryValue.value )) {
          finalQuery.bool.should.push({ term: { field_policymaker_id: queryValue.value }});
          value = queryValue.value;
          values.push(value);
        }
      });

      setQuery({
        query: finalQuery,
        value: values.toString()
      });
    }
    else {
      setQuery({
        query: null,
        values: null
      });
    }
  }, [queryValues, setQuery, values]);

  useEffect(() => {
    setSelected(queryValues);
    triggerQuery()
  }, [queryValues, setQuery]);

  const onChange = (selected: any) => {
    setSelected(selected);
    if (selected.length) {
      setValues(selected);
    } else {
      setValues(null);
    }
  }

  return (
    <div className={formStyles['form-element']}>
      <Combobox
        multiselect
        id="decisionmakerselect"
        value={selected}
        onChange={onChange}
        label={t('DECISIONS:decisionmaker')}
        placeholder={t('DECISIONS:choose-decisionmaker')}
        clearButtonAriaLabel='Clear all selections'
        selectedItemRemoveButtonAriaLabel={`Remove value`}
        toggleButtonAriaLabel={'Toggle'}
        theme={{
          '--focus-outline-color': 'var(--hdbt-color-black)',
          '--multiselect-checkbox-background-selected': 'black',
        }}
        options={options}
      />
    </div>
  );
}

export default DecisionmakerSelect;