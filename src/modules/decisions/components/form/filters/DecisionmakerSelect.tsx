import { Combobox } from 'hds-react';
import { Option, Options } from '../../../types/types';
import { useTranslation } from 'react-i18next';
import SpecialCases from '../../../enum/SpecialCases';

import { useEffect, useCallback, useState } from 'react';
import formStyles from '../../../../../common/styles/Form.module.scss';

type Props = {
  aggregations: any
  setQuery: Function,
  setValues: Function,
  values: Options|null,
  queryValues: Options|null
};

const DecisionmakerSelect = ({aggregations, setQuery, setValues, values, queryValues}: Props) => {
  const { t } = useTranslation();
  const specialCases = [
    {label: t('DECISIONS:city-council'), value: SpecialCases.CITY_COUNCIL},
    {label: t('DECISIONS:city-hall'), value: SpecialCases.CITY_HALL},
    {label: t('DECISIONS:trustee'), value: SpecialCases.TRUSTEE},
  ];

  const [decisionMakers, setDecisionmakers] = useState(values);
  // const [decisionMakerIds, setDecisionmakerIds] = useState([]);

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

  let decisionmakers = [];
  let decisionmakerIds: string[] = [];


  if (
    aggregations &&
    aggregations["decisionmaker_searchfield_data.keyword"] &&
    aggregations["decisionmaker_searchfield_data.keyword"].buckets.length
  ) {
    // Create options for decisionmakers dropdown. Reduce duplicates and then map for combobox.
    decisionmakers = aggregations["decisionmaker_searchfield_data.keyword"].buckets
    .reduce((acc: any[], curr: {key: string})=> {
      decisionmakerIds.push(curr.key.split(':')[0]);
      let exists = false;
      const ex = acc.some((data: {key: string})=> {
        if (data.key.split(':')[0] === curr.key.split(':')[0]) {
          exists = true;
          return true;
        }
      });
      if (!exists) {
        acc.push(curr)
      }
      return acc
    }, [])
    .map((data: {key: string}) => ({
      label: data.key.split(':')[1],
      value: data.key.split(':')[0]
    }));
  }

  const options = sectors.concat(specialCases, decisionmakers).sort((a, b) => a.label.localeCompare(b.label));
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
      queryValues.forEach((queryValue)=> {
        if(specialCaseValues.includes(queryValue.value)) {
          finalQuery.bool.should.push({ term: { special_status: queryValue.value }});
          value = queryValue.value;
          values.push(value);
        }
        else if (decisionmakerIds.includes(queryValue.value)){
          finalQuery.bool.should.push({ term: { field_policymaker_id: queryValue.value }});
          value = queryValue.value;
          values.push(value);
        }
        else if (queryValue.value !== null) {
          finalQuery.bool.should.push({ term: { sector_id: queryValue.value }});
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
  }, [queryValues, setQuery]);

  useEffect(() => {
    triggerQuery();
  }, [queryValues, setQuery, triggerQuery]);

  useEffect(() => {
    updateDecisionmakerLabelById();
    setDecisionmakers(values);
    triggerQuery();
  }, [values, aggregations]);

  const updateDecisionmakerLabelById = () => {
    values?.forEach((option: Option, index)=> {
      if (aggregations &&
        aggregations["decisionmaker_searchfield_data.keyword"] &&
        option.value === option.label
      ) {
        const item = aggregations["decisionmaker_searchfield_data.keyword"].buckets.find((item: {key: string})=> item.key.split(':')[0] === option.value)
        values[index].label = item.key.split(':')[1];
      }
    });
  }

  const onChange = (selected: any) => {
    setDecisionmakers(selected);
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
        value={decisionMakers}
        onChange={onChange}
        label={t('DECISIONS:decisionmaker')}
        placeholder={t('DECISIONS:choose-decisionmaker')}
        clearButtonAriaLabel='Clear all selections'
        selectedItemRemoveButtonAriaLabel={`Remove value`}
        toggleButtonAriaLabel={'Toggle'}
        theme={{
          '--focus-outline-color': 'var(--hdbt-color-black)',
          '--multiselect-checkbox-background-selected': 'var(--hdbt-color-black)',
          '--placeholder-color': 'var(--hdbt-color-black)',
        }}
        options={options}
      />
    </div>
  );
}

export default DecisionmakerSelect;