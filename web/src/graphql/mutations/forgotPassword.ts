import { gql } from "urql";

export const forgotPasswordMutation = gql`
  mutation forgotPassword($email: String!) {
    forgotPassword(email: $email)
  }
`;
