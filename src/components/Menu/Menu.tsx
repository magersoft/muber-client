import React, { FunctionComponent, useState } from 'react';
import style from './Menu.module.scss';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';
import { TOGGLE_DRIVING_MODE } from './Menu.query';
import { toast } from 'react-toastify';
import { toggleDrivingMode } from '../../types/api';

interface IProps {
  user: {
    fullName: string;
    profilePhoto: string;
    isDriving: boolean;
  }
}

const Menu: FunctionComponent<IProps> = ({ user }) => {
  const { fullName, profilePhoto, isDriving } = user;
  const [isDrivingState, setDrivingState] = useState<boolean>(isDriving);
  const [toggleDrivingMode] = useMutation(TOGGLE_DRIVING_MODE);

  const picture = profilePhoto ? profilePhoto : 'https://yt3.ggpht.com/-CTwXMuZRaWw/AAAAAAAAAAI/AAAAAAAAAAA/HTJy-KJ4F2c/s88-c-k-no-mo-rj-c0xffffff/photo.jpg';

  const toggleDrivingModeHandler = (): void => {
    toggleDrivingMode({
      update: (_, result: any) => {
        const data: toggleDrivingMode = result.data;
        const { ToggleDrivingMode } = data;
        if (ToggleDrivingMode.ok) {
          setDrivingState(!isDrivingState);
        } else {
          toast.error(ToggleDrivingMode.error);
        }
      }
    })
  };

  return (
    <div className={style.Menu}>
      <div className={style.Header}>
        <div className={style.Grid}>
          <Link to={'/edit-account'}>
          <img
            className={style.Image}
            src={picture}
            alt="Account profile"
          />
          </Link>
          <span className={style.About}>
            <h2>{ fullName }</h2>
            <h5>4.5</h5>
          </span>
        </div>
      </div>
      <Link to={'/trips'} className={style.SLink}>Your Trips</Link>
      <Link to={'/settings'} className={style.SLink}>Settings</Link>
      <button
        onClick={toggleDrivingModeHandler}
        className={`${style.ToggleDriving} ${isDrivingState ? style.isDriving : null}`}
      >
        { isDrivingState ? 'Stop Driving' : 'Start Driving' }
      </button>
    </div>
  )
};

export default Menu;
