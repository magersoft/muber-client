import { gql } from 'apollo-boost';

export const GET_CHAT = gql`
  query getChat($chatId: Int!) {
    GetChat(chatId: $chatId) {
      ok
      error
      chat {
        id
        passengerId
        driverId
        messages {
          id
          text
          userId,
          createdAt
        }
      }
    }
  }
`;

export const SEND_MESSAGE = gql`
  mutation sendMessage($text: String!, $chatId: Int!) {
    SendChatMessage(text: $text, chatId: $chatId) {
      ok
      error
      message {
        id
        text
        userId,
        createdAt
      }
    }
  }
`;

export const SUBSCRIBE_CHAT = gql`
  subscription messageSubscription {
    MessageSubscription {
      id
      text
      userId
      createdAt
    }
  }
`;
