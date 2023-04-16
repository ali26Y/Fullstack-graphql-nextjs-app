import { gql } from "urql";

export const RegularUserFragment = gql`
  fragment RegularUser on User {
    id
    username
  }
`;
