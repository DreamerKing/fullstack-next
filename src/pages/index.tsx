import { Layout } from "../components/Layout";
import { PostsQuery, usePostsQuery } from "src/generated/graphql";
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
import { UpdootSection } from "../components/UpdootSection";
import EditDeletePostButtons from "../components/EditDeletePostButtons";
import { withApollo } from "src/utils/withAopllo";

const Index = () => {
  const { data, loading, error, fetchMore, variables } = usePostsQuery({
    variables: {
      limit: 5,
      cursor: null as null | string,
    },
    notifyOnNetworkStatusChange: true,
  });

  if (error) {
    return <Layout>{error}</Layout>;
  }

  if (!loading && !data) {
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

      {!data && loading ? (
        <div>loading...</div>
      ) : (
        <Stack spacing={8}>
          {data!.posts?.posts?.map((p) =>
            !p ? null : (
              <Flex key={p.id} p={5} shadow="md" borderWidth="1px">
                <UpdootSection post={p} />
                <Box flex={1}>
                  <NextLink href="/post/[id]" as={`/post/${p.id}`}>
                    <Link>
                      <Heading fontSize="xl">{p.title}</Heading>
                    </Link>
                  </NextLink>
                  <Text flex={1} mt={4}>
                    posted by {p.creator.username}
                  </Text>
                  <Flex align="center">
                    <Text flex={1} mt={4}>
                      {p.textSnippet}
                    </Text>
                    <Box ml="auto">
                      <EditDeletePostButtons
                        id={p.id}
                        creatorId={p?.creator?.id}
                      />
                    </Box>
                  </Flex>
                </Box>
              </Flex>
            )
          )}
        </Stack>
      )}
      {data?.posts?.hasMore ? (
        <Flex>
          <Button
            onClick={() => {
              fetchMore({
                variables: {
                  limit: variables?.limit,
                  cursor:
                    data.posts.posts[data.posts.posts.length - 1].createdAt,
                },
                updateQuery: (
                  previousValue,
                  { fetchMoreResult }
                ): PostsQuery => {
                  if (!fetchMoreResult) {
                    return previousValue as PostsQuery;
                  }
                  return {
                    __typename: "Query",
                    posts: {
                      __typename: "PaginatedPosts",
                      hasMore: (fetchMoreResult as PostsQuery).posts.hasMore,
                      posts: [
                        ...(previousValue as PostsQuery).posts.posts,
                        ...(fetchMoreResult as PostsQuery).posts.posts,
                      ],
                    },
                  };
                },
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

export default withApollo({ ssr: true })(Index);
