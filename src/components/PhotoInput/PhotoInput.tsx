import React, { FunctionComponent } from 'react';
import style from './PhotoInput.module.scss';
import Loader from '../Loader';

interface IProps {
  uploading: boolean;
  fileUrl: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const PhotoInput: FunctionComponent<IProps> = ({ uploading, fileUrl, onChange }) => (
  <div className={style.PhotoInput}>
    <input id="photo" type="file" accept="image/*" onChange={onChange} className={style.Input} />
    <label htmlFor="photo" className={style.Image}>
      { uploading && <Loader color={'dark'} className={style.Loader} /> }
      { !uploading && <img src={fileUrl} /> }
    </label>
  </div>
);

export default PhotoInput;
