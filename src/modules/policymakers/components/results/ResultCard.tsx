import { IconArrowRight } from 'hds-react';

import useDepartmentClasses from '../../../../hooks/useDepartmentClasses';

import style from './ResultCard.module.scss';

type Props = {
  color_class: string[],
  key: string,
  title: string,
  trustee_name?: string,
  url?: string
}

const ResultCard = ({color_class, key, title, trustee_name, url}: Props) => {
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
        <span className={style.ResultCard__title}>{trustee_name ?? title}</span>
        <IconArrowRight size='m' />
      </a>
    </article>
  )
}

export default ResultCard;
