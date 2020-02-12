import React, { FunctionComponent, useEffect, useState } from 'react';
import { geoCode, reverseGeoCode } from '../../utils/geocoder';
import MapSearchControl from '../MapSearchControl';
import { GeolocationControl, Map, Placemark, YMaps } from 'react-yandex-maps';
import { MAPS_APIKEY } from '../../apiKeys';
import style from './YandexMap.module.scss';
import Button from '../Button';
import { toast } from 'react-toastify';

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
  toAddress: string;
  searchingValue: string;
  geolocation: number[];
  toGeolocation: number[];
  isUserPickAddress: boolean;
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
    toAddress: '',
    searchingValue: '',
    geolocation: [0, 0],
    toGeolocation: [0, 0],
    isUserPickAddress: false
  });
  const [ymapsObj, setYmaps] = useState<any>({});
  const [map, setMap] = useState<any>({});
  const [route, setRoute] = useState<any>(null);
  const [mapLoading, setLoading] = useState<boolean>(true);

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

  const getCoordinatesFromAddress = async (address: string): Promise<any> => {
    const [lng, lat] = await geoCode(address);
    if (lat && lng) {
      setState({
        ...state,
        center: [lat, lng]
      });
    }

    return [lat, lng]
  };

  const loadMap = ymaps => {
    setYmaps(ymaps);
    suggestView(ymaps);
    createRoute(ymaps);
    ymaps.ready(() => {
      setLoading(false);
      if (isPickPlaceMap) {
        setState({ ...state, isUserPickAddress: true })
      }
    });
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

  const suggestView = ymaps => {
    const suggestView = new ymaps.SuggestView('suggest', { result: 3 });
    suggestView.events.add('select', async event => {
      setLoading(true);
      const item = event.get('item');
      const { value } = item;
      try {
        const [lat, lng] = await getCoordinatesFromAddress(value);
        pickUserPlaceMarker(lat, lng);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    })
  };

  const createRoute = ymaps => {
    ymaps.route(
      [
        [0,0], [0,0]
      ]
    ).then(route => {
      map.geoObjects.add(route);
    })
  };

  const pickUserPlaceMarker = async (lat: number, lng: number): Promise<void> => {
    if (isPickPlaceMap) {
      return;
    }
    setLoading(true);
    const [geoLat, geoLng] = state.geolocation;
    try {
      const toAddress = await reverseGeoCode(lat, lng);
      if (geoLat !== lat && geoLng !== lng) {
        setState({
          ...state,
          center: [lat, lng],
          toGeolocation: [lat, lng],
          toAddress: toAddress,
          searchingValue: toAddress,
          isUserPickAddress: true
        });
      } else {
        toast.info('You are here')
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handlePickButton = event => {
    const { address, center: [lat, lng], geolocation, toGeolocation } = state;
    const payload = { address, lat, lng };

    if (!isPickPlaceMap) {
      map.setBounds([toGeolocation, geolocation], {
        checkZoomRange: true,
        duration: 1000
      });
      if (route) {
        map.geoObjects.remove(route);
      }
      ymapsObj.route([geolocation, toGeolocation], {
        mapStateAutoApply: true,
        multiRoute: true
      }).then(route => {
        setRoute(route);
        map.geoObjects.add(route);
      });
    }

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
        <Button
          label={pickButton.label}
          className={style.Button}
          onClick={handlePickButton}
          disabled={mapLoading || !state.isUserPickAddress}
        />
        <Map
          state={{
            center: state.center,
            zoom: state.zoom
          }}
          onLoad={ymaps => loadMap(ymaps)}
          instanceRef={map => setMap(map)}
          onBoundsChange={onBoundsChange}
          modules={['SuggestView', 'route']}
          width={'100%'}
          height={'100%'}
        >
          { !isPickPlaceMap &&
            <React.Fragment>
              <Placemark
                geometry={state.geolocation}
                options={{
                  preset: 'islands#circleDotIcon',
                  iconColor: 'black'
                }}
              />
              { state.isUserPickAddress &&
                <Placemark
                  geometry={state.toGeolocation}
                  options={{
                    iconColor: 'red'
                  }}
                />
              }
            </React.Fragment>
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
