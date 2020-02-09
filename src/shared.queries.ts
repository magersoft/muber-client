import { gql } from 'apollo-boost';

export const LOG_USER_IN = gql`
  mutation logUserIn($token: String!) {
    logUserIn(token: $token) @client
  }
`;

export const LOG_USER_OUT = gql`
  mutation logUserOut {
    logUserOut @client
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

export const GET_PLACES = gql`
  query getPlaces {
    GetMyPlaces {
      ok
      error
      places {
        id
        name
        address
        isFavorite
      }
    }
  }
`;
