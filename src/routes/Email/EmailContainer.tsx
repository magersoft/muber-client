import React, { FunctionComponent, useState } from 'react';
import Helmet from 'react-helmet';
import style from './Email.module.scss';
import Header from '../../components/Header';
import { Button, IconButton, InputAdornment, TextField } from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import { RouteComponentProps } from 'react-router-dom';
import is from 'is_js';
import { useMutation } from '@apollo/react-hooks';
import { EMAIL_SIGN_IN, EXIST_USER } from './Email.query';
import { emailSingIn, emailSingInVariables, existUser, existUserVariables } from '../../types/api';
import { toast } from 'react-toastify';
import { LOG_USER_IN } from '../../shared.queries';

interface IProps extends RouteComponentProps<any> {}

interface IState {
  showPassword: boolean;
  newUser: boolean;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  profilePhoto: string;
  age: number|null;
  phoneNumber: string;
}

const EmailContainer: FunctionComponent<IProps> = () => {
  const [state, setState] = useState<IState>({
    showPassword: false,
    newUser: false,
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    profilePhoto: '',
    age: null,
    phoneNumber: ''
  });

  const [existUser, { loading: loadingFoundingUser }] = useMutation<existUser, existUserVariables>(EXIST_USER);
  const [logUserIn] = useMutation(LOG_USER_IN);
  const [signIn, { loading: loadingSignIn }] = useMutation<emailSingIn, emailSingInVariables>(EMAIL_SIGN_IN);

  const handleChange = (prop: keyof IState) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, [prop]: event.target.value })
  };

  const handleExistUser = (event: React.FocusEvent<HTMLInputElement>) => {
    const isEmail = is.email(state.email);
    if (!isEmail) {
      return;
    }
    existUser({
      variables: {
        email: state.email
      },
      update: (_, result: any) => {
        const data: existUser = result.data;
        const { RequestEmailExist } = data;
        if (RequestEmailExist.ok) {
          if (!RequestEmailExist.exist) {
            setState({ ...state, newUser: true })
          } else {
            setState({ ...state, newUser: false })
          }
        }
      }
    })
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (state.newUser) {
      console.log('register new user')
    } else {
      signIn({
        variables: {
          email: state.email,
          password: state.password
        },
        update: (_, result: any) => {
          const data: emailSingIn = result.data;
          const { EmailSignIn } = data;
          if (EmailSignIn.ok) {
            const token = EmailSignIn.token;
            if (token) {
              logUserIn({
                variables: {
                  token
                }
              })
            }
          } else {
            toast.error(EmailSignIn.error);
          }
        }
      })
    }
  };

  return (
    <React.Fragment>
    <Helmet>
      <title>Login | Muber</title>
    </Helmet>
    <Header title="SignIn/SignUp with email" backTo={'/'} />
    <form className={style.Email} onSubmit={handleSubmit}>
      <TextField
        type="email"
        label="Email"
        required
        fullWidth
        value={state.email}
        onChange={handleChange('email')}
        onBlur={handleExistUser}
      />
      <TextField
        type={ state.showPassword ? 'text' : 'password' }
        label="Password"
        required
        fullWidth
        value={state.password}
        onChange={handleChange('password')}
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
      { state.newUser &&
        <React.Fragment>
          <TextField
            label="First Name"
            fullWidth
            value={state.firstName}
            onChange={handleChange('firstName')}
          />
          <TextField
            label="Last Name"
            fullWidth
            value={state.lastName}
            onChange={handleChange('lastName')}
          />
          <TextField
            label="Phone Number"
            fullWidth
            value={state.phoneNumber}
            onChange={handleChange('phoneNumber')}
          />
          <TextField
            type="number"
            label="Age"
            fullWidth
            value={state.age}
            onChange={handleChange('age')}
          />
        </React.Fragment>
      }
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={loadingFoundingUser || loadingSignIn}
      >
        { state.newUser ? 'Sign Up' : 'Sign In' }
      </Button>
    </form>
    </React.Fragment>
  )
};

export default EmailContainer;
