import React, { FunctionComponent } from 'react';
import style from './Input.module.scss';

interface IProps {
  placeholder?: string;
  type?: string;
  required?: boolean;
  disabled?: boolean;
  name?: string;
  value: any;
  onChange: React.ChangeEventHandler<HTMLInputElement>
  className?: string,
}

const Input: FunctionComponent<IProps> = (
  {
    placeholder = '',
    type = 'text',
    required= true,
    disabled = false,
    name = '',
    value,
    onChange,
    className
  }) => <input
    type={type}
    required={required}
    name={name}
    value={value}
    placeholder={placeholder}
    disabled={disabled}
    onChange={onChange}
    className={style.Input + ' ' + className}
/>;

export default Input;
