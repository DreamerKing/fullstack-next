import { Layout } from "../components/Layout";
import { withUrqlClient } from "next-Urql";
import createUrqlClient from "../utils/createUrqlClient";
import { usePostQuery } from "src/generated/graphql";
import {
  Flex,
  Link,
  Stack,
  Box,
  Heading,
  Text,
  Button,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useState } from "react";
import UpdootSection from "../components/UpdootSection";

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 5,
    cursor: null as null | string,
  });
  const [{ data, fetching }] = usePostQuery({
    variables,
  });
  console.log(variables, "variables", fetching, data);

  if (!fetching && !data) {
    return <div>you got query failed for some reason</div>;
  }

  return (
    <Layout>
      <Flex align="center">
        <Heading>LiRedit</Heading>
        <NextLink href="/create-post">
          <Link ml="auto">create post</Link>
        </NextLink>
      </Flex>

      {!data && fetching ? (
        <div>loading...</div>
      ) : (
        <Stack spacing={8}>
          {data!.posts?.posts?.map((p) => {
            return (
              <Flex key={p.id} p={5} shadow="md" borderWidth="1px">
                <UpdootSection points={p} />
                <Box>
                  <Heading fontSize="xl">{p.title}</Heading>
                  <Text>posted by {p.creator.username}</Text>
                  <Text>{p.textSnippet}</Text>
                </Box>
              </Flex>
            );
          })}
        </Stack>
      )}
      {data?.posts?.hasMore ? (
        <Flex>
          <Button
            onClick={() => {
              setVariables({
                limit: variables.limit,
                cursor: data.posts.posts[data.posts.posts.length - 1].createdAt,
              });
            }}
            m="auto"
            my={8}
          >
            load more
          </Button>
        </Flex>
      ) : null}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
