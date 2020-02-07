import React, { FunctionComponent } from 'react';
import { ToastContainer } from 'react-toastify';
import { graphql } from 'react-apollo';
import { IS_LOGGED_ID } from './AppQueries';
import AppPresenter from './AppPresenter';
import 'react-toastify/dist/ReactToastify.min.css';

const AppContainer: FunctionComponent<any> = ({ data }) => (
  <React.Fragment>
    <AppPresenter isLoggedIn={data.auth.isLoggedIn} />
    <ToastContainer draggable={true} position={'bottom-center'} />
  </React.Fragment>
);

export default graphql(IS_LOGGED_ID)(AppContainer);
