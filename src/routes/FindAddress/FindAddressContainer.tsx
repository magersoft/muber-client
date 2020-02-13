import React, { FunctionComponent } from 'react';
import Helmet from 'react-helmet';
import YandexMaps from '../../components/YandexMaps';
import { RouteComponentProps } from 'react-router-dom';

interface IProps extends RouteComponentProps<any> {}

const FindAddress: FunctionComponent<IProps> = ({ history }) => {

  const pickThisPlace = (_, payload) => {
    history.push({
      pathname: '/add-place',
      state: payload
    });
  };

  return (
    <React.Fragment>
      <Helmet>
        <title>Find Address | Muber</title>
      </Helmet>
        <YandexMaps
          user={{
            isDriving: false
          }}
          isPickPlaceMap
          pickButton={{
            label: 'Pick this place',
            onClick: (event, payload) => pickThisPlace(event, payload)
          }} />
      </React.Fragment>
  )
};

export default FindAddress;
