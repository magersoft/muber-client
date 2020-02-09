import React, { FunctionComponent, useState } from 'react';
import style from './Place.module.scss';
import { Favorite, FavoriteBorder } from '@material-ui/icons';
import { IconButton } from '@material-ui/core';
import { useMutation } from '@apollo/react-hooks';
import { EDIT_PLACE } from './Place.query';
import { toast } from 'react-toastify';

interface IProps {
  id: number;
  fav: boolean;
  name: string;
  address: string;
}

const Place: FunctionComponent<IProps> = ({ fav, name, address, id }) => {
  const [favorite, setFav] = useState<boolean>(fav);
  const [editPlace] = useMutation(EDIT_PLACE);

  const setFavorite = () => {
    editPlace({
      variables: {
        placeId: id,
        isFavorite: !fav
      },
      update: (_, result: any) => {
        const data = result.data;
        const { EditPlace } = data;
        setFav(!fav);
        if (!EditPlace.ok) {
          toast.error(EditPlace.error);
          return;
        }
      }
    })
  };

  return (
    <div className={style.Place}>
      <IconButton onClick={setFavorite}>
        { favorite ? <Favorite /> : <FavoriteBorder /> }
      </IconButton>
      <div className={style.Container}>
      <span className={style.Name}>
        { name }
      </span>
        <span className={style.Address}>
        { address }
      </span>
      </div>
    </div>
  )
};

export default Place;
