import React from 'react';
import { IconSearch } from 'hds-react';

import formStyles from '../../../common/styles/Form.module.scss';
import styles from './SearchBarWrapper.module.scss'
import classNames from 'classnames';

type Props = {
  label: string,
  dataSearch: JSX.Element
}

const SearchBarWrapper = ({label, dataSearch}: Props) => {
  const searchElement = React.cloneElement(
    dataSearch,
    {
      iconPosition: 'right',
      icon: <IconSearch />,
      className: classNames(
        styles.SearchBar__input,
        formStyles['form-element']
      )
    }
  );

  return (
    <div className={styles.SearchBarWrapper}>
      <label>{label}</label>
      {searchElement}
    </div>
  )
}

export default SearchBarWrapper;
