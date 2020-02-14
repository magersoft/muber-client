import React, { FunctionComponent } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';

import AddPlace from '../../routes/AddPlace';
import EditAccount from '../../routes/EditAccount';
import FindAddress from '../../routes/FindAddress';
import Home from '../../routes/Home';
import Login from '../../routes/Login';
import PhoneLogin from '../../routes/PhoneLogin';
import Places from '../../routes/Places';
import Ride from '../../routes/Ride';
import Settings from '../../routes/Settings';
import SocialLogin from '../../routes/SocialLogin';
import VerifyPhone from '../../routes/VerifyPhone';

interface IProps {
  isLoggedIn: boolean;
}

const AppPresenter: FunctionComponent<IProps> = ({ isLoggedIn }) =>
  <BrowserRouter>
    { isLoggedIn ? <LoggedInRoutes /> : <LoggedOutRoutes /> }
  </BrowserRouter>;

const LoggedOutRoutes: FunctionComponent = () => (
  <Switch>
    <Route path={'/'} exact={true} component={Login} />
    <Route path={'/phone-login'} component={PhoneLogin} />
    <Route path={'/verify-phone'} component={VerifyPhone} />
    <Route path={'/social-login'} component={SocialLogin} />
    <Redirect from={'*'} to={'/'} />
  </Switch>
);

const LoggedInRoutes: FunctionComponent = () => (
  <Switch>
    <Route path={'/'} exact={true} component={Home} />
    <Route path={'/ride/:rideId'} component={Ride} />
    <Route path={'/edit-account'} component={EditAccount} />
    <Route path={'/settings'} component={Settings} />
    <Route path={'/places'} component={Places} />
    <Route path={'/add-place'} component={AddPlace} />
    <Route path={'/find-address'} component={FindAddress} />
    <Redirect from={'*'} to={'/'} />
  </Switch>
);

AppPresenter.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired
};

export default AppPresenter;
