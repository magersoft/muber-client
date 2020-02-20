import React, { FunctionComponent } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import Helmet from 'react-helmet';
import style from './Login.module.scss';

interface IProps extends RouteComponentProps<any> {}

const LoginContainer: FunctionComponent<IProps> = () => (
  <div className={style.Login}>
    <Helmet>
      <title>Login | Muber</title>
    </Helmet>
    <header className={style.Header}>
      <div className={style.Logo}>
        <h1>Muber</h1>
      </div>
      <h4>This is clone Uber application</h4>
      <div className={style.About}>
        <p>Powered By React.js</p>
        <p>Author: <a href="https://github.com/magersoft" target="_blank" rel="noopener noreferrer" >magersoft</a></p>
      </div>
    </header>
    <div>
      <Link to={'phone-login'}>
        <div className={style.PhoneLogin}>
        <h2>Get moving with Muber</h2>
          {/* eslint-disable-next-line */}
        <div className={style.FakeInput}>
          🇷🇺 +7 <span className={style.Grey}>Enter your mobile number</span>
        </div>
      </div>
      </Link>
      <div className={style.SocialLogin}>
        <Link to={'social-login'} className={style.SocialLink}>Or connect with social</Link>
        <Link to={'email'} className={style.SocialLink}>Or SignIn/SingUp email</Link>
      </div>
    </div>
  </div>
);

export default LoginContainer;
