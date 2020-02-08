import { gql } from 'apollo-boost';

export const TOGGLE_DRIVING_MODE = gql`
  mutation toggleDrivingMode {
    ToggleDrivingMode {
      ok
      error
    }
  }
`;
