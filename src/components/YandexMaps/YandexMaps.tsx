import React, { FunctionComponent, useCallback, useEffect, useState } from 'react';
import { geoCode, reverseGeoCode } from '../../utils/geocoder';
import MapSearchControl from '../MapSearchControl';
import { GeolocationControl, Map, Placemark, YMaps } from 'react-yandex-maps';
import { MAPS_APIKEY } from '../../apiKeys';
import style from './YandexMap.module.scss';
import Button from '../Button';

interface IProps {
  isPickPlaceMap?: boolean;
  pickButton: {
    label: string;
    onClick: any;
  }
}

interface IState {
  center: number[];
  zoom: number;
  address: string;
  searchingValue: string;
  geolocation: number[];
}

const YandexMaps: FunctionComponent<IProps> = (
  {
    isPickPlaceMap = false,
    pickButton
  }) => {
  const [state, setState] = useState<IState>({
    center: [0, 0],
    zoom: 17,
    address: '',
    searchingValue: '',
    geolocation: [0, 0]
  });
  const [map, setMap] = useState<any>({});

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(handleGeoSuccess, handleGeoError);

    if (!isPickPlaceMap) {
      const watchOptions: PositionOptions = {
        enableHighAccuracy: true
      };
      const watch = navigator.geolocation.watchPosition(handleGeoWatchSuccess, handleGeoWatchError, watchOptions);

      return () => {
        navigator.geolocation.clearWatch(watch);
      }
    }
  }, []);

  const handleGeoSuccess: PositionCallback = (position: Position): void => {
    const { coords: { latitude, longitude } } = position;
    getAddressFromCoordinates(latitude, longitude);
  };

  const handleGeoError: PositionErrorCallback = (): void => {
    console.log('No Location!');
    return;
  };

  const handleGeoWatchSuccess: PositionCallback = (position: Position): void => {
    const { coords: { latitude, longitude } } = position;
    setState({
      ...state,
      center: [latitude, longitude],
      geolocation: [latitude, longitude]
    });
  };

  const handleGeoWatchError: PositionErrorCallback = (): void => {
    console.log('Error watching you!');
    return;
  };

  const getAddressFromCoordinates = async (lat: number, lng: number): Promise<void> => {
    const address = await reverseGeoCode(lat, lng);
    if (address) {
      setState({
        ...state,
        center: [lat, lng],
        geolocation: [lat, lng],
        address,
        searchingValue: address
      })
    }
  };

  const getCoordinatesFromAddress = async (address: string): Promise<void> => {
    const [lng, lat] = await geoCode(address);
    if (lat && lng) {
      setState({
        ...state,
        center: [lat, lng]
      })
    }
  };

  const loadMap = (ymaps) => {
    const suggestView = new ymaps.SuggestView('suggest', { result: 3 });
    suggestView.events.add('select', event => {
      const item = event.get('item');
      const { value } = item;
      getCoordinatesFromAddress(value);
    })
  };

  const onBoundsChange = (): void => {
    if (!isPickPlaceMap) {
      return;
    }
    const [lat, lng] = map.getCenter();
    setState({
      ...state,
      center: [lat, lng]
    });
    getAddressFromCoordinates(lat, lng);
  };

  const handlePickButton = event => {
    const { address, center: [lat, lng] } = state;
    const payload = { address, lat, lng };
    pickButton.onClick(event, payload);
  };

  return (
    <div className={style.Map}>
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
        { isPickPlaceMap &&
          <React.Fragment>
            <div className={style.Pin}>📍</div>
            <div className={style.Address}>{ state.address }</div>
          </React.Fragment>
        }
        <Button label={pickButton.label} className={style.Button} onClick={handlePickButton} />
        <Map
          state={{
            center: state.center,
            zoom: state.zoom
          }}
          onLoad={ymaps => loadMap(ymaps)}
          instanceRef={map => setMap(map)}
          onBoundsChange={onBoundsChange}
          modules={['SuggestView', 'Event']}
          width={'100%'}
          height={'100%'}
        >
          { !isPickPlaceMap &&
            <Placemark
              geometry={state.geolocation}
              options={{
                preset: 'islands#circleDotIcon',
                iconColor: 'black'
              }}
            />
          }
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

export default YandexMaps;
