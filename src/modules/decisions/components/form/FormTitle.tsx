import React from 'react';
import { useTranslation } from 'react-i18next';

const FormTitle = () => {
  const { t } = useTranslation();

  return (
    <h1>{t('DECISIONS:form-title')}</h1>
  );
}

export default FormTitle;
