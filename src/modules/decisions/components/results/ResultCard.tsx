import React from 'react';
import { IconArrowRight } from 'hds-react';
import { format } from 'date-fns';

import useDepartmentClasses from '../../../../hooks/useDepartmentClasses';

import './ResultCard.scss';

type Props = {
  category: string,
  color_class: string[],
  date: number,
  href: string,
  policymaker: string,
  subject: string,
  _score: number
};

const ResultCard = ({category, color_class, date, href, policymaker, subject, _score}: Props) => {
  const colorClass = useDepartmentClasses(color_class);

  const handleClick = () => {
    window.location.href=href
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if(e.key === 'Enter') {
      handleClick();
    }
  }

  let formattedDate;
  if(date) {
    formattedDate = format(new Date(date * 1000), 'dd.MM.yyyy');
  }

  return (
    <div 
      className='search-result__wrapper'
      onClick={handleClick}
      onKeyPress={handleKeyPress}
      tabIndex={0}
    >
      <div className='search-result__label' style={{backgroundColor: colorClass}}>
        { policymaker }
      </div>
      <div className='search-result__container'>
        <div className='search-result__header'>
          {formattedDate &&
            <div className='search-result__date'>
              { formattedDate }
            </div>
          }
        </div>
        <div className='search-result__title'>
          {process.env.REACT_APP_DEVELOPER_MODE &&
            <span style={{color: 'red'}}>{ _score }</span>
          }
          <h2>{ subject }</h2>
        </div>
      </div>
      <div className='search-result__footer'>
          {
            category &&
              <div className='search-result__tag-container paatokset-tag-container'>
                <span className='search-tag'>{ category }</span>
              </div>
          }
          <div className='search-result__issue-link'>
              <IconArrowRight size={'l'}/>
          </div>
        </div>
    </div>  
  );
}

export default ResultCard;

