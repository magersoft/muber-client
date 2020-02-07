import React, { FunctionComponent } from 'react';
import style from './Button.module.scss';

interface IProps {
  label: string;
  onClick?: any;
  disabled?: boolean;
}

const Button: FunctionComponent<IProps> = ({ label, disabled = false, onClick }) =>
  <button disabled={disabled} onClick={onClick} className={style.Button}>{ label }</button>;

export default Button;
