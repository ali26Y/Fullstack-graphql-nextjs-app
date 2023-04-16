import { FieldError } from "../generated/graphql";

// this is a utility function to convert the errors from the server to a format that the form can understand
export const toErrorMap = (errors: FieldError[]) => {
  const errorMap: Record<string, string> = {};
  errors.forEach(({ field, message }) => {
    errorMap[field] = message;
  });
  return errorMap;
};
