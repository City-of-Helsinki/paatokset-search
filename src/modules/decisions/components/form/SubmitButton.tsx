import React from 'react';
import { ReactiveComponent } from '@appbaseio/reactivesearch';
import { Button } from 'hds-react';
import classNames from 'classnames';

import useWindowDimensions from '../../../../hooks/useWindowDimensions';
import './SubmitButton.scss';

type Props = {
  disabled: boolean,
  type: string
}

const SubmitButton = ({ disabled, type = 'default' }: Props) => {
  const { width } = useWindowDimensions();

  if(type === 'mobile' && width >= 1248) {
    return null;
  }

  if(type === 'desktop' && width < 1248) {
    return null;
  }

  return (
    <ReactiveComponent
      componentId={'submit-button'}
      render={() => (
        <Button
          type='submit'
          className={classNames(
            'form-element',
            'SubmitButton',
            `submit-button--${type}`
          )}
          disabled={disabled}
          style={{
            borderColor: 'black'
          }}
        >
          Hae
        </Button>
      )}
    />
  );
}

export default SubmitButton;
