import { IconArrowRight } from 'hds-react';
import classNames from 'classnames';

import useDepartmentClasses from '../../../../hooks/useDepartmentClasses';

import style from './ResultCard.module.scss';
import departmentStyles from '../../../../common/styles/Departments.module.scss';

type Props = {
  key: string,
  title: string,
  field_organization_type?: string[],
  url?: string
}

const ResultCard = ({key, title, url, field_organization_type}: Props) => {
  const department = useDepartmentClasses(field_organization_type);
  let departmentClass;

  if(department && department.length > 0) {
    departmentClass = departmentStyles[`department--${department}`];
  }

  return (
    <article
      className={style.ResultCard} 
      key={key}
    >
      <a href={url} className={classNames(
        style.ResultCard__container,
        departmentClass
      )}>
        <span className={style.ResultCard__title}>{title}</span>
        <IconArrowRight size='m' />
      </a>
    </article>
  )
}

export default ResultCard;
