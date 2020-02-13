import React, { FunctionComponent, useEffect, useState } from 'react';
import { geoCode, reverseGeoCode } from '../../utils/geocoder';
import MapSearchControl from '../MapSearchControl';
import { Map, Placemark, YMaps } from 'react-yandex-maps';
import { MAPS_APIKEY } from '../../apiKeys';
import style from './YandexMap.module.scss';
import Button from '../Button';
import { toast } from 'react-toastify';
import {
  Avatar,
  Backdrop,
  CircularProgress,
  Dialog, DialogActions,
  DialogContent,
  DialogTitle,
  Drawer,
  InputAdornment,
  TextField
} from '@material-ui/core';
import { WhereToVote, WhereToVoteOutlined } from '@material-ui/icons';
import { useMutation } from '@apollo/react-hooks';
import { REPORT_LOCATION } from '../../routes/Home/Home.query';
import CarImage from '../../images/carBlack.svg';

// Price for one km in ruble
const PRICE_FOR_ONE_KM = 12;

interface IDriver {
  id: number;
  lastLat: number;
  lastLng: number;
}

interface IRide {
  id: number;
  pickUpAddress: string;
  dropOffAddress: string;
  price: number;
  distance: number;
  duration: number;
  passenger: {
    fullName: string;
    profilePhoto: string;
  }
}

interface IProps {
  user?: {
    isDriving: boolean;
  };
  drivers?: IDriver[];
  isDriving?: boolean;
  isPickPlaceMap?: boolean;
  pickButton: {
    label: string;
    onClick?: any;
  },
  requestRide?: any;
  acceptRide?: any;
  findingDrivers?: boolean;
  nearbyRide?: IRide;
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
  drawer: boolean,
  distance?: number;
  duration?: number;
  price?: number;
}

