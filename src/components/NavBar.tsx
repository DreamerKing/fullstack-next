import { Box, Flex, Link, Button, Heading } from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";
import { useMeQuery, useLogoutMutation } from "src/generated/graphql";
import { isServer } from "src/utils/isServer";
import { useRouter } from "next/router";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const { data, loading } = useMeQuery({ skip: isServer() });
  const [logout, { loading: logoutFetching }] = useLogoutMutation();
  const router = useRouter();

  let body = null;
  if (loading) {
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
        <Flex align="center">
          <NextLink href="/create-post">
            <Button as={Link} mr={4}>
              Create Post
            </Button>
          </NextLink>
          <Box mr={4}>{data.me.username}</Box>
          <Button
            onClick={async () => {
              await logout();
              // await apolloClient.resetStore();
              router.reload();
            }}
            isLoading={logoutFetching}
            variant="link"
          >
            logout
          </Button>
        </Flex>
      </Box>
    );
  }

  return (
    <Flex bg="tan" position="sticky" zIndex={1} top={0} p={4} align="center">
      <Flex flex={1} align="center" m="auto" maxW={800}>
        <NextLink href="/">
          <Link>
            <Heading>LiReddit</Heading>
          </Link>
        </NextLink>
        <Box ml={"auto"}>{body}</Box>
      </Flex>
    </Flex>
  );
};
