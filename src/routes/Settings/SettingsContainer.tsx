import React, { FunctionComponent, useState } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import Helmet from 'react-helmet';
import Header from '../../components/Header';
import style from './Settings.module.scss';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { GET_PLACES, LOG_USER_OUT, USER_PROFILE } from '../../shared.queries';
import Place from '../../components/Place';
import { Button } from '@material-ui/core';

interface IProps extends RouteComponentProps {}

interface IUser {
  profilePhoto: string;
  fullName: string;
  email: string;
}

interface IPlace {
  id: number;
  name: string;
  isFavorite: boolean;
  address: string;
}

const SettingsContainer: FunctionComponent<IProps> = () => {
  const [user, setUser] = useState<IUser>({
    profilePhoto: '',
    fullName: '',
    email: ''
  });
  const [places, setPlaces] = useState<IPlace[]>([]);
  const { loading } = useQuery(USER_PROFILE, {
    onCompleted: data => {
      const { GetMyProfile: { user } } = data;
      if (user) {
        setUser({
          profilePhoto: user.profilePhoto,
          fullName: user.fullName,
          email: user.email
        });
      }
    }
  });
  const { loading: placesLoading } = useQuery(GET_PLACES, {
    onCompleted: data => {
      const { GetMyPlaces: { places } } = data;
      if (places.length) {
        setPlaces(places);
      }
    }
  });
  const [logUserOut] = useMutation(LOG_USER_OUT);

  return (
    <React.Fragment>
      <Helmet>
        <title>Settings | Muber</title>
      </Helmet>
      <Header title={'Account Settings'} backTo={'/'} />
      <div className={style.Settings}>
        <Link to={'/edit-account'} className={style.Grid}>
          <React.Fragment>
            <img src={user.profilePhoto} alt="" className={style.Image}/>
            <div>
              <span className={style.Key}>
                { user.fullName }
              </span>
              <span className={style.Key}>
                { user.email }
              </span>
            </div>
          </React.Fragment>
        </Link>
        { places.map(place => (
          <Place
            id={place.id}
            fav={place.isFavorite}
            name={place.name}
            address={place.address}
            key={place.id}
          />
        )) }
        <Link to={'/places'} className={style.SLink}>Go to Places</Link>
        <Button onClick={() => logUserOut()}>Log Out</Button>
      </div>
    </React.Fragment>
  )
};

export default SettingsContainer;
