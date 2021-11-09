import React, { useState } from 'react';
import { Button, DateInput } from 'hds-react';

import Collapsible from '../../../../common/components/form/Collapsible';
import './DateSelect.scss';
import 'react-day-picker/lib/style.css';

const DateSelect = () => {
  // const [startDate, setStartDate] = useState<any>(undefined);
  // const [endDate, setEndDate] = useState<any>(undefined);
  const [calendarActive, setCalendarActive] = useState<boolean>(false);

  return (
    <Collapsible title='DateSelect'>
      {
        calendarActive ?
          <div className="DateSelect__datepicker-container form-element">
            <DateInput
              helperText="Use format D.M.YYYY"
              id="date"
              initialMonth={new Date()}
              label="Choose a date"
              language="en"
              onChange={function noRefCheck(){}}
              required
            />
            <Button onClick={() => setCalendarActive(false)}>
              Sulje
            </Button>
          </div> :
          <div className='DateSelect__predefined-ranges-container'>
            <Button onClick={() => setCalendarActive(true)}>
              Valitse päivämäärät
            </Button>
          </div>
      }

    </Collapsible>
  )
}

export default DateSelect;
