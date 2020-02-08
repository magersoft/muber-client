import React, { FunctionComponent, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import axios from 'axios';
import Helmet from 'react-helmet';
import Input from '../../components/Input';
import Header from '../../components/Header';
import Button from '../../components/Button';
import PhotoInput from '../../components/PhotoInput';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { USER_PROFILE } from '../../shared.queries';
import { UPDATE_PROFILE } from './EditAccount.query';
import { toast } from 'react-toastify';
import { updateProfile } from '../../types/api';
import style from './EditAccount.module.scss';

interface IProps extends RouteComponentProps {}

const EditAccountContainer: FunctionComponent<IProps> = () => {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [age, setAge] = useState<number>(0);
  const [profilePhoto, setProfilePhoto] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false);

  const { loading: getLoading } = useQuery(USER_PROFILE, {
    onCompleted: data => {
      const { GetMyProfile } = data;
      if (GetMyProfile.ok) {
        const { user } = GetMyProfile;
        if (user) {
          setFirstName(user.firstName);
          setLastName(user.lastName);
          setEmail(user.email);
          setAge(user.age);
          setProfilePhoto(user.profilePhoto);
        }
      } else {
        toast.error(GetMyProfile.error);
      }
    }
  });

  const [updateProfile, { loading: updateLoading }] = useMutation(UPDATE_PROFILE);

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (event): void => {
    event.preventDefault();
    updateProfile({
      variables: {
        firstName,
        lastName,
        email,
        age,
        profilePhoto,
        password: password || null
      },
      update: (cache, result: any) => {
        const data: updateProfile = result.data;
        const { UpdateMyProfile } = data;
        if (UpdateMyProfile.ok) {
          toast.success('Your profile updated');
        } else {
          toast.error(UpdateMyProfile.error);
        }
      },
      refetchQueries: [{ query: USER_PROFILE }]
    })
  };

  const uploadPhoto: React.ChangeEventHandler<HTMLInputElement> = async (event) => {
    const { target: { name, value, files } } = event;
    if (files) {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', files[0]);
      formData.append('api_key', '754293116941949');
      formData.append('upload_preset', 'sed4duz5');
      formData.append('timestamp', String(Date.now() / 1000));
      const { data: { secure_url } } = await axios.post('https://api.cloudinary.com/v1_1/magersoft/image/upload', formData);
      if (secure_url) {
        setUploading(false);
        setProfilePhoto(secure_url);
      }
    }
  };

  return (
    <div className={style.Edit}>
      <Helmet>
        <title>Edit Account | Muber</title>
      </Helmet>
      <Header title={'Edit Account'} backTo={'/'} />
      <form className={style.Form} onSubmit={onSubmit}>
        <PhotoInput
          uploading={uploading}
          fileUrl={profilePhoto}
          onChange={uploadPhoto}
        />
        <Input
          value={firstName}
          onChange={event => setFirstName(event.target.value)}
          placeholder={'First Name'}
          disabled={getLoading}
          className={style.Input}
        />
        <Input
          value={lastName}
          onChange={event => setLastName(event.target.value)}
          placeholder={'Last Name'}
          disabled={getLoading}
          className={style.Input}
        />
        <Input
          value={email}
          type={'email'}
          placeholder={'Email'}
          disabled={getLoading}
          onChange={event => setEmail(event.target.value)}
          className={style.Input}
        />
        <Input
          value={age}
          type={'number'}
          placeholder={'Age'}
          disabled={getLoading}
          onChange={event => setAge(+event.target.value)}
          className={style.Input}
        />
        <Input
          type={'password'}
          value={password}
          placeholder={'New password'}
          onChange={event => setPassword(event.target.value)}
          required={false}
          disabled={getLoading}
          className={style.Input}
        />
        <Button label={updateLoading ? 'Loading' : 'Update'} />
      </form>
    </div>
  )
};

export default EditAccountContainer;
