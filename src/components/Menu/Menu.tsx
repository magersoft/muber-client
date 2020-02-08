import React, { FunctionComponent } from 'react';
import style from './Menu.module.scss';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';
import { TOGGLE_DRIVING_MODE } from './Menu.query';
import { USER_PROFILE } from '../../shared.queries';
import { toggleDrivingMode } from '../../types/api';
import { toast } from 'react-toastify';

interface IProps {
  user: {
    fullName: string;
    profilePhoto: string;
    isDriving: boolean;
  }
}

const Menu: FunctionComponent<IProps> = ({ user }) => {
  const { fullName, profilePhoto, isDriving } = user;
  const [toggleDrivingMode] = useMutation(TOGGLE_DRIVING_MODE);

  const picture = profilePhoto ? profilePhoto : 'https://yt3.ggpht.com/-CTwXMuZRaWw/AAAAAAAAAAI/AAAAAAAAAAA/HTJy-KJ4F2c/s88-c-k-no-mo-rj-c0xffffff/photo.jpg';

  const toggleDrivingModeHandler = (): void => {
    toggleDrivingMode({
      update: (cache, result: any) => {
        const data: toggleDrivingMode = result.data;
        const { ToggleDrivingMode } = data;
        if (!ToggleDrivingMode.ok) {
          toast.error(ToggleDrivingMode.error);
          return;
        }
        const query = cache.readQuery({ query: USER_PROFILE });
        // @ts-ignore
        const { GetMyProfile: { user } } = query;
        if (user) {
          user.isDriving = !isDriving;
        }
        cache.writeQuery({ query: USER_PROFILE, data: query });
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
        className={`${style.ToggleDriving} ${isDriving ? style.isDriving : null}`}
      >
        { isDriving ? 'Stop Driving' : 'Start Driving' }
      </button>
    </div>
  )
};

export default Menu;
