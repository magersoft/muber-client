import React, { FunctionComponent } from 'react';
import { graphql } from 'react-apollo';
import { IS_LOGGED_ID } from './AppQueries';
import AppPresenter from './AppPresenter';
import GlobalStyles from '../../globalStyles';
import { ThemeProvider } from '../../typed-components';
import theme from '../../theme';


const AppContainer: FunctionComponent<any> = ({ data }) => (
  <React.Fragment>
    <GlobalStyles />
    <ThemeProvider theme={theme}>
      <AppPresenter isLoggedIn={data.auth.isLoggedIn} />
    </ThemeProvider>
  </React.Fragment>
);

export default graphql(IS_LOGGED_ID)(AppContainer);
