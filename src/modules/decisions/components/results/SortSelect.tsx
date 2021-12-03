import React from 'react';
import { Select } from 'hds-react';
import { useTranslation } from 'react-i18next';

import './SortSelect.scss';

type Props = {
  setSort: Function
};

const SortSelect = ({ setSort }: Props) => {
  const { t } = useTranslation();

  return (
    <Select
      className='SortSelect'
      label={t('SEARCH:sort')}
      defaultValue={{
        label: t('SEARCH:most-recent-first'),
        value: 'desc'
      }}
      options={[
        {
          label: t('SEARCH:most-recent-first'),
          value: 'desc'
        },
        {
          label: t('SEARCH:oldest-first'),
          value: 'asc'
        }
      ]}
      onChange={({value}: any) => setSort(value)}
    />
  );
}

export default SortSelect;