import { Cache, QueryInput } from "@urql/exchange-graphcache";

// This is a helper function that will update the cache
export function betterUpdateQuery(
  cache: Cache,
  qi: QueryInput,
  result: any,
  fn: (r: any, q: any) => void
) {
  return cache.updateQuery(qi, (data) => fn(result, data as any) as any);
}
