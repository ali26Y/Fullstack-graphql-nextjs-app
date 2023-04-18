import { gql } from "urql";
import { RegularUserResponse } from "../fragments/RegularUserResponse";

export const registerMutation = gql`
  ${RegularUserResponse}

  mutation Register($email: String!, $username: String!, $password: String!) {
    register(
      options: { email: $email, username: $username, password: $password }
    ) {
      ...RegularUserResponse
    }
  }
`;
