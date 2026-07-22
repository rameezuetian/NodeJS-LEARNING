import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";

type QueryArgs = {
  name?: string;
};

async function init() {
  const app = express();
  const port = Number(process.env.PORT) || 8000;

  app.use(express.json());

  const gqlServer = new ApolloServer({
    typeDefs: `
      type Query {
        hello: String
        say(name: String): String
      }
    `,
    resolvers: {
      Query: {
        hello: () => "Hey there, I am a GraphQL server",
        say: (_parent: unknown, { name }: QueryArgs) =>
          `Hey ${name ?? "there"}, how are you?`,
      },
    },
  });

  await gqlServer.start();

  app.get("/", (_req, res) => {
    res.json({ message: "Server is up and running" });
  });

  app.use("/graphql", expressMiddleware(gqlServer));

  app.listen(port, () => {
    console.log(`Server started at PORT: ${port}`);
  });
}

init().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
