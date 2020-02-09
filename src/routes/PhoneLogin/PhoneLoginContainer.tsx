import React, { FunctionComponent, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';
import { PHONE_SIGN_IN } from './Phone.query';
import Helmet from 'react-helmet';
import { toast } from 'react-toastify';
import BackArrow from '../../components/BlackArrow';
import Input from '../../components/Input/Input';
import countries from '../../countries';
import style from './PhoneLogin.module.scss';
import { startPhoneVerification } from '../../types/api';
import { Select } from '@material-ui/core';

interface IProps extends RouteComponentProps<any> {}

interface IState {
  countryCode: string;
  phoneNumber: string;
}

const PhoneLoginContainer: FunctionComponent<IProps> = ({ history }) => {
  const [state, setState] = useState<IState>({
    countryCode: '+7',
    phoneNumber: ''
  });
  const phone = `${state.countryCode}${state.phoneNumber}`;

  const [startPhoneVerification, { loading }] = useMutation<startPhoneVerification>(PHONE_SIGN_IN);

  const handleChange = (prop: keyof IState) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | { value: unknown }>) => {
      setState({ ...state, [prop]: event.target.value });
  };

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (event): void => {
    event.preventDefault();
    const isValid = /^\+[1-9]{1}[0-9]{7,11}$/.test(phone);
    if (isValid) {
      startPhoneVerification({
        update: completed,
        variables: {
          phoneNumber: phone
        }
      });
    } else {
      toast.error('Please write valid phone number');
    }
  };

  const completed = (_, result: any): void => {
    const data: startPhoneVerification = result.data;
    const { StartPhoneVerification } = data;
    if (StartPhoneVerification?.ok) {
      toast.success('SMS will be send. Check your phone');
      setTimeout(() => {
        history.push({
          pathname: '/verify-phone',
          state: {
            phone
          }
        });
      }, 1500);
      return;
    } else {
      toast.error(StartPhoneVerification?.error);
    }
  };

  return (
    <div className={style.PhoneLogin}>
      <Helmet>
        <title>Phone Login | Number</title>
      </Helmet>
      <BackArrow backTo={"/"} className={style.BlackArrow}/>
      <h2 className={style.Title}>Enter your mobile number</h2>
      <Select
        native
        value={state.countryCode}
        onChange={handleChange('countryCode')}
      >
        {countries.map((country, index) => (
          <option key={index} value={country.dial_code}>
            {country.flag} {country.name} ({country.dial_code})
          </option>
        ))}
      </Select>
      <form onSubmit={onSubmit}>
        <Input
          value={state.phoneNumber}
          onChange={handleChange('phoneNumber')}
          placeholder={"(999) 999 99 99"}
          className={style.Input}
        />
        <button className={style.Button}>
          { loading ?
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill={"white"}
            >
              <path d="M13.75 22c0 .966-.783 1.75-1.75 1.75s-1.75-.784-1.75-1.75.783-1.75 1.75-1.75 1.75.784 1.75 1.75zm-1.75-22c-1.104 0-2 .896-2 2s.896 2 2 2 2-.896 2-2-.896-2-2-2zm10 10.75c.689 0 1.249.561 1.249 1.25 0 .69-.56 1.25-1.249 1.25-.69 0-1.249-.559-1.249-1.25 0-.689.559-1.25 1.249-1.25zm-22 1.25c0 1.105.896 2 2 2s2-.895 2-2c0-1.104-.896-2-2-2s-2 .896-2 2zm19-8c.551 0 1 .449 1 1 0 .553-.449 1.002-1 1-.551 0-1-.447-1-.998 0-.553.449-1.002 1-1.002zm0 13.5c.828 0 1.5.672 1.5 1.5s-.672 1.501-1.502 1.5c-.826 0-1.498-.671-1.498-1.499 0-.829.672-1.501 1.5-1.501zm-14-14.5c1.104 0 2 .896 2 2s-.896 2-2.001 2c-1.103 0-1.999-.895-1.999-2s.896-2 2-2zm0 14c1.104 0 2 .896 2 2s-.896 2-2.001 2c-1.103 0-1.999-.895-1.999-2s.896-2 2-2z" />
            </svg>
            :
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill={"white"}
            >
              <path d="M7.33 24l-2.83-2.829 9.339-9.175-9.339-9.167 2.83-2.829 12.17 11.996z"/>
            </svg>
          }
        </button>
      </form>
    </div>
  )
};

export default PhoneLoginContainer;
