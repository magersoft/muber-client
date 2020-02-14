import React, { FunctionComponent, useEffect, useState } from 'react';
import Helmet from 'react-helmet';
import { RouteComponentProps } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';
import { VERIFY_PHONE } from './VerifyPhone.query';
import Input from '../../components/Input';
import Header from '../../components/Header';
import Button from '../../components/Button';
import style from './VerifyPhone.module.scss';
import { completePhoneVerification, completePhoneVerificationVariables } from '../../types/api';
import { toast } from 'react-toastify';
import { LOG_USER_IN } from '../../shared.queries';

interface IProps extends RouteComponentProps<any> {}

const VerifyPhoneContainer: FunctionComponent<IProps> = props => {
  const [key, setKey] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');

  const [completePhoneVerification, { loading }] = useMutation<completePhoneVerification, completePhoneVerificationVariables>(VERIFY_PHONE);
  const [logUserIn] = useMutation(LOG_USER_IN);

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
      variables: {
        phoneNumber,
        key
      },
      update: completed
    })
  };

  const completed = (_, result: any): void => {
    const data: completePhoneVerification = result.data;
    const { CompletePhoneVerification } = data;
    if (CompletePhoneVerification.ok) {
      const token = CompletePhoneVerification.token;
      if (token) {
        logUserIn({
          variables: {
            token
          }
        });
        toast.success('You are verified, login in now');
      } else {
        toast.error(CompletePhoneVerification.error);
      }
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
