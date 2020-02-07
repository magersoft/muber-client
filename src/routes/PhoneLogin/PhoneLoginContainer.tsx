import React, { FunctionComponent, useState } from 'react';
import Helmet from 'react-helmet';
import BackArrow from '../../components/BlackArrow';
import Input from '../../components/Input/Input';
import countries from '../../countries';
import style from './PhoneLogin.module.scss';
import { RouteComponentProps } from 'react-router-dom';
import { toast } from 'react-toastify';

interface IProps extends RouteComponentProps<any> {}

const PhoneLoginContainer: FunctionComponent<IProps> = () => {
  const [countryCode, setCountryCode] = useState('+7');
  const [phoneNumber, setPhoneNumber] = useState('');

  const onSubmit: React.FormEventHandler<HTMLFormElement> = event => {
    event.preventDefault();
    const phone = `${countryCode}${phoneNumber}`;
    const isValid = /^\+[1-9]{1}[0-9]{7,11}$/.test(phone);
    if (isValid) {
      return;
    } else {
      toast.error('Please write valid phone number');
    }
  };

  return (
    <div className={style.PhoneLogin}>
      <Helmet>
        <title>Phone Login | Number</title>
      </Helmet>
      <BackArrow backTo={"/"} className={style.BlackArrow}/>
      <h2 className={style.Title}>Enter your mobile number</h2>
      <select
        name="countryCode"
        value={countryCode}
        onChange={event => setCountryCode(event.target.value)}
        className={style.CountrySelect}
      >
        {countries.map((country, index) => (
          <option key={index} value={country.dial_code}>
            {country.flag} {country.name} ({country.dial_code})
          </option>
        ))}
      </select>
      <form onSubmit={onSubmit}>
        <Input
          value={phoneNumber}
          onChange={event => setPhoneNumber(event.target.value)}
          name="phoneNumber"
          placeholder={"(999) 999 99 99"}
        />
        <button className={style.Button}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill={"white"}
          >
            <path d="M7.33 24l-2.83-2.829 9.339-9.175-9.339-9.167 2.83-2.829 12.17 11.996z"/>
          </svg>
        </button>
      </form>
    </div>
  )
};

export default PhoneLoginContainer;
