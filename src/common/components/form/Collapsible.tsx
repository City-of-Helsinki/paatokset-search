import React, { useRef, useState } from 'react';
import { IconAngleDown, IconAngleUp } from 'hds-react';

import '../../../hooks/useOutsideClick';
import './Collapsible.scss';
import useOutsideClick from '../../../hooks/useOutsideClick';

type Props = {
  title: string,
  children: React.ReactNode
}

const Collapsible = ({title, children}: Props) => {
  const [isActive, setActive] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement|null>(null);

  useOutsideClick(ref, () => {
    setActive(false);
  });

  return (
    <div className='Collapsible collapsible-wrapper' ref={ref}>
      <div className='collapsible__element collapsible-container' onClick={() => setActive(!isActive)}>
        <div className='collapsible__title'>{ title }</div>
        {isActive ?
          <IconAngleUp /> :
          <IconAngleDown />
        }
      </div>
      {isActive &&
        <div className='collapsible__element collapsible__element--children'>
          {children}
        </div>
      }
    </div>
  );
}; 

export default Collapsible;
