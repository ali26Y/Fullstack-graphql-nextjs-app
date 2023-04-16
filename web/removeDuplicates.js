const fs = require("fs");

const file = "src/generated/graphql.ts";
const encoding = "utf-8";

// Read the file contents
const contents = fs.readFileSync(file, encoding);

// Replace the old LoginDocument with LoginDocumentQuery and add LoginDocumentMutation
const newContents = contents.replace(
  /export const LoginDocument = gql`([\s\S]*?)`;/,
  `export const LoginDocumentQuery = gql\`$1\`;

export const LoginDocumentMutation = gql\`
  mutation login($options: UsernamePasswordInput!) {
    login(options: $options) {
      errors {
        field
        message
      }
      user {
        id
        username
      }
    }
  }
\`;

export function useLoginMutation() {
  return Urql.useMutation<LoginMutation, LoginMutationVariables>(LoginDocumentMutation);
};
`
);

// Write the new contents back to the file
fs.writeFileSync(file, newContents, encoding);

console.log("File updated successfully!");
