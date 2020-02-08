import { gql } from 'apollo-boost';

export const UPDATE_PROFILE = gql`
  mutation updateProfile($firstName: String, $lastName: String, $email: String, $password: String, $profilePhoto: String, $age: Int) {
    UpdateMyProfile(firstName: $firstName, lastName: $lastName, email: $email, password: $password, profilePhoto: $profilePhoto, age: $age) {
      ok,
      error
    }
  }
`;
