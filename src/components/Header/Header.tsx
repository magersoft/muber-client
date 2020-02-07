import React, { FunctionComponent } from 'react';
import BackArrow from '../BlackArrow';
import style from './Header.module.scss';

interface IProps {
  title: string;
  backTo?: string;
}

const Header: FunctionComponent<IProps> = ({ title, backTo }) => (
  <div className={style.Header}>
    { backTo && <BackArrow backTo={backTo} /> }
    <h2 className={style.Title}>{title}</h2>
  </div>
);

export default Header;
