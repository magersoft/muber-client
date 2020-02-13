import React, { FunctionComponent, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { USER_PROFILE } from '../../shared.queries';
import Helmet from 'react-helmet';
import Sidebar from 'react-sidebar';
import Menu from '../../components/Menu';
import MenuIcon from '@material-ui/icons/Menu';
import YandexMaps from '../../components/YandexMaps';
import { Backdrop, CircularProgress, IconButton } from '@material-ui/core';
import style from './Home.module.scss';
import { ACCEPT_RIDE, GET_NEARBY_DRIVERS, GET_NEARBY_RIDE, REQUEST_RIDE } from './Home.query';
import { acceptRide, requestRide } from '../../types/api';
import { toast } from 'react-toastify';

interface IProps extends RouteComponentProps<any> {}

interface IState {
  isMenuOpen: boolean;
  isDialogOpen: boolean;
  findingDriver: boolean;
}

const HomeContainer: FunctionComponent<IProps> = () => {
  const [state, setState] = useState<IState>({
    isMenuOpen: false,
    findingDriver: false,
    isDialogOpen: false
  });

  const { loading: loadingUser, data: userData } = useQuery(USER_PROFILE);

  const { loading: loadingDrivers, data: driversData } = useQuery(GET_NEARBY_DRIVERS, {
    skip: !userData,
    pollInterval: 2000
  });

  const { loading: loadingGetRide, data: rideData } = useQuery(GET_NEARBY_RIDE, {
    skip: !driversData
  });

  const [requestRide, { loading: loadingRide }] = useMutation(REQUEST_RIDE);
  const [acceptRide] = useMutation(ACCEPT_RIDE);

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
          setState({ ...state, findingDriver: true })
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
          toast.success('accept')
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
      { !loadingUser && userData.GetMyProfile.user &&
        <Sidebar
          sidebar={<Menu user={userData.GetMyProfile.user} />}
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
          { !loadingUser && !loadingDrivers && !loadingGetRide &&
            <YandexMaps
              user={userData.GetMyProfile.user}
              drivers={driversData.GetNearbyDrivers.drivers}
              isDriving={userData.GetMyProfile.user.isDriving}
              findingDrivers={state.findingDriver}
              nearbyRide={rideData.GetNearbyRide.ride}
              pickButton={{ label: 'Pick Address' }}
              requestRide={(event, payload) => handleRequestRide(event, payload)}
              acceptRide={handleAcceptRide}
            />
          }
        </Sidebar>
      }
      <Backdrop className={style.Backdrop} open={loadingUser || loadingDrivers || loadingRide || loadingGetRide} timeout={0}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  )
};

export default HomeContainer;
