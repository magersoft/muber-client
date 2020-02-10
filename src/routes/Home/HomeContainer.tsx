import React, { FunctionComponent, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import { USER_PROFILE } from '../../shared.queries';
import Helmet from 'react-helmet';
import Sidebar from 'react-sidebar';
import { YMaps, Map, Placemark, GeolocationControl } from 'react-yandex-maps';
import Menu from '../../components/Menu';
import MenuIcon from '@material-ui/icons/Menu';
import { IconButton } from '@material-ui/core';
import style from './Home.module.scss';
import { MAPS_APIKEY } from '../../apiKeys';

interface IProps extends RouteComponentProps<any> {}

interface IMaps {
  center: number[];
  zoom: number;
}

const HomeContainer: FunctionComponent<IProps> = () => {
  const [isMenuOpen, setMenuOpen] = useState<boolean>(false);
  const [mapState, setMapState] = useState<IMaps>({
    center: [0, 0],
    zoom: 17
  });
  const [geolocation, setGeolocation] = useState([0, 0]);

  const { loading, data } = useQuery(USER_PROFILE);

  useEffect(() => {
    const watchOptions: PositionOptions = {
      enableHighAccuracy: true
    };
    const watchMap = navigator.geolocation.watchPosition(handleGeoSuccess, handleGeoError);
    const watchMarker = navigator.geolocation.watchPosition(
      handleGeoWatchSuccess,
      handleGeoWatchError,
      watchOptions
    );

    return () => {
      navigator.geolocation.clearWatch(watchMap);
      navigator.geolocation.clearWatch(watchMarker);
    }
  }, [navigator.geolocation]);

  const toggleMenu = (): void => {
    setMenuOpen(!isMenuOpen);
  };

  const loadMap = ymaps => {};

  const handleGeoSuccess: PositionCallback = (position: Position) => {
    const { coords: { latitude, longitude } } = position;
    setMapState({
      ...mapState,
      center: [latitude, longitude]
    });
  };
  const handleGeoError: PositionErrorCallback = () => {
    console.log('No Location');
    return;

  };

  const handleGeoWatchSuccess = (position: Position) => {
    console.log(position);
    const { coords: { latitude, longitude } } = position;
    setGeolocation([latitude, longitude]);
  };
  const handleGeoWatchError = () => {
    console.log('Error watching you!')
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
          <YMaps
            query={{
              lang: 'en_US',
              apikey: MAPS_APIKEY
            }}
          >
            <IconButton onClick={toggleMenu} className={style.MenuIcon}>
              <MenuIcon />
            </IconButton>
            <Map
              state={mapState}
              onLoad={ymaps => loadMap(ymaps)}
              width={'100%'}
              height={'100%'}
            >
              <GeolocationControl
                options={{
                  position: { bottom: 150, right: 15 }
                }}
              />
              <Placemark
                geometry={geolocation}
                options={{
                  preset: 'islands#circleDotIcon',
                  iconColor: 'black'
                }}
              />
            </Map>
          </YMaps>
        </Sidebar>
      }
    </div>
  )
};

export default HomeContainer;
