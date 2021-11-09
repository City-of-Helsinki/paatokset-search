import React from 'react';
import { IconArrowRight } from 'hds-react';
import { format } from 'date-fns';

import './ResultCard.scss';

type Props = {
  category: string,
  date: string,
  href: string,
  policymaker: string,
  subject: string
};

const ResultCard = ({category, date, href, policymaker, subject}: Props) => {
  const handleClick = () => {
    window.location.href=href
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if(e.key === 'Enter') {
      handleClick();
    }
  }

  const formattedDate = format(new Date(date), 'dd.MM.yyyy');

  return (
    <div 
      className='search-result__wrapper'
      onClick={handleClick}
      onKeyPress={handleKeyPress}
      tabIndex={0}
    >
      <div className='search-result__label'>
        { policymaker }
      </div>
      <div className='search-result__container'>
        <div className='search-result__header'>
          <div className='search-result__date'>
            { formattedDate }
          </div>
        </div>
        <div className='search-result__title'>
          <h2>{ subject }</h2>
        </div>
        <div className='search-result__footer'>
          <div className='search-result__tag-container paatokset-tag-container'>
            <span className='search-tag'>{ category }</span>
          </div>
          <div className='search-result__issue-link'>
              <IconArrowRight size={'l'}/>
          </div>
        </div>
      </div>
    </div>  
  );
}

export default ResultCard;

