import { gql } from "urql";
import { RegularUserFragment } from "../fragments/RegularUser";

export const meQuery = gql`
  ${RegularUserFragment}
  query me {
    me {
      ...RegularUser
    }
  }
`;
