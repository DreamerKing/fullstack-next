import { withApollo as createWithApollo } from "next-apollo";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { PaginatedPosts } from "src/generated/graphql";

const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_API_URL,
  credentials: "include",
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          posts: {
            keyArgs: ["query", "limit", "cursor"],
            merge(
              existing: PaginatedPosts | undefined,
              incoming: PaginatedPosts
            ): PaginatedPosts {
              return {
                ...incoming,
                posts: [...(existing?.posts ?? []), ...incoming?.posts],
              };
            },
          },
        },
      },
    },
  }),
});

export const withApollo = createWithApollo(client);
