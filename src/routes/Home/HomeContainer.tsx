import React, { FunctionComponent, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import { USER_PROFILE } from '../../shared.queries';
import Helmet from 'react-helmet';
import Sidebar from 'react-sidebar';
import Menu from '../../components/Menu';
import MenuIcon from '@material-ui/icons/Menu';
import YandexMaps from '../../components/YandexMaps';
import { Backdrop, CircularProgress, IconButton } from '@material-ui/core';
import style from './Home.module.scss';
import { GET_NEARBY_DRIVERS } from './Home.query';

interface IProps extends RouteComponentProps<any> {}

const HomeContainer: FunctionComponent<IProps> = () => {
  const [isMenuOpen, setMenuOpen] = useState<boolean>(false);

  const { loading: loadingUser, data: userData } = useQuery(USER_PROFILE);
  const { loading: loadingDrivers, data: driversData } = useQuery(GET_NEARBY_DRIVERS);

  const toggleMenu = (): void => {
    setMenuOpen(!isMenuOpen);
  };

  const handleLocation = (_, payload) => {
    console.log(payload);
  };

  return (
    <div className={style.Home}>
      <Helmet>
        <title>Home | Muber</title>
      </Helmet>
      { !loadingUser && userData.GetMyProfile.user &&
        <Sidebar
          sidebar={<Menu user={userData.GetMyProfile.user} />}
          open={isMenuOpen}
          onSetOpen={toggleMenu}
          styles={{
            sidebar: {
              backgroundColor: 'white',
              width: '80%',
              zIndex: '20'
            }
          }}
        >
          <IconButton onClick={toggleMenu} className={style.MenuIcon}>
            <MenuIcon />
          </IconButton>
          { !loadingDrivers && driversData.GetNearbyDrivers.drivers &&
            <YandexMaps
              user={userData.GetMyProfile.user}
              drivers={driversData.GetNearbyDrivers.drivers}
              pickButton={{ label: 'Pick Address' }}
              requestRide={(event, payload) => handleLocation(event, payload)}
            />
          }
        </Sidebar>
      }
      <Backdrop className={style.Backdrop} open={loadingUser || loadingDrivers} timeout={0}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  )
};

export default HomeContainer;
