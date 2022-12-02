import React from 'react';
import { withTranslation } from 'react-i18next';

import FormTitle from '../../../decisions/components/form/FormTitle';
import SearchBar from '../../../decisions/components/form/SearchBar';
import SubmitButton from '../../../decisions/components/form/SubmitButton';

import formStyles from '../../../../common/styles/Form.module.scss';
import styles from '../../../decisions/components/form/FormContainer.module.scss';
import classNames from 'classnames';

type FormContainerProps = {
  langcode: string,
  searchTriggered: boolean,
  triggerSearch: Function,
  t?: Function
};

type FormContainerState = {
  phrase: string,
};

class FormContainer extends React.Component<FormContainerProps, FormContainerState> {
  state: FormContainerState = {
    phrase: '',
  };

  searchBar = React.createRef<any>();

  handleSubmit = (event: any) => {
    if(event) {
      window.location.href = '/fi/asia?="' + encodeURIComponent(this.state.phrase) + '"';
      event.preventDefault();
    }
  };

  changePhrase = (value: any) => {
    this.setState({
      phrase: value
    });
  };

  render() {
    const { phrase } = this.state;

    let containerStyle: any = {};

    return(
      <div style={{background: '#f7f7f8'}}>
        <div
          className={classNames(
            formStyles.FormContainer,
            styles.FormContainer,
            'wrapper'
          )}
          style={containerStyle}
        >
          <FormTitle />
          <form className={classNames(
              formStyles.FormContainer__form,
              'container'
            )}
            onSubmit={this.handleSubmit}
          >
            <div className={formStyles['FormContainer__upper-fields']}>
              <SearchBar
                ref={this.searchBar}
                value={phrase}
                setValue={this.changePhrase}
                URLParams={false}
              />
              <SubmitButton
                type='desktop'
                disabled={false}
              />
            </div>

            <SubmitButton
              type='mobile'
              disabled={false}
            />
          </form>
        </div>
      </div>
    );
  }
};

export default withTranslation()(FormContainer);
