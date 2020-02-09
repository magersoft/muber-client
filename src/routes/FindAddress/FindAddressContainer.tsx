import React, { FunctionComponent, useEffect, useState } from 'react';
import Helmet from 'react-helmet';
import { YMaps, Map } from 'react-yandex-maps';
import style from './FindAddress.module.scss';

interface IMaps {
  center: number[];
  zoom: number
}

const FindAddress: FunctionComponent<any> = (props) => {
  const [state, setState] = useState<IMaps>({
    center: [0, 0],
    zoom: 14
  });
  const [map, setMap] = useState<any>({});

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(handleGeoSuccess, handleGeoError);
  }, [navigator.geolocation]);

  const handleGeoSuccess = (position: Position) => {
    const { coords: { latitude, longitude } } = position;
    setState({
      ...state,
      center: [latitude, longitude]
    });
  };

  const handleGeoError = () => {
    return;
  };

  const onBoundsChange = () => {
    setState({ ...state, center: map.getCenter() });
    console.log(state.center);
  };

  return (
    <div className={style.Map}>
      <Helmet>
        <title>Find Address | Muber</title>
      </Helmet>
        <YMaps
          query={{
            lang: 'en_US',
            apikey: '963d0e32-6ea5-47a6-80f1-9ab4f6571ca3'
          }}
        >
          <div className={style.Pin}>📍</div>
          <Map
            state={state}
            instanceRef={map => setMap(map)}
            onBoundsChange={onBoundsChange}
            width={'100%'}
            height={'100%'}
          />
        </YMaps>
      </div>
  )
};

export default FindAddress;
