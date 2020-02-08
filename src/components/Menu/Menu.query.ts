import { gql } from 'apollo-boost';

export const TOGGLE_DRIVING_MODE = gql`
  mutation toggleDrivingMode {
    ToggleDrivingMode {
      ok
      error
    }
  }
`;

export const TOGGLE_THEME_MODE = gql`
  mutation toggleThemeMode {
    ToggleThemeMode {
      ok
      error
    }
  }
`;
