import React, { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import style from './BlackArrow.module.scss';
import { IconButton } from '@material-ui/core';
import { ArrowBack } from '@material-ui/icons';

interface IProps {
  backTo: string;
  className?: string;
}

const BackArrow: FunctionComponent<IProps> = ({ backTo, className }) => (
  <div className={style.BlackArrow + ' ' + className}>
    <Link to={backTo}>
      <IconButton edge="start" color="inherit" aria-label="menu">
        <ArrowBack />
      </IconButton>
    </Link>
  </div>
);

export default BackArrow;
