import React, { FunctionComponent } from 'react';
import { ToastContainer } from 'react-toastify';
import { graphql } from 'react-apollo';
import { IS_LOGGED_ID } from './AppQueries';
import AppPresenter from './AppPresenter';
import CssBaseline from '@material-ui/core/CssBaseline';
import 'react-toastify/dist/ReactToastify.min.css';
import light from '../../theme/light.theme';
import dark from '../../theme/dark.theme';
import ThemeSwitcher from 'react-css-vars/dist';

const AppContainer: FunctionComponent<any> = ({ data }) => (
  <React.Fragment>
    <CssBaseline />
    <ThemeSwitcher theme={light} />
    <AppPresenter isLoggedIn={data.auth.isLoggedIn} />
    <ToastContainer draggable={true} position={'bottom-center'} />
  </React.Fragment>
);

export default graphql(IS_LOGGED_ID)(AppContainer);
