import React, { FunctionComponent, useState } from 'react';
import style from './Menu.module.scss';
import { Link } from 'react-router-dom';

const Menu: FunctionComponent = () => {
  const [isDriving, setDriving] = useState<boolean>(false);

  return (
    <div className={style.Menu}>
      <div className={style.Header}>
        <div className={style.Grid}>
          <Link to={'/edit-account'}>
          <img
            className={style.Image}
            src={'https://yt3.ggpht.com/-CTwXMuZRaWw/AAAAAAAAAAI/AAAAAAAAAAA/HTJy-KJ4F2c/s88-c-k-no-mo-rj-c0xffffff/photo.jpg'}
            alt="Account profile"
          />
          </Link>
          <span className={style.About}>
            <h2>Vladislav Mager</h2>
            <h5>4.5</h5>
          </span>
        </div>
      </div>
      <Link to={'/trips'} className={style.SLink}>Your Trips</Link>
      <Link to={'/settings'} className={style.SLink}>Settings</Link>
      <button
        onClick={() => setDriving(!isDriving)}
        className={`${style.ToggleDriving} ${isDriving ? style.isDriving : null}`}
      >
        { isDriving ? 'Stop Driving' : 'Start Driving' }
      </button>
    </div>
  )
};

export default Menu;
