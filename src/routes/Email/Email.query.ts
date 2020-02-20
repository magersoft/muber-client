import { gql } from 'apollo-boost';

export const EXIST_USER = gql`
  mutation existUser($email: String!) {
    RequestEmailExist(email: $email) {
      ok
      error
      exist
    }
  }
`;

export const EMAIL_SIGN_IN = gql`
  mutation emailSingIn($email: String!, $password: String!) {
    EmailSignIn(email: $email, password: $password) {
      ok
      error
      token
    }
  }
`;
