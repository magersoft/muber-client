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
    </header>
    <div>
      <Link to={'phone-login'}>
        <div className={style.PhoneLogin}>
        <h2>Get moving with Muber</h2>
          {/* eslint-disable-next-line */}
        <div className={style.FakeInput}>
          🇰🇷 +82 <span className={style.Grey}>Enter your mobile number</span>
        </div>
      </div>
      </Link>
      <Link to={'social-login'} >
        <div className={style.SocialLogin}>
        <div className={style.SocialLink}>Or connect with social</div>
      </div>
      </Link>
    </div>
  </div>
);

export default LoginContainer;
