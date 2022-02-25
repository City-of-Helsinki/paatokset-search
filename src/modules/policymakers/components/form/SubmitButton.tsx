import { ReactiveComponent } from '@appbaseio/reactivesearch';
import { Button } from 'hds-react';
import { useTranslation } from 'react-i18next';
import useWindowDimensions from '../../../../hooks/useWindowDimensions';
import classNames from 'classnames';

import SearchComponents from '../../enum/SearchComponents';

import formStyles from '../../../../common/styles/Form.module.scss';
import styles from './SubmitButton.module.scss';

type Props = {
  isDesktop?: boolean
};

const SubmitButton = ({ isDesktop }: Props) => {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const customClass = isDesktop ? styles.SubmitButton__desktop : styles.SubmitButton__mobile;
  
  if(isDesktop && width < 1248) {
    return null;
  }
  if(!isDesktop &&  width >= 1248) {
    return null;
  }

  return (
    <ReactiveComponent
      componentId={SearchComponents.SUBMIT_BUTTON}
      render={() => (
        <Button
          type='submit'
          tabIndex={0}
          className={classNames(
            styles.SubmitButton,
            formStyles['form-element'],
            customClass
          )}
        >
          {t('SEARCH:submit')}
        </Button>
      )}
    />
  )
}

export default SubmitButton;
