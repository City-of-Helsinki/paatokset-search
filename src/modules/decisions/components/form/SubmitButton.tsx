import React from 'react';
import { ReactiveComponent } from '@appbaseio/reactivesearch';
import { Button } from 'hds-react';

import './SubmitButton.scss';

const SubmitButton = () => {
  return (
    <ReactiveComponent
      componentId={'submit-button'}
      render={() => (
        <Button
          type='submit'
          className='form-element submit-button'
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
