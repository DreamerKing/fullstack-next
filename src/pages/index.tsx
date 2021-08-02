import { Layout } from "../components/Layout";
import { withUrqlClient } from "next-Urql";
import createUrqlClient from "../utils/createUrqlClient";
import { usePostQuery } from "src/generated/graphql";
import { Flex, Link, Stack, Box, Heading, Text } from "@chakra-ui/react";
import NextLink from "next/link";

const Index = () => {
  const [{ data }] = usePostQuery({
    variables: {
      limit: 10,
    },
  });
  return (
    <Layout>
      <Flex align="center">
        <Heading>LiRedit</Heading>
        <NextLink href="/create-post">
          <Link ml="auto">create post</Link>
        </NextLink>
      </Flex>

      {!data ? (
        <div>loading...</div>
      ) : (
        <Stack spacing={8}>
          {data?.posts?.map((p) => {
            <Box key={p.id} p={5} shadow="md" borderWidth="1px">
              <Heading fontSize="xl">{p.title}</Heading>
              <Text>{p.textSnippet}</Text>
            </Box>;
          })}
        </Stack>
      )}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
