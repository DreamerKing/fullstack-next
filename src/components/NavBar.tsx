import { Box, Flex, Link, Button } from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";
import { useMeQuery, useLogoutMutation } from "src/generated/graphql";
import { isServer } from "src/utils/isServer";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const [{ data, fetching }] = useMeQuery({ pause: isServer() });
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();

  let body = null;
  if (fetching) {
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href="/login">
          <Link color={"white"} mr={4}>
            login
          </Link>
        </NextLink>
        <NextLink href="/register">
          <Link color={"white"}> register </Link>
        </NextLink>
      </>
    );
  } else {
    body = (
      <Box>
        <Box>{data.me.username}</Box>
        <Button
          onClick={() => {
            logout();
          }}
          isLoading={logoutFetching}
          variant="link"
        >
          logout
        </Button>
      </Box>
    );
  }

  return (
    <Flex bg="tan" position="sticky" top={0} p={4}>
      <Box ml={"auto"}>{body}</Box>
    </Flex>
  );
};
