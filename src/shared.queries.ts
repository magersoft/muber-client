import { gql } from 'apollo-boost';

export const LOG_USER_IN = gql`
  mutation logUserIn($token: String!) {
    logUserIn(token: $token) @client
  }
`;

export const USER_PROFILE = gql`
  query getUserProfile {
    GetMyProfile {
      ok
      error
      user {
        firstName
        lastName
        fullName
        age
        email
        profilePhoto
        isDriving
        darkTheme
      }
    }
  }
`;
