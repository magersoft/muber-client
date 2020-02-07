import React, { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import style from './BlackArrow.module.scss';

interface IProps {
  backTo: string;
  className?: string;
}

const BackArrow: FunctionComponent<IProps> = ({ backTo, className }) => (
  <div className={style.BlackArrow + ' ' + className}>
    <Link to={backTo}>
      <svg
        width="24"
        height="24"
        xmlns="http://www.w3.org/2000/svg"
        fillRule="evenodd"
        clipRule="evenodd"
      >
        <path d="M20 .755l-14.374 11.245 14.374 11.219-.619.781-15.381-12 15.391-12 .609.755z" />
      </svg>
    </Link>
  </div>
);

export default BackArrow;
