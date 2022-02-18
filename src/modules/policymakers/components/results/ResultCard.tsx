import { IconArrowRight } from 'hds-react';

import useDepartmentClasses from '../../../../hooks/useDepartmentClasses';

import style from './ResultCard.module.scss';

type Props = {
  color_class: string[],
  field_dm_org_name?: string,
  key: string,
  title: string,
  trustee_name?: string,
  trustee_title?: string,

  url?: string
}

const ResultCard = ({color_class, field_dm_org_name, key, title, trustee_name, trustee_title, url}: Props) => {
  const colorClass = useDepartmentClasses(color_class);

  return (
    <article
      className={style.ResultCard} 
      key={key}
    >
      <a
        href={url}
        data-color-class={colorClass}
        className={style.ResultCard__container}
      >
        <span className={style.departmentHighlight} style={{backgroundColor: colorClass}}></span>
        <div className={style.titleContainer}>
          <h2 className={style.ResultCard__title}>{trustee_name ?? title}</h2>
          {
            trustee_title &&
            <div className={style['ResultCard__sub-title']}>{trustee_title}</div>
          }
          {
            field_dm_org_name &&
            <div className={style['ResultCard__sub-title']}>{field_dm_org_name}</div>
          }
        </div>
        <IconArrowRight size='m' />
      </a>
    </article>
  )
}

export default ResultCard;
