import React, { FunctionComponent } from 'react';
import BackArrow from '../BlackArrow';
import { AppBar, Toolbar, Typography } from '@material-ui/core';
import style from './Header.module.scss';

interface IProps {
  title: string;
  backTo?: string;
}

const Header: FunctionComponent<IProps> = ({ title, backTo }) => (
  <AppBar position="relative">
    <Toolbar>
      { backTo && <BackArrow backTo={backTo} /> }
      <Typography variant="h6" className={style.Header}>
        { title }
      </Typography>
    </Toolbar>
  </AppBar>

);

export default Header;
