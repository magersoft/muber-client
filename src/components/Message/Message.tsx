import React, { FunctionComponent } from 'react';
import style from './Message.module.scss';

interface IProps {
  text: string;
  mine: boolean;
  createdAt: string;
}

const Message: FunctionComponent<IProps> = ({ text, mine, createdAt }) => {
  let classes = [style.Message];
  if (mine) {
    classes.push(style.Mine)
  }

  return (
    <div className={classes.join(' ')}>
      <p>{ text } <span>{ new Date(+createdAt).toLocaleTimeString().replace(/(.*)\D\d+/, '$1') }</span></p>
</div>
  )
};

export default Message;
