import React from 'react';
import { SelectedFilters } from '@appbaseio/reactivesearch';
import { IconCross } from 'hds-react';
import { useTranslation } from 'react-i18next';

import './SelectedFiltersContainer.scss';

type Props = {
  categories: Array<string>,
  setCategories: Function,
  dms: Array<any>,
  setDms: Function
}

const SelectedFiltersContainer = ({ categories, setCategories, dms, setDms }: Props) => {
  const { t } = useTranslation();

  if(categories.length <= 0 && dms.length <= 0) {
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

  const getDmFilters = () => {
    const deleteDm = (dm: any) => {
      let current = [...dms];
      const removeIndex = current.findIndex(element => element.value === dm.value);
      current.splice(removeIndex, 1);
      setDms(current);
    }

    return dms.map(dm => (
      <button
        className='SelectedFilters__filter'
        key={dm.value}
        onClick={() => deleteDm(dm.value)}
      >
        <IconCross />
        {dm.label}
      </button>
    ))
  }

  return (
    <div className='SelectedFilters form-element container'>
      <SelectedFilters
        className='SelectedFilters__wrapper'
        render={() => {
          return (
            <div className='SelectedFilters__container'>
              {getCategoryFilters()}
              {getDmFilters()}
              <button
                className='SelectedFilters__filter SelectedFilters__clear-filters'
                onClick={() => {setCategories([]); setDms([])}}
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
