import { gql } from "urql";

export const RegularErrorFragment = gql`
  fragment RegularError on FieldError {
    field
    message
  }
`;
