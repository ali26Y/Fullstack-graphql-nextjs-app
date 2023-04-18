import "reflect-metadata";
import { COOKIE_NAME, __prod__ } from "./constants";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import Redis from "ioredis";

import RedisStore from "connect-redis";
import session from "express-session";
import { sendEmail } from "./sendEmail";

// sets up the database connection
import "./typeorm.config";

const main = async () => {
  sendEmail("bob@bob.com", "hello");

  const app = express();

  app.set("trust proxy", !__prod__);
  app.set("Access-Control-Allow-Origin", "https://studio.apollographql.com");
  app.set("Access-Control-Allow-Credentials", true);

  const redis = new Redis();
  // @ts-ignore
  let redisStore = new RedisStore({
    // @ts-ignore
    client: redis,
    disableTouch: true,
    prefix: "myapp:",
  });

  // Initialize sesssion storage.
  app.use(
    session({
      name: COOKIE_NAME,
      store: redisStore,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true,
        sameSite: "lax", // make this "none" for studio.apollographql.com
        secure: __prod__, // cookie only works in https, make this "true" for studio.apollographql.com
      },
      saveUninitialized: false, // recommended: only save session when data exists
      secret: "keyboard cat",
      resave: false, // required: force lightweight session keep alive (touch)
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({
      req,
      res,
      redis,
    }),
  });
  await apolloServer.start();
  const cors = {
    credentials: true,
    origin: [
      "https://studio.apollographql.com",
      "http://localhost:3000",
      "http://localhost:4000",
    ],
  };
  apolloServer.applyMiddleware({ app, cors });

  app.get("/", (_, res) => {
    res.send("hello");
  });
  app.listen(4000, () => {
    console.log("server started on localhost:4000");
  });
};

main().catch((err) => {
  console.error(err);
});
