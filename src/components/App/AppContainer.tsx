import React, { FunctionComponent } from 'react';
import { graphql } from 'react-apollo';
import { IS_LOGGED_ID } from './AppQueries';
import AppPresenter from './AppPresenter';

const AppContainer: FunctionComponent<any> = ({ data }) => <AppPresenter isLoggedIn={data.auth.isLoggedIn} />;

export default graphql(IS_LOGGED_ID)(AppContainer);
