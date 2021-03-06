import { gql } from 'apollo-boost';

export const IS_LOGGED_ID = gql`
  {
    auth {
      isLoggedIn @client
    }
  }
`;

export const THEME_MODE = gql`
  query themeMode {
    GetMyProfile {
      ok
      error
      user {
        darkTheme
      }
    }
  }
`;
