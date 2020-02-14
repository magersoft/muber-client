import React, { FunctionComponent, useEffect, useState } from 'react';
import Helmet from 'react-helmet';
import { RouteComponentProps } from 'react-router-dom';
import style from './ChatContainer.module.scss';
import Header from '../../components/Header';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { GET_CHAT, SEND_MESSAGE, SUBSCRIBE_CHAT } from './Chat.query';
import { getChat, getChat_GetChat_chat, getChatVariables, sendMessage, sendMessageVariables } from '../../types/api';
import { Backdrop, CircularProgress, IconButton, InputAdornment, TextField } from '@material-ui/core';
import { USER_PROFILE } from '../../shared.queries';
import { IUser, UserDataResponse } from '../../types/local';
import { Send } from '@material-ui/icons';
import Message from '../../components/Message';
import { toast } from 'react-toastify';

interface IProps extends RouteComponentProps<any> {}

const ChatContainer: FunctionComponent<IProps> = ({ match, history, location }) => {
  const [chat, setChat] = useState<getChat_GetChat_chat|null>(null);
  const [user, setUser] = useState<IUser|any>(null);
  const [text, setText] = useState<string>('');
  const [rideId, setRideId] = useState<number|undefined>(void 0);

  useEffect(() => {
    if (!match.params.chatId) {
      history.push('/');
    }
  }, [match]);

  useEffect(() => {
    if (location.state) {
      const { rideId }: any = location.state;
      if (rideId) {
        setRideId(rideId);
      }
    }
  }, [location]);

  const { loading: loadingChat, data: chatData, subscribeToMore: chatSubscription } = useQuery<getChat|any, getChatVariables>(GET_CHAT, {
    variables: {
      chatId: +match.params.chatId
    },
    onCompleted: data => {
      const { GetChat } = data;
      if (GetChat.ok) {
        chatSubscription({
          document: SUBSCRIBE_CHAT,
          updateQuery: (prev, { subscriptionData }: any) => {
            if (!subscriptionData.data) {
              return prev;
            }
            return Object.assign({}, prev, {
              GetChat: {
                ...prev.GetChat,
                chat: {
                  ...prev.GetChat.chat,
                  messages: [...prev.GetChat.chat.messages, subscriptionData.data.MessageSubscription]
                }
              }
            })
          }
        })
      }
    }
  });

  useEffect(() => {
    if (chatData && chatData.GetChat) {
      setChat(chatData.GetChat.chat);
    }
  }, [chatData]);

  const { loading: loadingUser, data: userData } = useQuery<UserDataResponse>(USER_PROFILE);

  useEffect(() => {
    if (userData && userData.GetMyProfile) {
      setUser(userData.GetMyProfile.user)
    }
  }, [userData]);

  const [sendMessage] = useMutation<sendMessage, sendMessageVariables>(SEND_MESSAGE);

  const onSendMessage = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (text) {
      sendMessage({
        variables: {
          text,
          chatId: +match.params.chatId
        },
        update: (_, result: any) => {
          const data: sendMessage = result.data;
          const { SendChatMessage } = data;
          if (SendChatMessage.ok) {
            setText('');
          } else {
            toast.error(SendChatMessage.error)
          }
        }
      })
    }
  };

  return (
    <React.Fragment>
      <Helmet>
        <title>Chat | Muber</title>
      </Helmet>
      <Header title="Chat" backTo={`/ride/${rideId}`} />
      { !loadingChat && chat && user && (
        <div className={style.Chat}>
          { chat.messages && chat.messages.map(message => {
            if (message) {
              return (
                <Message
                  key={message.id}
                  text={message.text}
                  mine={message.userId === user.id}
                  createdAt={message.createdAt}
                />
              )
            }
            return null;
          })}
          <form onSubmit={onSendMessage} className={style.SendField}>
            <TextField
              label="Type you message"
              value={text}
              onChange={(event) => setText(event.target.value)}
              fullWidth
              InputProps={{
                endAdornment: <InputAdornment position="end">
                  <IconButton type="submit" disabled={!text}>
                    <Send />
                  </IconButton>
                </InputAdornment>
              }}
            />
          </form>
        </div>
      )}
      <Backdrop className={style.Backdrop} open={loadingChat || loadingUser} timeout={0}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </React.Fragment>
  )
};

export default ChatContainer;
