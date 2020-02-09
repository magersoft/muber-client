import React, { FunctionComponent, useState } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import Helmet from 'react-helmet';
import style from './AddPlace.module.scss';
import Header from '../../components/Header';
import { Button, CircularProgress, createStyles, makeStyles, TextField, Theme } from '@material-ui/core';
import { useMutation } from '@apollo/react-hooks';
import { ADD_PLACE } from './AddPlace.query';
import { addPlace } from '../../types/api';
import { toast } from 'react-toastify';
import { green } from '@material-ui/core/colors';
import { GET_PLACES } from '../../shared.queries';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    buttonProgress: {
      color: green[500],
      position: 'absolute',
      top: '50%',
      left: '50%',
      marginTop: -12,
      marginLeft: -12,
    },
  })
);

interface IProps extends RouteComponentProps {}

interface IState {
  name: string;
  address: string;
  lat: number;
  lng: number;
  isFavorite: boolean;
}

const AddPlace: FunctionComponent<IProps> = ({ history }) => {
  const classes = useStyles();
  const [state, setState] = useState<IState>({
    name: '',
    address: '',
    lat: 1.23,
    lng: 1.23,
    isFavorite: false
  });

  const [addPlace, { loading }] = useMutation(ADD_PLACE);

  const handleChange = (prop: keyof IState) => (event: React.ChangeEvent<HTMLInputElement>): void => {
    setState({ ...state, [prop]: event.target.value });
  };

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (event): void => {
    event.preventDefault();
    addPlace({
      variables: {
        name: state.name,
        address: state.address,
        lat: state.lat,
        lng: state.lng,
        isFavorite: state.isFavorite
      },
      update: (_, result: any) => {
        const data: addPlace = result.data;
        const { AddPlace } = data;
        if (AddPlace.ok) {
          toast.success('Place added');
          setTimeout(() => {
            history.push('/places')
          }, 2000)
        } else {
          toast.error(AddPlace.error);
        }
      },
      refetchQueries: [{ query: GET_PLACES }]
    })
  };

  return (
    <React.Fragment>
      <Helmet>
        <title>Add Place | Muber</title>
      </Helmet>
      <Header title={'Add Place'} backTo={'/places'} />
      <div className={style.AddPlace}>
        <form className={style.Form} onSubmit={onSubmit}>
          <TextField
            label="Name"
            value={state.name}
            onChange={handleChange('name')}
            required
            fullWidth
          />
          <TextField
            label="Address"
            value={state.address}
            onChange={handleChange('address')}
            required
            fullWidth
          />
          <Link to={'/find-address'}>
            Pick place from map
          </Link>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!loading && !state.name && !state.address}
          >Add Place</Button>
          { loading && <CircularProgress size={24} className={classes.buttonProgress} /> }
        </form>
      </div>
    </React.Fragment>
  )
};

export default AddPlace;
