import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import Helmet from 'react-helmet';
import style from './FindAddress.module.scss';

interface IState {
  lat: number
  lng: number
}

const FindAddress: FunctionComponent<any> = (props) => {
  let map: google.maps.Map;
  const mapRef: any = useRef();

  const [state, setState] = useState<IState>({
    lat: 0,
    lng: 0
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(handleGeoSuccess, handleGeoError);
  });

  const handleGeoSuccess = (position: Position) => {
    const { coords: { latitude, longitude } } = position;
    setState({
      lat: latitude,
      lng: longitude
    });
    loadMap(latitude, longitude)
  };

  const handleGeoError = () => {
    return;
  };

  const loadMap = (lat, lng) => {
    const { google } = props;
    const maps = google.maps;
    const mapNode = ReactDOM.findDOMNode(mapRef.current);
    const mapConfig: google.maps.MapOptions = {
      zoom: 14,
      center: {
        lat,
        lng
      },
      disableDefaultUI: true
    };
    map = new maps.Map(mapNode, mapConfig);
  };

  return (
    <div>
      <Helmet>
        <title>Find Address | Muber</title>
      </Helmet>
      <div className={style.Pin}>📍</div>
      <div className={style.Map} ref={mapRef} />
    </div>
  )
};

export default FindAddress;
