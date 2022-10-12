import { IconArrowRight } from 'hds-react';
import { useTranslation } from 'react-i18next';
import useDepartmentClasses from '../../../../hooks/useDepartmentClasses';

import style from './ResultCard.module.scss';

type Props = {
  color_class: string[],
  field_dm_org_name?: string,
  sector ?: string,
  key: string,
  title: string,
  trustee_name?: string,
  trustee_title?: string,
  url?: string
}

const ResultCard = ({color_class, field_dm_org_name, sector, key, title, trustee_name, trustee_title, url}: Props) => {
  const { t } = useTranslation();
  const colorClass = useDepartmentClasses(color_class);
  const translatedTrusteeTitle = (trustee_title:string) => {
    if (trustee_title.toString() === 'Councillor') {
      return t('POLICYMAKERS:councillor');
    }
    else if (trustee_title.toString() === 'Deputy councillor') {
      return t('POLICYMAKERS:deputy-councillor');
    }
    else {
      return trustee_title;
    }
  }
  const formattedSectorAndOrg = (sector:string|undefined, field_dm_org_name:string|undefined) => {
    if (sector && field_dm_org_name) {
      if (sector.toString() === field_dm_org_name.toString()) {
        return sector;
      }
      return sector + ' - ' + field_dm_org_name;
    }
    else if (field_dm_org_name) {
      return field_dm_org_name;
    }
    else if (sector) {
      return sector;
    }
    return false;
  }

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
            <div className={style['ResultCard__sub-title']}>{ translatedTrusteeTitle(trustee_title) }</div>
          }
          {
            formattedSectorAndOrg(sector, field_dm_org_name) &&
            <div className={style['ResultCard__sub-title']}>{ formattedSectorAndOrg(sector, field_dm_org_name) }</div>
          }
        </div>
        <IconArrowRight size='m' />
      </a>
    </article>
  )
}

export default ResultCard;
