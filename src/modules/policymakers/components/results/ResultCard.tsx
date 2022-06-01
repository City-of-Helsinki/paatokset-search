import { IconArrowRight } from 'hds-react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const colorClass = useDepartmentClasses(color_class);

  if (typeof url !== 'undefined') {
    url = url.toString();
    if (url.includes('/fi/')) {
      url = url.toString().replace('/fi/', t('SEARCH:prefix')).replace('paattajat', t('POLICYMAKERS:url-prefix'));
    }
    else if (url.includes('/sv/')) {
      url = url.toString().replace('/sv/', t('SEARCH:prefix')).replace('beslutsfattare', t('POLICYMAKERS:url-prefix'));;
    }
    else if (url.includes('/en/')) {
      url = url.toString().replace('/en/', t('SEARCH:prefix')).replace('decisionmakers', t('POLICYMAKERS:url-prefix'));;
    }

    if (url.includes('paattajat')) {
      url = url.toString().replace('paattajat', t('POLICYMAKERS:url-prefix'));
    }
    else if (url.includes('beslutsfattare')) {
      url = url.toString().replace('beslutsfattare', t('POLICYMAKERS:url-prefix'));;
    }
    else if (url.includes('decisionmakers')) {
      url = url.toString().replace('decisionmakers', t('POLICYMAKERS:url-prefix'));;
    }

  }

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
