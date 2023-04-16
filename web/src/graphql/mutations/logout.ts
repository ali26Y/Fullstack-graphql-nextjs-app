import { gql } from "urql";

export const logoutMutation = gql`
  mutation logout {
    logout
  }
`;
