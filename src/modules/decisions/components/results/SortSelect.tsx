import React from 'react';
import { Select } from 'hds-react';

type Props = {
  setSort: Function
};

const SortSelect = ({ setSort }: Props) => {
  return (
    <Select
      className='SortSelect'
      label={'Lajittelu'}
      defaultValue={{
        label: 'Uusin ensin',
        value: 'desc'
      }}
      options={[
        {
          label: 'Uusin ensin',
          value: 'desc'
        },
        {
          label: 'Vanhin ensin',
          value: 'asc'
        }
      ]}
      onChange={({value}: any) => setSort(value)}
    />
  );
}

export default SortSelect;