import { Box, Button, Flex, Link } from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";
import { useQuery, useMutation } from "urql";
import { meQuery } from "../graphql/queries/me";
import { logoutMutation } from "../graphql/mutations/logout";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const [{ data, fetching }] = useQuery({
    query: meQuery,
  });

  const [{ fetching: logoutFetching }, logout] = useMutation(logoutMutation);

  const logoutUser = async () => {
    await logout();
  };

  if (fetching) {
    return null;
  }

  return (
    <Flex bg="tan" p={4}>
      <Box ml="auto">
        {!fetching && !data?.me ? (
          <Flex>
            <Box mr="3">
              <NextLink href="/login">Login</NextLink>
            </Box>
            <NextLink href="/register">Register</NextLink>
          </Flex>
        ) : null}
        {!fetching && data?.me ? (
          <Flex>
            <Box mr="3">{data.me.username}</Box>
            <Button
              variant="link"
              onClick={logoutUser}
              isLoading={logoutFetching}
            >
              logout
            </Button>
          </Flex>
        ) : null}
      </Box>
    </Flex>
  );
};
