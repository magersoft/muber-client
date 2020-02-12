import React, { FunctionComponent, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import { USER_PROFILE } from '../../shared.queries';
import Helmet from 'react-helmet';
import Sidebar from 'react-sidebar';
import Menu from '../../components/Menu';
import MenuIcon from '@material-ui/icons/Menu';
import YandexMaps from '../../components/YandexMaps';
import { IconButton } from '@material-ui/core';
import style from './Home.module.scss';

interface IProps extends RouteComponentProps<any> {}

const HomeContainer: FunctionComponent<IProps> = () => {
  const [isMenuOpen, setMenuOpen] = useState<boolean>(false);

  const { loading, data } = useQuery(USER_PROFILE);

  const toggleMenu = (): void => {
    setMenuOpen(!isMenuOpen);
  };

  return (
    <div className={style.Home}>
      <Helmet>
        <title>Home | Muber</title>
      </Helmet>
      { !loading && data.GetMyProfile.user &&
        <Sidebar
          sidebar={<Menu user={data.GetMyProfile.user} />}
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
          <IconButton onClick={toggleMenu} className={style.MenuIcon}>
            <MenuIcon />
          </IconButton>
          <YandexMaps
            pickButton={{
              label: 'Pick Address',
              onClick: null
            }}
          />
        </Sidebar>
      }
    </div>
  )
};

export default HomeContainer;
