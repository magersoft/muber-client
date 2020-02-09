import React, { FunctionComponent, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import Helmet from 'react-helmet';
import style from './Places.module.scss';
import { useQuery } from '@apollo/react-hooks';
import { GET_PLACES } from '../../shared.queries';
import Place from '../../components/Place';
import Header from '../../components/Header';
import { Fab } from '@material-ui/core';
import { Add } from '@material-ui/icons';

interface IProps extends RouteComponentProps {}

interface IPlace {
  id: number;
  name: string;
  address: string;
  isFavorite: boolean;
}

const PlacesContainer: FunctionComponent<IProps> = (props) => {
  const [places, setPlaces] = useState<IPlace[]>([]);
  const { loading } = useQuery(GET_PLACES, {
    onCompleted: data => {
      const { GetMyPlaces: { places } } = data;
      if (places) {
        setPlaces(places);
      }
    }
  });

  return (
    <React.Fragment>
      <Helmet>
        <title>Places | Muber</title>
      </Helmet>
      <Header title={'Places'} backTo={'/'} />
      { !loading && places &&
        <div className={style.AddPlaceButton}>
          <Fab color="secondary" aria-label="add" onClick={() => props.history.push('/add-place')}>
            <Add />
          </Fab>
        </div>
      }
      <div className={style.Places}>
        { !loading && !places.length &&
          <React.Fragment>
            <h3>You have no places!</h3>
            <p>Click action button some adding places</p>
          </React.Fragment>
        }
        { !loading && places.length && places.map(place => (
          <Place
            id={place.id}
            fav={place.isFavorite}
            name={place.name}
            address={place.address}
            key={place.id}
          />
        )) }
      </div>
    </React.Fragment>
  )
};

export default PlacesContainer;
