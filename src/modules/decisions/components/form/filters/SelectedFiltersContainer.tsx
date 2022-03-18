import React from 'react';
import { SelectedFilters } from '@appbaseio/reactivesearch';
import { IconCross } from 'hds-react';
import { useTranslation } from 'react-i18next';

import { Option } from '../../../types/types';

import './SelectedFiltersContainer.scss';

type Props = {
  categories: Array<string>,
  setCategories: Function,
  dm: Option|null,
  setDm: Function
}

const SelectedFiltersContainer = ({ categories, setCategories, dm, setDm }: Props) => {
  const { t } = useTranslation();

  if(categories.length <= 0 && !dm) {
    return null;
  }

  const getCategoryFilters = () => {
    const deleteCategory = (category: string) => {
      let current = [...categories];
      current.splice(current.indexOf(category), 1);
      setCategories(current);
    }

    return categories.map(category => (
      <button
        className='SelectedFilters__filter'
        key={category}
        onClick={() => deleteCategory(category)}
      >
        <IconCross />
        {category}
      </button>
    ));
  }

  const getDmFilter = () => {
    // When dm is unset, it's an empty array
    if(!dm || dm instanceof Array) {
      return null;
    }

    const deleteDm = (dm: any) => {
      setDm(null);
    }

    return (
      <button
        className='SelectedFilters__filter'
        key={dm.value}
        onClick={() => deleteDm(dm.value)}
      >
        <IconCross />
        {dm.label}
      </button>
    );
  }

  return (
    <div className='SelectedFilters form-element container'>
      <SelectedFilters
        className='SelectedFilters__wrapper'
        render={() => {
          return (
            <div className='SelectedFilters__container'>
              {getCategoryFilters()}
              {getDmFilter()}
              <button
                className='SelectedFilters__filter SelectedFilters__clear-filters'
                onClick={() => {setCategories([]); setDm(null)}}
              >
                {t('SEARCH:clear-all')}
              </button>
            </div>
          )
        }}
      />
    </div>
  );
};

export default SelectedFiltersContainer;
