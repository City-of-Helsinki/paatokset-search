import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button, Checkbox, IconAngleUp, IconAngleDown, IconMinus, IconCalendar, IconAngleLeft, SelectionGroup } from 'hds-react';
import { format, parse, subWeeks, subMonths, subYears } from 'date-fns';
import { useTranslation } from 'react-i18next';

import useOutsideClick from '../../../../../../hooks/useOutsideClick';
import DateInput from './DateInput';
import { FormErrors } from '../../../../types/types';
import { isValidDate } from '../../../../../../utils/Date';
import DatePicker from './DatePicker';
import './DateSelect.scss';

import classNames from 'classnames';

type Props = {
  setQuery: Function,
  errors: FormErrors,
  setErrors: Function,
  ariaControls?: string,
};

type Query = {
  query: {
    range: {
      meeting_date: {
        gte?: string,
        lte?: string
      }
    }
  }
}

const selections = {
  PAST_WEEK: 'PAST_WEEK',
  PAST_MONTH: 'PAST_MONTH',
  PAST_YEAR: 'PAST_YEAR'
};

const DateSelect = ({ ariaControls, errors, setErrors, setQuery }: Props) => {
  const [isActive, setActive] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement|null>(null);
  const [calendarActive, setCalendarActive] = useState<boolean>(false);
  const [selection, setSelection] = useState<string|undefined>(undefined);
  const [from, setFrom] = useState<any>(undefined);
  const [to, setTo] = useState<any>(undefined);
  const { t } = useTranslation();

  const handleSelectionClick = (selected: string) => {
    if(selection === selected) {
      setSelection(undefined);
      setFrom(undefined);
      setTo(undefined);

      return;
    }

    switch(selected) {
      case selections.PAST_WEEK:
        setTo(format(new Date(), 'd.M.y'));
        setFrom(format(subWeeks(new Date(), 1), 'd.M.y'));
      break;
      case selections.PAST_MONTH:
        setTo(format(new Date(), 'd.M.y'));
        setFrom(format(subMonths(new Date(), 1), 'd.M.y'));
      break;
      case selections.PAST_YEAR:
        setTo(format(new Date(), 'd.M.y'));
        setFrom(format(subYears(new Date(), 1), 'd.M.y'));
      break;
    }

    setSelection(selected)
  }

  const transformDate = (date: string) => {
    return format(parse(date, 'd.M.y', new Date()), 'yyyy-MM-dd');
  };

  const validateValues = useCallback(() =>  {
    const validateTo = () => {
      if(!to || !to.length) {
        return;
      }

      if(!isValidDate(to)) {
        return t('SEARCH:invalid-date');
      }
      if(isValidDate(from) && isValidDate(to)) {
        if(parse(from, 'd.M.y', new Date()) > parse (to, 'd.M.y', new Date())) {
          return t('SEARCH:to-less-than-from');
        }
      }
    }

    const validateFrom = () => {
      if(!from || !from.length) {
        return;
      }
  
      if(!isValidDate(from)) {
        return t('SEARCH:invalid-date');
      }
    }

    setErrors({
      from: validateFrom(),
      to: validateTo()
    });
  }, [t, from, setErrors, to]);

  const triggerQuery = useCallback(() => {
    if(from || to) {
      let query: Query = {
        query: {
          range: {
            meeting_date: {}
          }
        }
      };
  
      if(from && isValidDate(from) && !errors.from) {
        query.query.range.meeting_date.gte = transformDate(from);
      }

      if(to && isValidDate(to) && !errors.to) {
        query.query.range.meeting_date.lte = transformDate(to);
      }

      setQuery({
        query: query
      });
    }
    else {
      setQuery({
        query: null
      })
    }
  }, [from, to, errors.from, errors.to, setQuery]);

  useEffect(() => {
    validateValues();
  }, [from, to, validateValues])

  useEffect(() => {
    triggerQuery();
  }, [from, to, triggerQuery])

  useOutsideClick(ref, () => {
    setActive(false);
  });

  const getCollapsibleTitle = () => {
    if(calendarActive && isActive) {
      return <div className='DateSelect__title'><IconAngleLeft /><span>{t('DECISIONS:back')}</span></div>;
    }
    else if((from && isValidDate(from)) || (to && isValidDate(to))) {
      let titleString = (from && isValidDate(from)) ? from : '';
      titleString += (to && isValidDate(to)) ? ` - ${to}` : ' -';
      return (
        <div className='DateSelect__title'>{titleString}</div>
      );
    }
    else {
      return <div className='DateSelect__title DateSelect__title--default'><IconCalendar /><span>{t('DECISIONS:choose-date')}</span></div>;
    }
  }    

  const getHandle = () => {
    if(!calendarActive) {
      return isActive ? 
        <IconAngleUp /> :
        <IconAngleDown />;
    }
  }

  const handleControlClick = () => {
    if(calendarActive && isActive) {
      setCalendarActive(false);
    }
    else {
      setActive(!isActive);
    }
  }

  const renderField = () => (
    <React.Fragment>
      {calendarActive ?
        <div className='DateSelect__datepicker-wrapper'>
          <div className='DateSelect__datepicker-container'>
            <div className='DateSelect__date-fields-container'>
              <DateInput
                name='from'
                label={t('DECISIONS:start-date')}
                defaultValue={from}
                setDate={setFrom}
                error={errors.from}
                onChange={setFrom}
                autoFocus={true}
              />
              <IconMinus />
              <DateInput
                name='to'
                label={t('DECISIONS:end-date')}
                defaultValue={to}
                setDate={setTo}
                error={errors.to}
                onChange={setTo}
              />
            </div>
            <DatePicker
              from={from}
              to={to}
              setTo={setTo}
              setFrom={setFrom}
            />
          </div>
          <Button className='DateSelect__inner-control' onClick={() => setActive (false)}>
            {t('DECISIONS:close')}
          </Button>
        </div> :
        <div className="DateSelect__predefined-ranges-wrapper">
          <div className='DateSelect__predefined-ranges-container'>
            <SelectionGroup>
              <Checkbox
                id='past_week'
                label={t('DECISIONS:past-week')}
                name='past_week'
                checked={selection === selections.PAST_WEEK}
                onClick={() => handleSelectionClick(selections.PAST_WEEK)}
              />
              <Checkbox
                id='past_month'
                label={t('DECISIONS:past-month')}
                name='past_month'
                checked={selection === selections.PAST_MONTH}
                onClick={() => handleSelectionClick(selections.PAST_MONTH)}
              />
              <Checkbox
                id='past_year'
                label={t('DECISIONS:past-year')}
                name='past_year'
                checked={selection === selections.PAST_YEAR}
                onClick={() => handleSelectionClick(selections.PAST_YEAR)}
              />
            </SelectionGroup>
          </div>
          <Button className='DateSelect__inner-control' onClick={() => setCalendarActive(true)}>
            {t('DECISIONS:choose-range')}
          </Button>
        </div>
      }
    </React.Fragment>
  );

  return (
    <div className='DateSelect dateselect-wrapper form-element' ref={ref}>
      <button
        className={classNames(
          'DateSelect__collapsible-control',
          'collapsible-element',
          {'is-open': isActive}
        )}
        aria-controls={ariaControls}
        aria-expanded={isActive}
        onClick={handleControlClick}
      >
        <span className='DateSelect__collapsible-title'>{getCollapsibleTitle()}</span>
        <span className='DateSelect__collapsible-handle'>{getHandle()}</span>
      </button>
      {isActive &&
        <div className='DateSelect__collapsible-element collapsible-element--children'> 
          {renderField()}
        </div>
      }
    </div>
  );
}

export default DateSelect;
