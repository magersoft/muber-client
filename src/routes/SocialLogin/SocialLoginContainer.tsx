import React, { FunctionComponent } from 'react';
import Helmet from 'react-helmet';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import BackArrow from '../../components/BlackArrow';
import style from './SocialLogin.module.scss';
import { useMutation } from '@apollo/react-hooks';
import { FACEBOOK_CONNECT } from './SocialLogin.query';
import { facebookConnect, facebookConnectVariables } from '../../types/api';
import { RouteComponentProps } from 'react-router-dom';
import { toast } from 'react-toastify';
import { LOG_USER_IN } from '../../shared.queries';
import Loader from '../../components/Loader';

interface IProps extends RouteComponentProps<any> {}

const SocialLoginContainer: FunctionComponent<IProps> = () => {
  const [facebookLogin, { loading }] = useMutation<facebookConnect, facebookConnectVariables>(FACEBOOK_CONNECT);
  const [logUserIn] = useMutation(LOG_USER_IN);

  const facebookLoginHandler = (fbData): void => {
    const { email, first_name, last_name, id, accessToken, name } = fbData;
    if (accessToken) {
      toast.success(`Welcome, ${name}`);
      facebookLogin({
        variables: {
          email,
          firstName: first_name,
          lastName: last_name,
          fbId: id
        },
        update: (_, result: any) => {
          const data: facebookConnect = result.data;
          const { FacebookConnect } = data;
          if (FacebookConnect?.ok) {
            const token = FacebookConnect.token;
            if (token) {
              logUserIn({
                variables: {
                  token
                }
              })
            } else {
              toast.error(FacebookConnect.error);
            }
          } else {
            toast.error(FacebookConnect?.error);
          }
        }
      });
    } else {
      toast.error('Could not log you in ☹️')
    }
  };

  return (
    <div className={style.SocialModule}>
      <Helmet>
        <title>Social Login | Nuber</title>
      </Helmet>
      <h2 className={style.Title}>Choose an account</h2>
      <BackArrow backTo={"/"} className={style.BlackArrow} />
      <FacebookLogin
        appId="2462572937288785"
        autoLoad={true}
        fields="first_name,last_name,name,email,picture"
        callback={facebookLoginHandler}
        render={renderProps => (
          <span onClick={renderProps.onClick} className={style.Link}>
          <span className={style.Icon}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="#344EA1"
            >
              <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
            </svg>
          </span>
          Facebook
        </span>
        )}
      />
      { loading ?
        <div className={style.FbLoader}>
          <Loader color={'dark'} />
        </div> : null
      }
    </div>
  )
};

export default SocialLoginContainer;
