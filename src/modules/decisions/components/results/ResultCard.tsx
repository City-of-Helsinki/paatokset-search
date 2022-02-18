import React from 'react';
import { IconArrowRight } from 'hds-react';
import { format } from 'date-fns';

import useDepartmentClasses from '../../../../hooks/useDepartmentClasses';

import style from './ResultCard.module.scss';
import classNames from 'classnames';

type Props = {
  category: string,
  color_class: string[],
  date: number,
  href: string,
  subject: string,
  _score: number,
  organization_name: string
};

const ResultCard = ({category, color_class, date, href, organization_name, subject, _score}: Props) => {
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
      className={style.ResultCard}
      onClick={handleClick}
      onKeyPress={handleKeyPress}
      tabIndex={0}
    >
      <div className={style.ResultCard__label} style={{backgroundColor: colorClass}}>
        { organization_name }
      </div>
      <div className={style.ResultCard__container}>
        <div>
          <div className={style.ResultCard__date}>
            { formattedDate }
          </div>
        </div>
        <div className={style.ResultCard__title}>
          {process.env.REACT_APP_DEVELOPER_MODE &&
            <span style={{color: 'red'}}>{ _score }</span>
          }
          <h2>{ subject }</h2>
        </div>
      </div>
      <div className={style.ResultCard__footer}>
          {
            category &&
              <div className={classNames(
                style.ResultCard__tags,
                'paatokset-tag-container'
              )}>
                <span className={style['search-tag']}>{ category }</span>
              </div>
          }
          <div className={style['ResultCard__issue-link']}>
              <IconArrowRight size={'l'}/>
          </div>
        </div>
    </div>  
  );
}

export default ResultCard;
