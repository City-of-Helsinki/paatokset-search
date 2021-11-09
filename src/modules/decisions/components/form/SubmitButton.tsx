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
          className='form-element submit-button'
          onSubmit={(e: React.FormEvent) => e.preventDefault()}
          onClick={(e: any) => e.preventDefault()}
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
