import { gql } from 'apollo-boost';

export const EDIT_PLACE = gql`
  mutation editPlace($placeId: Int!, $name: String, $isFavorite: Boolean) {
    EditPlace(placeId: $placeId, name: $name, isFavorite: $isFavorite) {
      ok
      error
    }
  }
`;
