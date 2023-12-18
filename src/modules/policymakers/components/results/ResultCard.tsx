import { IconArrowRight, IconAngleRight } from 'hds-react';
import { useTranslation } from 'react-i18next';
import useDepartmentClasses from '../../../../hooks/useDepartmentClasses';

import style from './ResultCard.module.scss';

type Props = {
  color_class: string[],
  key: string,
  title: string,
  trustee_name?: string,
  trustee_title?: string,
  url?: string,
  organization_hierarchy?: string[]
}

const ResultCard = ({color_class, key, title, trustee_name, trustee_title, url, organization_hierarchy}: Props) => {
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

  const formattedOrganizations = (organization_hierarchy:string[]|undefined) => {
    if (organization_hierarchy) {
      let organization_path = organization_hierarchy.map((organization, index) => (  
        <span>{index !== 0 ? <IconAngleRight /> : ''}{organization}</span>  
      ))

      return organization_path;
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
            formattedOrganizations(organization_hierarchy) &&
            <div className={style['ResultCard__sub-title']}>{ formattedOrganizations(organization_hierarchy) }</div>
          }
        </div>
        <IconArrowRight size='m' />
      </a>
    </article>
  )
}

export default ResultCard;
