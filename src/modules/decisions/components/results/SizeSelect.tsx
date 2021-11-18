import React from 'react';
import { Select } from 'hds-react';

import './SizeSelect.scss';

type Props = {
  setSize: Function
};

const SortSelect = ({ setSize }: Props) => {
  return (
    <Select
      className='SizeSelect'
      style={{
        padding: '2px'
      }}
      label={null}
      defaultValue={{
        label: '10',
        value: 10
      }}
      options={[
        {
          label: '10',
          value: 10
        },
        {
          label: '50',
          value: 50
        },
        {
          label: '100',
          value: 100
        }
      ]}
      onChange={({value}: any) => setSize(value)}
    />
  );
}

export default SortSelect;