import React, { FunctionComponent, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { useMutation, useQuery, useSubscription } from '@apollo/react-hooks';
import { USER_PROFILE } from '../../shared.queries';
import Helmet from 'react-helmet';
import Sidebar from 'react-sidebar';
import Menu from '../../components/Menu';
import MenuIcon from '@material-ui/icons/Menu';
import YandexMaps from '../../components/YandexMaps';
import { Backdrop, CircularProgress, IconButton } from '@material-ui/core';
import style from './Home.module.scss';
import { ACCEPT_RIDE, GET_NEARBY_DRIVERS, GET_NEARBY_RIDE, REQUEST_RIDE, SUBSCRIBE_NEARBY_RIDES } from './Home.query';
import {
  acceptRide, acceptRideVariables, getNearbyDrivers,
  getNearbyDrivers_GetNearbyDrivers_drivers, getNearbyRides,
  getNearbyRides_GetNearbyRide_ride,
  requestRide, requestRideVariables, rideStatus
} from '../../types/api';
import { toast } from 'react-toastify';
import { IUser, UserDataResponse } from '../../types/local';
import { SUBSCRIBE_RIDE_STATUS } from '../Ride/Ride.query';

interface IProps extends RouteComponentProps<any> {}

interface IState {
  isMenuOpen: boolean;
  isDialogOpen: boolean;
  findingDriver: boolean;
}

const HomeContainer: FunctionComponent<IProps> = (props) => {
  const [state, setState] = useState<IState>({
    isMenuOpen: false,
    findingDriver: false,
    isDialogOpen: false
  });
  const [user, setUser] = useState<IUser|any>(null);
  const [drivers, setDrivers] = useState<(getNearbyDrivers_GetNearbyDrivers_drivers | null)[]|null>(null);
  const [ride, setRide] = useState<getNearbyRides_GetNearbyRide_ride|null>(null);
  const [isDriving, setDriving] = useState<boolean>(false);
  const [rideId, setRideId] = useState<number|null>(null);

  const { loading: loadingUser, data: userData } = useQuery<UserDataResponse>(USER_PROFILE);
  useEffect(() => {
    if (userData && userData.GetMyProfile) {
      const { user } = userData.GetMyProfile;
      if (user) {
        setUser(user);
        if (user.isDriving) {
          setDriving(user.isDriving);
        }
      }
    }
  }, [userData]);

  const { loading: loadingDrivers, data: driversData } = useQuery<getNearbyDrivers>(GET_NEARBY_DRIVERS, {
    skip: !userData,
    pollInterval: 2000
  });
  useEffect(() => {
    if (driversData && driversData.GetNearbyDrivers) {
      const { drivers } = driversData.GetNearbyDrivers;
      if (drivers) {
        setDrivers(drivers)
      }
    }
  }, [driversData]);

  const {
    loading: loadingGetRide,
    data: rideData,
    subscribeToMore: rideSubscription
  } = useQuery<getNearbyRides>(GET_NEARBY_RIDE, {
    skip: !isDriving,
    onCompleted: data => {
      const { GetNearbyRide } = data;
      if (GetNearbyRide.ok) {
        rideSubscription({
          document: SUBSCRIBE_NEARBY_RIDES,
          updateQuery: (prev, { subscriptionData }: any) => {
            if (!subscriptionData.data) {
              return prev;
            }
            return Object.assign({}, prev, {
              GetNearbyRide: {
                ...prev.GetNearbyRide,
                ride: subscriptionData.data.NearbyRideSubscription
              }
            });
          }
        });
      } else {
        toast.error(GetNearbyRide.error);
      }
    }
  });
  useEffect(() => {
    if (rideData && rideData.GetNearbyRide) {
      const { ride } = rideData.GetNearbyRide;
      if (ride) {
        setRide(ride);
      }
    }
  }, [rideData, rideSubscription, loadingGetRide]);

  const [requestRide, { loading: loadingRide }] = useMutation<requestRide, requestRideVariables>(REQUEST_RIDE);
  const [acceptRide] = useMutation<acceptRide, acceptRideVariables>(ACCEPT_RIDE);

  const { loading: loadingRideStatus } = useSubscription<rideStatus>(SUBSCRIBE_RIDE_STATUS, {
    variables: {
      rideId: rideId
    },
    onSubscriptionData: ({ subscriptionData }) => {
      if (!subscriptionData.data) {
        return
      }

      if (rideId) {
        const { RideStatusSubscription } = subscriptionData.data;
        if (RideStatusSubscription) {
          if (RideStatusSubscription.id === rideId) {
            if (RideStatusSubscription.status === 'ACCEPTED') {
              props.history.push(`/ride/${RideStatusSubscription.id}`);
            }
          }
        }
      }
    }
  });

  const toggleMenu = (): void => {
    setState({ ...state, isMenuOpen: !state.isMenuOpen })
  };

  const handleRequestRide = (_, payload) => {
    const { address: pickUpAddress, toAddress: dropOffAddress, geolocation, toGeolocation, duration, distance, price } = payload;
    const [pickUpLat, pickUpLng] = geolocation;
    const [dropOffLat, dropOffLng] = toGeolocation;
    requestRide({
      variables: {
        pickUpAddress,
        pickUpLat,
        pickUpLng,
        dropOffAddress,
        dropOffLat,
        dropOffLng,
        price,
        distance,
        duration
      },
      update: (_, result: any) => {
        const data: requestRide = result.data;
        const { RequestRide } = data;
        if (RequestRide.ok) {
          setState({ ...state, findingDriver: true });
          if (RequestRide.ride) {
            setRideId(RequestRide.ride.id);
          }
        } else {
          toast.error(RequestRide.error);
        }
      }
    })
  };

  const handleAcceptRide = (_, rideId) => {
    acceptRide({
      variables: {
        rideId
      },
      update: (_, result: any) => {
        const data: acceptRide = result.data;
        const { UpdateRideStatus } = data;
        if (UpdateRideStatus.ok) {
          const { history } = props;
          history.push({
            pathname: `/ride/${UpdateRideStatus.rideId}`,
            state: {
              rideId
            }
          })
        } else {
          toast.error(UpdateRideStatus.error)
        }
      }
    });
  };

  return (
    <div className={style.Home}>
      <Helmet>
        <title>Home | Muber</title>
      </Helmet>
      { !loadingUser && user &&
        <Sidebar
          sidebar={<Menu user={user} />}
          open={state.isMenuOpen}
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
          { user && drivers &&
            <YandexMaps
              user={user}
              drivers={drivers}
              isDriving={isDriving}
              findingDrivers={state.findingDriver}
              nearbyRide={ride}
              pickButton={{ label: 'Pick Address' }}
              requestRide={(event, payload) => handleRequestRide(event, payload)}
              acceptRide={handleAcceptRide}
            />
          }
        </Sidebar>
      }
      <Backdrop
        className={style.Backdrop}
        open={
          loadingUser ||
          loadingDrivers ||
          loadingRide ||
          loadingGetRide ||
          loadingRideStatus
        }
        timeout={0}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  )
};

export default HomeContainer;
