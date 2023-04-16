import { fetchExchange } from "urql";
import { cacheExchange } from "@urql/exchange-graphcache";
import { betterUpdateQuery } from "./betterUpdateQuery";
import { meQuery } from "../graphql/queries/me";

export const createUrqlClient = (ssrExchange: any) => ({
  // ...add your Client options here
  url: "http://localhost:4000/graphql",
  fetchOptions: {
    credentials: "include" as const,
  },
  exchanges: [
    cacheExchange({
      updates: {
        Mutation: {
          logout: (_result, _args, cache, _info) => {
            betterUpdateQuery(cache, { query: meQuery }, _result, () => {
              console.log("result from logout mutation: ", _result);
              return { me: null };
            });
          },
          login: (_result, _args, cache, _info) => {
            betterUpdateQuery(
              cache,
              { query: meQuery },
              _result,
              (result, query) => {
                if (result.login.errors) {
                  return query;
                } else {
                  return {
                    me: result.login.user,
                  };
                }
              }
            );
          },
          register: (_result, _args, cache, _info) => {
            betterUpdateQuery(
              cache,
              { query: meQuery },
              _result,
              (result, query) => {
                if (result.register.errors) {
                  return query;
                } else {
                  return {
                    me: result.register.user,
                  };
                }
              }
            );
          },
        },
      },
    }),
    ssrExchange,
    fetchExchange,
  ],
});
