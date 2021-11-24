import React from 'react';
import { SelectedFilters } from '@appbaseio/reactivesearch';
import { IconCross } from 'hds-react';
import { useTranslation } from 'react-i18next';

import './SelectedFiltersContainer.scss';

type Props = {
  categories: Array<string>,
  setCategories: Function
}

const SelectedFiltersContainer = ({ categories, setCategories }: Props) => {
  const { t } = useTranslation();

  if(categories.length <= 0) {
    return null;
  }

  return (
    <div className='SelectedFilters form-element'>
      <SelectedFilters
        className='SelectedFilters__wrapper'
        render={() => {
          const deleteCategory = (category: string) => {
            let current = categories;
            current.splice(current.indexOf(category), 1);
            setCategories(current);
          }

          const filters = categories.map(category => (
            <button
              className='SelectedFilters__filter'
              key={category}
              onClick={() => deleteCategory(category)}
            >
              <IconCross />
              {category}
            </button>
          ));

          return (
            <div className='SelectedFilters__container'>
              {filters}
              <button
                className='SelectedFilters__filter SelectedFilters__clear-filters'
                onClick={() => setCategories([])}
              >
                {t('SEARCH:Clear all')}
              </button>
            </div>
          )
        }}
      />
    </div>
  );
};

export default SelectedFiltersContainer;
