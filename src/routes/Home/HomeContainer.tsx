import React, { FunctionComponent, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import Helmet from 'react-helmet';
import Sidebar from 'react-sidebar';
import style from './Home.module.scss';
import Menu from '../../components/Menu';
import { useQuery } from '@apollo/react-hooks';
import { USER_PROFILE } from '../../shared.queries';

interface IProps extends RouteComponentProps<any> {}

const HomeContainer: FunctionComponent<IProps> = () => {
  const [isMenuOpen, setMenuOpen] = useState<boolean>(false);

  const { loading, data } = useQuery(USER_PROFILE);

  const toggleMenu = (): void => {
    setMenuOpen(!isMenuOpen);
  };

  return (
    <div className={style.Home}>
      <Helmet>
        <title>Home | Muber</title>
      </Helmet>
      { !loading && data.GetMyProfile.user &&
        <Sidebar
          sidebar={<Menu user={data.GetMyProfile.user} />}
          open={isMenuOpen}
          onSetOpen={toggleMenu}
          styles={{
            sidebar: {
              backgroundColor: 'white',
              width: '80%',
              zIndex: '10'
            }
          }}
        >
          <button onClick={toggleMenu}>Open sidebar</button>
        </Sidebar>
      }
    </div>
  )
};

export default HomeContainer;
