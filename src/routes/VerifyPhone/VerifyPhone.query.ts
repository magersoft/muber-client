import { gql } from 'apollo-boost';

export const VERIFY_PHONE = gql`
  mutation completePhoneVerification($key: String!, $phoneNumber: String!) {
    CompletePhoneVerification(key: $key, phoneNumber: $phoneNumber) {
      ok
      error
      token
    }
  }
`;
