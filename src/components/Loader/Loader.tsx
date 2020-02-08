import React, { FunctionComponent } from 'react';
import style from './Loader.module.scss';

type LoaderColor = 'primary' | 'secondary' | 'light' | 'dark'

interface IProps {
  color?: LoaderColor
  className?: string
}

const Loader: FunctionComponent<IProps> = ({ color = 'light', className }) =>
  <div className={`${style.Loader} ${style[color]} ${className}`}><div/><div/></div>;

export default Loader;
