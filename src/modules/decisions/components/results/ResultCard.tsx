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
  lang_prefix: string,
  url_prefix: string,
  url_query: string,
  amount_label: string,
  issue_id: string,
  doc_count: number,
  subject: string,
  issue_subject: string,
  _score: number,
  organization_name: string
};

const ResultCard = ({category, color_class, date, href, lang_prefix, url_prefix, url_query, amount_label, issue_id, doc_count, organization_name, subject, issue_subject, _score}: Props) => {
  const colorClass = useDepartmentClasses(color_class);

  const handleClick = () => {
    window.location.href = href.toString().replace('/fi/', lang_prefix).replace('asia', url_prefix).replace('paatos', url_query);
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

  let cardClass = style.ResultCard;
  if (doc_count > 1) {
    cardClass += ' ' + style.MultipleResults;
  }

  return (
    <div
      className={cardClass}
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
            <span style={{color: 'red'}}>Score: { _score }, Diary number: { issue_id }, URL: { href }  </span>
          }
          <h2>{ subject }</h2>
          {process.env.REACT_APP_DEVELOPER_MODE &&
            <h3>{ issue_subject }</h3>
          }
          {
            doc_count > 1 &&
              <div className={style.ResultCard__amount}>
                <p>{amount_label}: {doc_count}</p>
              </div>
          }
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
