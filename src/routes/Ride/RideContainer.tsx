import React, { FunctionComponent, useEffect, useState } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { GET_RIDE, SUBSCRIBE_RIDE_STATUS, UPDATE_RIDE_STATUS } from './Ride.query';
import style from './Ride.module.scss'
import { Avatar, Backdrop, CircularProgress } from '@material-ui/core';
import { getRide, getRide_GetRide_ride, updateRide, updateRideVariables } from '../../types/api';
import { distancePipe, durationPipe } from '../../utils/pipes';
import Button from '../../components/Button';
import { IUser, UserDataResponse } from '../../types/local';
import { USER_PROFILE } from '../../shared.queries';
import { toast } from 'react-toastify';

interface IProps extends RouteComponentProps<any> {}

const RideContainer: FunctionComponent<IProps> = ({ match, history }) => {
  const [user, setUser] = useState<IUser|any>(null);
  const [ride, setRide] = useState<getRide_GetRide_ride|null>(null);

  useEffect(() => {
    if (!match.params.rideId) {
      history.push('/');
    }
  }, [match]);

  const { loading: loadingRide, data: rideData, subscribeToMore: rideSubscription } = useQuery<getRide|any>(GET_RIDE, {
    variables: {
      rideId: +match.params.rideId
    },
    onCompleted: data => {
      const { GetRide } = data;
      if (GetRide.ok) {
        rideSubscription({
          document: SUBSCRIBE_RIDE_STATUS,
          updateQuery: (prev, { subscriptionData }: any) => {
            if (!subscriptionData.data) {
              return prev;
            }
            const { data: { RideStatusSubscription: { status } } } = subscriptionData;
            if (status === 'FINISHED') {
              window.location.href = '/'
            }
          }
        })
      } else {
        toast.error(GetRide.error);
      }
    }
  });

  useEffect(() => {
    if (rideData && rideData.GetRide) {
      setRide(rideData.GetRide.ride)
    }
  }, [rideData]);

  const { loading: loadingUser, data: userData } = useQuery<UserDataResponse>(USER_PROFILE);

  useEffect(() => {
    if (userData && userData.GetMyProfile) {
      setUser(userData.GetMyProfile.user);
    }
  }, [userData]);

  const [updateRide] = useMutation<updateRide, updateRideVariables>(UPDATE_RIDE_STATUS);

  const handleUpdateRideStatus = ({ rideId, status }): void => {
    updateRide({
      variables: {
        rideId,
        status
      },
      refetchQueries: [{ query: GET_RIDE, variables: { rideId } }]
    })
  };

  return (
    <React.Fragment>
      { ride && user &&
        <div className={style.Ride}>
          <div>
            <h4>Passenger</h4>
            <div className={style.Passenger}>
              { ride.passenger.profilePhoto &&
                <Avatar alt="Remy Sharp" src={ride.passenger.profilePhoto} className={style.Avatar} />
              }
              <span>{ ride.passenger.fullName }</span>
            </div>
          </div>
          <div>
            <h4>Driver</h4>
            <div className={style.Passenger}>
              { ride.driver.profilePhoto &&
              <Avatar alt="Remy Sharp" src={ride.driver.profilePhoto} className={style.Avatar} />
              }
              <span>{ ride.driver.fullName }</span>
            </div>
          </div>
          <div>
            <h4>From</h4>
            <span>{ ride.pickUpAddress }</span>
          </div>
          <div>
            <h4>To</h4>
            <span>{ ride.dropOffAddress }</span>
          </div>
          <div>
            <h4>Price</h4>
            <span>{ ride.price }</span>
          </div>
          <div>
            <h4>Distance</h4>
            <span>{ distancePipe(ride.distance) }</span>
          </div>
          <div>
            <h4>Duration</h4>
            <span>{ durationPipe(ride.duration) }</span>
          </div>
          <div>
            <h4>Status</h4>
            <span>{ ride.status }</span>
          </div>
          <div className={style.Buttons}>
            { ride.driver.id === user.id &&
              ride.status === 'ACCEPTED' && (
              <Button label="Picked Up" onClick={() => handleUpdateRideStatus({
                rideId: ride.id,
                status: 'ONROUTE'
              })} />
            )}
            { ride.driver.id === user.id &&
              ride.status === 'ONROUTE' && (
              <Button label="Finished" onClick={() => handleUpdateRideStatus({
                rideId: ride.id,
                status: 'FINISHED'
              })} />
            )}
            { ride.status !== 'REQUESTING' && (
              <Link to={{ pathname: `/chat/${ride.chatId}`, state: { rideId: ride.id } }}>
                <Button
                  label={
                    ride.driver.id === user.id ? 'Chat with Passenger' : 'Chat with Driver'
                  }
                />
              </Link>
            )}
          </div>
        </div>
      }
      <Backdrop className={style.Backdrop} open={loadingRide || loadingUser} timeout={0}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </React.Fragment>
  )
};

export default RideContainer;
