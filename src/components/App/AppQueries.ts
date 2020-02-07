import { gql } from 'apollo-boost';

export const IS_LOGGED_ID = gql`
  {
    auth {
      isLoggedIn @client
    }
  }
`;
