import React, { FunctionComponent } from 'react';
import style from './Menu.module.scss';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';
import { TOGGLE_DRIVING_MODE, TOGGLE_THEME_MODE } from './Menu.query';
import { USER_PROFILE } from '../../shared.queries';
import { toggleDrivingMode, toggleThemeMode } from '../../types/api';
import { toast } from 'react-toastify';
import Toggle from 'react-toggle';
import 'react-toggle/style.css';
import { IUser } from '../../types/local';

interface IProps {
  user: IUser
}

const Menu: FunctionComponent<IProps> = ({ user }) => {
  const { fullName, profilePhoto, isDriving, darkTheme } = user;
  const [toggleDrivingMode] = useMutation(TOGGLE_DRIVING_MODE);
  const [toggleThemeMode] = useMutation(TOGGLE_THEME_MODE);

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

  const darkModeHandler = () => {
    toggleThemeMode({
      update: (cache, result: any) => {
        const data: toggleThemeMode = result.data;
        const { ToggleThemeMode } = data;
        if (!ToggleThemeMode.ok) {
          toast.error(ToggleThemeMode.error);
          return;
        }
        const query = cache.readQuery({ query: USER_PROFILE });
        // @ts-ignore
        const { GetMyProfile: { user } } = query;
        if (user) {
          user.darkTheme = !darkTheme;
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
      <Link to={'/places'} className={style.SLink}>Places</Link>
      <Link to={'/settings'} className={style.SLink}>Settings</Link>
      <button
        onClick={toggleDrivingModeHandler}
        className={`${style.ToggleDriving} ${isDriving ? style.isDriving : null}`}
      >
        { isDriving ? 'Stop Driving' : 'Start Driving' }
      </button>
      <div className={style.ThemeSwitcher}>
        <Toggle
          id="theme-switcher"
          defaultChecked={darkTheme}
          onChange={darkModeHandler}
        />
        <label htmlFor="theme-switcher">Dark Mode</label>
      </div>
    </div>
  )
};

export default Menu;
