import React, { FunctionComponent, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import axios from 'axios';
import Helmet from 'react-helmet';
import { IconButton, InputAdornment, TextField, Button, CircularProgress, Theme, createStyles, makeStyles } from '@material-ui/core';
import { AccountCircle, Email, InsertInvitation, Visibility, VisibilityOff } from '@material-ui/icons';
import Header from '../../components/Header';
import PhotoInput from '../../components/PhotoInput';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { USER_PROFILE } from '../../shared.queries';
import { UPDATE_PROFILE } from './EditAccount.query';
import { toast } from 'react-toastify';
import { green } from '@material-ui/core/colors';
import { updateProfile } from '../../types/api';
import style from './EditAccount.module.scss';

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

interface IProps extends RouteComponentProps<any> {}

interface IState {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  age: number;
  profilePhoto: string;
  uploading: boolean;
  showPassword?: boolean;
}

const EditAccountContainer: FunctionComponent<IProps> = () => {
  const classes = useStyles();

  const [state, setState] = useState<IState>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    age: 0,
    profilePhoto: '',
    uploading: false,
    showPassword: false
  });
  const { firstName, lastName, email, age, profilePhoto, password, uploading } = state;

  const { loading: getLoading } = useQuery(USER_PROFILE, {
    onCompleted: data => {
      const { GetMyProfile } = data;
      if (GetMyProfile.ok) {
        const { user } = GetMyProfile;
        if (user) {
          setState({
            ...state,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            age: user.age,
            profilePhoto: user.profilePhoto
          });
        }
      } else {
        toast.error(GetMyProfile.error);
      }
    }
  });

  const [updateProfile, { loading: updateLoading }] = useMutation(UPDATE_PROFILE);

  const handleChange = (prop: keyof IState) => (event: React.ChangeEvent<HTMLInputElement>): void => {
    setState({ ...state, [prop]: event.target.value });
  };

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (event): void => {
    event.preventDefault();
    updateProfile({
      variables: {
        firstName,
        lastName,
        email,
        age,
        profilePhoto,
        password: password || null
      },
      update: (cache, result: any) => {
        const data: updateProfile = result.data;
        const { UpdateMyProfile } = data;
        if (UpdateMyProfile.ok) {
          toast.success('Your profile updated');
        } else {
          toast.error(UpdateMyProfile.error);
        }
      },
      refetchQueries: [{ query: USER_PROFILE }]
    })
  };

  const uploadPhoto: React.ChangeEventHandler<HTMLInputElement> = async (event) => {
    const { target: { files } } = event;
    if (files) {
      setState({ uploading: true, ...state });
      const formData = new FormData();
      formData.append('file', files[0]);
      formData.append('api_key', '754293116941949');
      formData.append('upload_preset', 'sed4duz5');
      formData.append('timestamp', String(Date.now() / 1000));
      const { data: { secure_url } } = await axios.post('https://api.cloudinary.com/v1_1/magersoft/image/upload', formData);
      if (secure_url) {
        setState({ uploading: false, ...state });
        setState({ ...state, profilePhoto: secure_url });
      }
    }
  };

  return (
    <div className={style.Edit}>
      <Helmet>
        <title>Edit Account | Muber</title>
      </Helmet>
      <Header title={'Edit Account'} backTo={'/'} />
      <form className={style.Form} onSubmit={onSubmit}>
        <PhotoInput
          uploading={uploading}
          fileUrl={profilePhoto}
          onChange={uploadPhoto}
        />
        <TextField
          label="First Name"
          value={firstName}
          onChange={handleChange('firstName')}
          disabled={getLoading}
          fullWidth
          InputProps={{
            startAdornment:
              <InputAdornment position="start">
                <AccountCircle />
              </InputAdornment>
          }}
        />
        <TextField
          label="Last Name"
          value={lastName}
          onChange={handleChange('lastName')}
          disabled={getLoading}
          fullWidth
          InputProps={{
            startAdornment:
              <InputAdornment position="start">
                <AccountCircle />
              </InputAdornment>
          }}
        />
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={handleChange('email')}
          disabled={getLoading}
          fullWidth
          InputProps={{
            startAdornment:
              <InputAdornment position="start">
                <Email />
              </InputAdornment>
          }}
        />
        <TextField
          label="Age"
          value={age}
          type={'number'}
          placeholder={'Age'}
          disabled={getLoading}
          onChange={handleChange('age')}
          fullWidth
          InputProps={{
            startAdornment:
              <InputAdornment position="start">
                <InsertInvitation />
              </InputAdornment>
          }}
        />
        <TextField
          label="New Password"
          type={state.showPassword ? 'text' : 'password'}
          value={password}
          onChange={handleChange('password')}
          disabled={getLoading}
          fullWidth
          InputProps={{
            endAdornment: <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => setState({...state, showPassword: !state.showPassword})}
              >
                {state.showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          }}

        />
        <div className={style.Button}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={updateLoading}
          >
            Update My Profile
          </Button>
          { updateLoading && <CircularProgress size={24} className={classes.buttonProgress} /> }
        </div>
      </form>
    </div>
  )
};

export default EditAccountContainer;
