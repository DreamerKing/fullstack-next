import { Cache, QueryInput } from "@urql/exchange-graphcache";
import { Exchange } from 'urql'
import { pipe, tap } from "wonka";
import Router from 'next/router'

export const errorExchange: Exchange =
  ({ forward }) =>
  (ops$) => {
    return pipe(
      forward(ops$),
      tap(({ error }) => {
        if (error) {
          Router.replace('/login');
        }
      })
    );
  };

export default function betterUpdateQuery<Result, Query>(
  cache: Cache,
  qi: QueryInput,
  result: any,
  fn: (r: Result, q: Query) => Query
) {
  return cache.updateQuery(qi, (data) => fn(result, data as any) as any);
}