const YandexMaps: FunctionComponent<IProps> = (
  {
    user,
    drivers,
    isDriving = false,
    isPickPlaceMap = false,
    pickButton,
    requestRide,
    acceptRide,
    findingDrivers= false,
    nearbyRide
  }) => {
  const [state, setState] = useState<IState>({
    center: [0, 0],
    zoom: 17,
    address: '',
    toAddress: '',
    searchingValue: '',
    geolocation: [0, 0],
    toGeolocation: [0, 0],
    isUserPickAddress: false,
    drawer: false,
    distance: void 0,
    duration: void 0,
    price: void 0
  });
  const [ymapsObj, setYmaps] = useState<any>({});
  const [map, setMap] = useState<any>({});
  const [route, setRoute] = useState<any>(null);
  const [mapLoading, setLoading] = useState<boolean>(true);

  const [reportLocation] = useMutation(REPORT_LOCATION);

  useEffect(() => {
    if (findingDrivers) {
      setState({ ...state, drawer: false });
    }
  }, [findingDrivers]);

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
  }, [drivers]);

  const handleGeoSuccess: PositionCallback = (position: Position): void => {
    const { coords: { latitude, longitude } } = position;
    getAddressFromCoordinates(latitude, longitude);
  };

  const handleGeoError: PositionErrorCallback = (): void => {
    console.warn('No Location!');
    return;
  };

  const handleGeoWatchSuccess: PositionCallback = (position: Position): void => {
    const { coords: { latitude, longitude } } = position;
    setState({
      ...state,
      center: [latitude, longitude],
      geolocation: [latitude, longitude]
    });
    reportLocation({
      variables: {
        lat: latitude,
        lng: longitude
      },
      update: (_, result: any) => {
        const { data: { ReportMovement } } = result;
        if (!ReportMovement.ok) {
          toast.error(ReportMovement.error)
        }
      }
    })
  };

  const handleGeoWatchError: PositionErrorCallback = (): void => {
    console.warn('Error watching you!');
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
        searchingValue: isPickPlaceMap ? address : ''
      })
    }
  };

  const getCoordinatesFromAddress = async (address: string): Promise<any> => {
    const [lng, lat]: any = await geoCode(address);
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
    if (user && !user.isDriving) {
      suggestView(ymaps);
    }
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
        mapStateAutoApply: true
      }).then(route => {
        setRoute(route);
        route.getPaths()
          .options.set({
            strokeColor: '000',
            opacity: 0.5
        });
        map.geoObjects.add(route);
        const distance = route.getLength();
        const duration = route.getTime();

        setState({
          ...state,
          duration,
          distance,
          price: setPrice(distance),
          drawer: true
        });
      }).catch(e => {
        console.error(e);
      });
    }

    if (pickButton.onClick) {
      pickButton.onClick(event, payload);
    }
  };

  const setPrice = (distance: number): number => {
    return Math.round((distance / 1000) * PRICE_FOR_ONE_KM);
  };

  const onRequestRide = event => {
    const { address, toAddress, geolocation, toGeolocation, duration, distance, price } = state;

    if (requestRide) {
      requestRide(event, {
        address,
        toAddress,
        geolocation,
        toGeolocation,
        duration,
        distance,
        price
      });
    }
  };

  const onAcceptRide = (event, rideId: number) => {
    if (acceptRide) {
      acceptRide(event, rideId);
    }
  };

  return (
    <div className={style.Map}>
      <YMaps
        query={{
          lang: 'en_US',
          apikey: MAPS_APIKEY
        }}
      >
        { !isDriving &&
          <React.Fragment>
            <MapSearchControl
              id="suggest"
              value={state.searchingValue}
              onChange={event => setState({ ...state, searchingValue: event.target.value })}
            />
            <Button
              label={pickButton.label}
              className={style.Button}
              onClick={handlePickButton}
              disabled={mapLoading || !state.isUserPickAddress || findingDrivers}
            />
          </React.Fragment>
        }
        { isPickPlaceMap &&
          <React.Fragment>
            <div className={style.Pin}>📍</div>
            <div className={style.Address}>{ state.address }</div>
          </React.Fragment>
        }
        { findingDrivers &&
          <div className={style.FindingDriver}>Finding a driver ...</div>
        }
        { isDriving && nearbyRide &&
          <Dialog aria-labelledby="customized-dialog-title" fullWidth open={isDriving}>
            <DialogTitle id="customized-dialog-title">
              New request a Ride
            </DialogTitle>
            <DialogContent dividers>
              <div>
                <h4>Pick Up Address</h4>
                <span>{ nearbyRide.pickUpAddress }</span>
              </div>
              <div>
                <h4>Drop Off Address</h4>
                <span>{ nearbyRide.dropOffAddress }</span>
              </div>
              <div>
                <h4>Price</h4>
                <span>{ nearbyRide.price }</span>
              </div>
              <div>
                <h4>Distance</h4>
                <span>{ nearbyRide.distance }</span>
              </div>
              <div>
                <h4>Duration</h4>
                <span>{ nearbyRide.duration }</span>
              </div>
              <div>
                <h4>Passenger</h4>
                <Avatar alt="Remy Sharp" src={nearbyRide.passenger.profilePhoto} className={style.Avatar} />
                <span>{ nearbyRide.passenger.fullName }</span>
              </div>
            </DialogContent>
            <DialogActions>
              <Button label="Accept Ride" onClick={(event) => onAcceptRide(event, nearbyRide.id)} />
            </DialogActions>
          </Dialog>
        }
        <Map
          state={{
            center: state.center,
            zoom: state.zoom
          }}
          onLoad={ymaps => loadMap(ymaps)}
          instanceRef={map => setMap(map)}
          onBoundsChange={onBoundsChange}
          modules={['SuggestView', 'route', 'templateLayoutFactory']}
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
              { !isDriving && drivers && drivers.map(driver => (
                <Placemark
                  key={driver.id}
                  geometry={[driver.lastLat, driver.lastLng]}
                  options={{
                    iconLayout: 'default#image',
                    iconImageHref: CarImage,
                    iconImageSize: [60, 33],
                    iconImageOffset: [-30, -17]
                  }}
                />
              )) }
            </React.Fragment>
          }
          <Drawer anchor="bottom" open={state.drawer} onClose={() => setState({ ...state, drawer: false })}>
            <div className={style.AboutRoute}>
              <TextField
                label="From Place"
                value={state.address}
                fullWidth
                disabled
                InputProps={{
                  startAdornment:
                    <InputAdornment position="start">
                      <WhereToVoteOutlined />
                    </InputAdornment>
                }}
              />
              <TextField
                label="To Place"
                value={state.toAddress}
                fullWidth
                disabled
                InputProps={{
                  startAdornment:
                    <InputAdornment position="start">
                      <WhereToVote />
                    </InputAdornment>
                }}
              />
              {
                (state.distance && state.duration && state.price) &&
                <div className={style.RoutePrice}>
                  <div>Distance: <span>{ Math.round(state.distance / 1000) } km</span></div>
                  <div>Duration: <span>{ Math.floor(state.duration / 60) } min</span></div>
                  <hr/>
                  <div className={style.Price}>{ state.price } ₽</div>
                </div>
              }
              <Button label="Request a ride" onClick={onRequestRide} />
            </div>
          </Drawer>
        </Map>
      </YMaps>
      <Backdrop className={style.Backdrop} open={mapLoading || findingDrivers} timeout={0}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  )
};

export default YandexMaps;
