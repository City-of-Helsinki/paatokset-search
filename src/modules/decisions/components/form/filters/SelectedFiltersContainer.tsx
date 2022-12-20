import React from 'react';
import { SelectedFilters } from '@appbaseio/reactivesearch';
import { IconCross } from 'hds-react';
import { useTranslation } from 'react-i18next';

import { Option } from '../../../types/types';

import './SelectedFiltersContainer.scss';

type Props = {
  categories: Array<Option>,
  setCategories: Function,
  dm: Option|null,
  setDm: Function
  to: any,
  setTo: Function,
  from: any,
  setFrom: Function,
  setSelection: Function,
}

const SelectedFiltersContainer = ({ categories, setCategories, dm, setDm, from, setFrom, to, setTo, setSelection }: Props) => {
  const { t } = useTranslation();

  if(categories.length <= 0 && !dm && !to && !from) {
    return null;
  }

  const getCategoryFilters = () => {
    const deleteCategory = (value: string) => {
      let current = [...categories];
      current = current.filter((category) => {
        if (category.value === value) {
          return false;
        }
        return true;
      });
      setCategories(current);
    }

    return categories.map(category => (
      <button
        className='SelectedFilters__filter'
        key={category.value}
        onClick={() => deleteCategory(category.value)}
      >
        {category.label}
        <IconCross />
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
        {dm.label}
        <IconCross />
      </button>
    );
  }

  const getDateFilter = () => {
    if(!to && !from) {
      return null;
    }

    const deleteDateQuery = () => {
      setTo(null);
      setFrom(null);
      setSelection(null);
    }

    return (
      <button
        className='SelectedFilters__filter'
        key="{{ dateLabel }}"
        onClick={() => deleteDateQuery()}
      >
        { from } - { to }
        <IconCross />
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
              {getDateFilter()}
              {getCategoryFilters()}
              {getDmFilter()}
              <button
                className='SelectedFilters__filter SelectedFilters__clear-filters'
                onClick={() => {setCategories([]); setDm(null); setFrom(null); setTo(null); setSelection(null)}}
              >
                <IconCross />
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
