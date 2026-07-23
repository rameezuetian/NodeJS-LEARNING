import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import type { User } from "@prisma/client";
import { prisma } from "./lib/prisma.js";
import {
  createAuthToken,
  hashPassword,
  verifyAuthToken,
  verifyPassword,
} from "./lib/auth.js";

type QueryArgs = {
  name?: string;
};

type AuthContext = {
  user: User | null;
};

type SignUpArgs = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

type LoginArgs = {
  email: string;
  password: string;
};

type CreateThreadArgs = {
  title: string;
  content?: string;
};

async function getUserFromRequest(request: express.Request) {
  const authHeader = request.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.slice("Bearer ".length).trim();
  const payload = verifyAuthToken(token);

  if (!payload?.sub) {
    return null;
  }

  return prisma.user.findUnique({
    where: { id: payload.sub },
  });
}

function requireUser(context: AuthContext) {
  if (!context.user) {
    throw new Error("Authentication required");
  }

  return context.user;
}

async function init() {
  const app = express();
  const port = Number(process.env.PORT) || 8000;

  app.use(express.json());

  const gqlServer = new ApolloServer<AuthContext>({
    typeDefs: `
      type User {
        id: ID!
        firstName: String!
        lastName: String!
        email: String!
        createdAt: String!
      }

      type Thread {
        id: ID!
        title: String!
        content: String
        createdAt: String!
        updatedAt: String!
        author: User!
      }

      type AuthPayload {
        token: String!
        user: User!
      }

      type Query {
        hello: String
        say(name: String): String
        me: User
        threads: [Thread!]!
      }

      type Mutation {
        signup(firstName: String!, lastName: String!, email: String!, password: String!): AuthPayload!
        login(email: String!, password: String!): AuthPayload!
        createThread(title: String!, content: String): Thread!
      }
    `,
    resolvers: {
      Query: {
        hello: () => "Hey there, I am a GraphQL server",
        say: (_parent: unknown, { name }: QueryArgs) =>
          `Hey ${name ?? "there"}, how are you?`,
        me: (_parent: unknown, _args: unknown, context: AuthContext) =>
          context.user,
        threads: async () =>
          prisma.thread.findMany({
            orderBy: { createdAt: "desc" },
            include: { author: true },
          }),
      },
      Mutation: {
        signup: async (
          _parent: unknown,
          { firstName, lastName, email, password }: SignUpArgs,
        ) => {
          const normalizedEmail = email.trim().toLowerCase();
          const existingUser = await prisma.user.findUnique({
            where: { email: normalizedEmail },
          });

          if (existingUser) {
            throw new Error("Email is already in use");
          }

          const user = await prisma.user.create({
            data: {
              firstName: firstName.trim(),
              lastName: lastName.trim(),
              email: normalizedEmail,
              passwordHash: hashPassword(password),
            },
          });

          return {
            token: createAuthToken({ userId: user.id, email: user.email }),
            user,
          };
        },
        login: async (
          _parent: unknown,
          { email, password }: LoginArgs,
        ) => {
          const normalizedEmail = email.trim().toLowerCase();
          const user = await prisma.user.findUnique({
            where: { email: normalizedEmail },
          });

          if (!user || !verifyPassword(password, user.passwordHash)) {
            throw new Error("Invalid email or password");
          }

          return {
            token: createAuthToken({ userId: user.id, email: user.email }),
            user,
          };
        },
        createThread: async (
          _parent: unknown,
          { title, content }: CreateThreadArgs,
          context: AuthContext,
        ) => {
          const user = requireUser(context);

          return prisma.thread.create({
            data: {
              title: title.trim(),
              content: content?.trim() || null,
              authorId: user.id,
            },
            include: { author: true },
          });
        },
      },
    },
  });

  await gqlServer.start();

  app.get("/", (_req, res) => {
    res.json({ message: "Server is up and running" });
  });

  app.use(
    "/graphql",
    expressMiddleware(gqlServer, {
      context: async ({ req }) => ({
        user: await getUserFromRequest(req),
      }),
    }),
  );

  app.listen(port, () => {
    console.log(`Server started at PORT: ${port}`);
  });
}

init().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
