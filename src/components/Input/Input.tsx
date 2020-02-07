import React, { FunctionComponent } from 'react';
import style from './Input.module.scss';

interface IProps {
  placeholder?: string;
  type?: string;
  required?: boolean;
  name?: string;
  value: any;
  onChange: React.ChangeEventHandler<HTMLInputElement>
}

const Input: FunctionComponent<IProps> = (
  {
    placeholder = '',
    type = 'text',
    required= true,
    name = '',
    value,
    onChange
  }) => <input
    type={type}
    required={required}
    name={name}
    value={value}
    placeholder={placeholder}
    onChange={onChange}
    className={style.Input}
/>;

export default Input;
