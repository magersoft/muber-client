import React, { FunctionComponent, useState } from 'react';
import style from './MapSearchControl.module.scss';

interface IProps {
  id: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const MapSearchControl: FunctionComponent<IProps> = ({ id, value, onChange}) => {
  return (
    <div className={style.SearchControl}>
      <input
        id={id}
        type="text"
        value={value}
        onChange={onChange}
        placeholder="Type Address"
        className={style.Input}
      />
    </div>
  )
};

export default MapSearchControl;
