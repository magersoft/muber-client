import React, { FunctionComponent, useEffect, useState } from 'react';
import Helmet from 'react-helmet';
import { YMaps, Map, GeolocationControl } from 'react-yandex-maps';
import style from './FindAddress.module.scss';
import { MAPS_APIKEY } from '../../apiKeys';
import { geoCode, reverseGeoCode } from '../../utils/geocoder';
import MapSearchControl from '../../components/MapSearchControl';
import Button from '../../components/Button';
import { RouteComponentProps } from 'react-router-dom';

interface IProps extends RouteComponentProps<any> {}

interface IMaps {
  center: number[];
  zoom: number
}

interface IState {
  address: string;
  searchingValue: string;
}

const FindAddress: FunctionComponent<IProps> = (props) => {
  const [mapState, setMapState] = useState<IMaps>({
    center: [0, 0],
    zoom: 17
  });
  const [state, setState] = useState<IState>({
    address: '',
    searchingValue: ''
  });
  const [instanceMap, setInstanceMap] = useState<any>({});


  useEffect(() => {
    navigator.geolocation.getCurrentPosition(handleGeoSuccess, handleGeoError);
  }, [navigator.geolocation]);

  const handleGeoSuccess: PositionCallback = (position: Position) => {
    console.log(position);
    const { coords: { latitude, longitude } } = position;
    setMapState({
      ...mapState,
      center: [latitude, longitude]
    });
    getAddressFromCoordinates(latitude, longitude);
  };

  const handleGeoError: PositionErrorCallback = () => {
    console.log('No Location');
    return;
  };

  const loadMap = ymaps => {
    const suggestView = new ymaps.SuggestView('suggest', { results: 3 });
    suggestView.events.add('select', event => {
      const item = event.get('item');
      const { value } = item;
      getCoordinatesFromAddress(value);
    });
  };

  const onBoundsChange = () => {
    const [lat, lng] = instanceMap.getCenter();
    setMapState({ ...mapState, center: [lat, lng] });
    getAddressFromCoordinates(lat, lng);
  };

  const getAddressFromCoordinates = async (lat: number, lng: number) => {
    const address = await reverseGeoCode(lat, lng);
    if (address) {
      setState({ ...state, address, searchingValue: address });
    }
  };

  const getCoordinatesFromAddress = async (address: string) => {
    const [lng, lat] = await geoCode(address);
    if (lat && lng) {
      setMapState({ ...mapState, center: [lat, lng]  })
    }
  };

  const pickThisPlace = () => {
    const { address } = state;
    const [lat, lng] = mapState.center;
    const { history } = props;
    history.push({
      pathname: '/add-place',
      state: {
        address,
        lat, lng
      }
    });
  };

  return (
    <div className={style.Map}>
      <Helmet>
        <title>Find Address | Muber</title>
      </Helmet>
        <YMaps
          query={{
            lang: 'en_US',
            apikey: MAPS_APIKEY
          }}
        >
          <MapSearchControl
            id="suggest"
            value={state.searchingValue}
            onChange={event => setState({ ...state, searchingValue: event.target.value })}
          />
          <div className={style.Pin}>📍</div>
          <div className={style.Address}>{ state.address }</div>
          <Button label="Pick this Place" className={style.Button} onClick={pickThisPlace} />
          <Map
            state={mapState}
            onLoad={ymaps => loadMap(ymaps)}
            instanceRef={map => setInstanceMap(map)}
            onBoundsChange={onBoundsChange}
            modules={['SuggestView', 'Event']}
            width={'100%'}
            height={'100%'}
          >
            <GeolocationControl
              options={{
                position: { bottom: 150, right: 15 }
              }}
            />
          </Map>
        </YMaps>
      </div>
  )
};

export default FindAddress;
