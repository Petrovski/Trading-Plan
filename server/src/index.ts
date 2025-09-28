import "dotenv/config";
import express from "express";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import { connectToMongo } from "./db";
import { typeDefs } from "./graphql/typeDefs";
import { resolvers } from "./graphql/resolvers";

async function start() {
  await connectToMongo(process.env.MONGODB_URI!);

  const app = express();
  app.use(cors({ origin: (process.env.CORS_ORIGIN ?? "*").split(",") }));
  app.use(express.json()); // Express 5 built-in body parser

  const apollo = new ApolloServer({ typeDefs, resolvers });
  await apollo.start();

  app.use("/graphql", expressMiddleware(apollo));

  const port = Number(process.env.PORT ?? 4000);
  app.listen(port, () => {
    console.log(`✅ Server on http://localhost:${port}`);
    console.log(`🚀 GraphQL at http://localhost:${port}/graphql`);
  });
}

start().catch((e) => {
  console.error(e);
  process.exit(1);
});
