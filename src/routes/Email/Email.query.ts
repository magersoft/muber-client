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

export const EMAIL_SIGN_UP = gql`
  mutation emailSignUp(
    $firstName: String!,
    $lastName: String!,
    $email: String!,
    $password: String!,
    $profilePhoto: String!,
    $age: Int!,
    $phoneNumber: String!
  ) {
    EmailSignUp(
      firstName: $firstName,
      lastName: $lastName,
      email: $email,
      password: $password,
      profilePhoto: $profilePhoto,
      age: $age,
      phoneNumber: $phoneNumber
    ) {
      ok,
      error,
      token
    }
  }
`;
