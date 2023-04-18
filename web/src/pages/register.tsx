import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React from "react";
import { Wrapper } from "../components/Wrapper";
import { InputField } from "../components/InputField";
import { useMutation } from "urql";
import { registerMutation } from "../graphql/mutations/register";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/router";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
// import { useRegisterUserMutation } from "../generated/graphql";

interface registerProps {}

export const Register: React.FC<registerProps> = ({}) => {
  const router = useRouter();
  const [, register] = useMutation(registerMutation);
  // const [, register] = useRegisterUserMutation();
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ email: "", username: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await register(values);
          if (response.data?.register.errors) {
            setErrors(toErrorMap(response.data.register.errors));
          } else if (response.data?.register.user) {
            // worked
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="username"
              placeholder="username"
              label="Username"
            />
            <Box mt="4">
              <InputField name="email" placeholder="email" label="Email" />
            </Box>
            <Box mt="4">
              <InputField
                name="password"
                placeholder="password"
                label="Password"
                type="password"
              />
            </Box>
            <Box mt="4">
              <Button
                type="submit"
                backgroundColor="teal"
                color="white"
                isLoading={isSubmitting}
              >
                Register
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

// export default Register;
export default withUrqlClient(createUrqlClient)(Register);
