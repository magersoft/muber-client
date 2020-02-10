import React, { FunctionComponent } from 'react';
import style from './Button.module.scss';

interface IProps {
  label: string;
  onClick?: any;
  disabled?: boolean;
  className?: string;
}

const Button: FunctionComponent<IProps> = ({ label, disabled = false, onClick, className }) =>
  <button disabled={disabled} onClick={onClick} className={style.Button + ' ' + className}>{ label }</button>;

export default Button;
