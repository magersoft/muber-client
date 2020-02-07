import React, { FunctionComponent, useEffect, useState } from 'react';
import Helmet from 'react-helmet';
import { RouteComponentProps } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';
import { VERIFY_PHONE } from './VerifyPhone.query';
import Input from '../../components/Input';
import Header from '../../components/Header';
import Button from '../../components/Button';
import style from './VerifyPhone.module.scss';
import { completePhoneVerification } from '../../types/api';
import { toast } from 'react-toastify';

interface IProps extends RouteComponentProps {}

const VerifyPhoneContainer: FunctionComponent<IProps> = props => {
  const [key, setKey] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(null);

  const [completePhoneVerification, { loading }] = useMutation(VERIFY_PHONE);

  useEffect(() => {
    if (!props.location.state) {
      props.history.push('/')
    } else {
      // @ts-ignore
      setPhoneNumber(props.location.state.phone);
    }
  }, [props.location.state, props.history]);

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (event): void => {
    event.preventDefault();
    completePhoneVerification({
      update: completed,
      variables: {
        phoneNumber,
        key
      }
    })
  };

  const completed = (_, result: any): void => {
    const data: completePhoneVerification = result.data;
    const { CompletePhoneVerification } = data;
    if (CompletePhoneVerification.ok) {
      console.log(CompletePhoneVerification);
      toast.success('You are verified, login in now');
      return;
    } else {
      toast.error(CompletePhoneVerification.error)
    }
  };

  return (
    <div className={style.VerifyPhone}>
      <Helmet>
        <title>Verify Phone | Muber</title>
      </Helmet>
      <Header backTo={'/phone-login'} title={'Verify Phone Number'} />
      <form className={style.Form} onSubmit={onSubmit}>
        <Input value={key} onChange={event => setKey(event.target.value)} placeholder="Enter Verification Code" />
        <Button label={ loading ? 'Verify' : 'Submit' } disabled={loading} />
      </form>
    </div>
  )
};

export default VerifyPhoneContainer;
