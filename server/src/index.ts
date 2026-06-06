import "dotenv/config";
import express from "express";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import { connectToMongo } from "./db";
import { typeDefs } from "./graphql/resolvers/typeDefs";
import { resolvers } from "./graphql/resolvers";
import { importRoutes } from "./routes/importRoutes";
import { tradeRoutes } from "./routes/tradeRoutes";
import { tradeStatsRoutes } from "./routes/tradeStatsRoutes";

async function start() {
  await connectToMongo(process.env.MONGODB_URI!);

  const app = express();

  app.use(cors({ origin: (process.env.CORS_ORIGIN ?? "*").split(",") }));
  app.use(express.json());

  app.use("/api/imports", importRoutes);
  app.use("/api/trades", tradeRoutes);
  app.use("/api/trade-stats", tradeStatsRoutes);

  const apollo = new ApolloServer({ typeDefs, resolvers });
  await apollo.start();

  app.use("/graphql", expressMiddleware(apollo));

  const port = Number(process.env.PORT ?? 4000);
  app.listen(port, () => {
    console.log(`✅ Server on http://localhost:${port}`);
    console.log(`📥 REST imports at http://localhost:${port}/api/imports`);
    console.log(`🚀 GraphQL at http://localhost:${port}/graphql`);
  });
}

start().catch((error) => {
  console.error(error);
  process.exit(1);
});
