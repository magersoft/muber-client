import React, { FunctionComponent, useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { graphql, useQuery } from 'react-apollo';
import { IS_LOGGED_ID, THEME_MODE } from './AppQueries';
import AppPresenter from './AppPresenter';
import CssBaseline from '@material-ui/core/CssBaseline';
import 'react-toastify/dist/ReactToastify.min.css';
import light from '../../theme/light.theme';
import dark from '../../theme/dark.theme';
import ThemeSwitcher from 'react-css-vars/dist';

const AppContainer: FunctionComponent<any> = ({ data }) => {
  const [isDark, setDark] = useState(false);
  const { data: userData } = useQuery(THEME_MODE);

  useEffect(() => {
    if (userData && userData.GetMyProfile) {
      const { user } = userData.GetMyProfile;
      if (user) {
        setDark(user.darkTheme)
      }
    }
  }, [userData]);

  return (
    <React.Fragment>
      <CssBaseline />
      <ThemeSwitcher theme={isDark ? dark : light} />
      <AppPresenter isLoggedIn={data.auth.isLoggedIn} />
      <ToastContainer draggable={true} position={'bottom-center'} />
    </React.Fragment>
  )
};

export default graphql(IS_LOGGED_ID)(AppContainer);
