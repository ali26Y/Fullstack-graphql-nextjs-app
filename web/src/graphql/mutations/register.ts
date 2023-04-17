import { gql } from "urql";
import { RegularUserFragment } from "../fragments/RegularUser";

export const registerMutation = gql`
  ${RegularUserFragment}
  mutation Register($email: String!, $username: String!, $password: String!) {
    register(
      options: { email: $email, username: $username, password: $password }
    ) {
      errors {
        field
        message
      }
      user {
        ...RegularUser
      }
    }
  }
`;
