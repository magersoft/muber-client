import React, { FunctionComponent, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import Helmet from 'react-helmet';
import Sidebar from 'react-sidebar';
import style from './Home.module.scss';
import Menu from '../../components/Menu';

interface IProps extends RouteComponentProps<any> {}

const HomeContainer: FunctionComponent<IProps> = () => {
  const [isMenuOpen, setMenuOpen] = useState<boolean>(false);

  const toggleMenu = (): void => {
    setMenuOpen(!isMenuOpen);
  };

  return (
    <div className={style.Home}>
      <Helmet>
        <title>Home | Muber</title>
      </Helmet>
      <Sidebar
        sidebar={<Menu />}
        open={isMenuOpen}
        onSetOpen={toggleMenu}
        styles={{
          sidebar: {
            backgroundColor: 'white',
            width: '80%',
            zIndex: '10'
          }
        }}
      >
        <button onClick={toggleMenu}>Open sidebar</button>
      </Sidebar>
    </div>
  )
};

export default HomeContainer;
