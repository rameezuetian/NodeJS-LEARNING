import crypto from "node:crypto";
import jwt from "jsonwebtoken";

const HASH_KEY_LENGTH = 64;
const TOKEN_EXPIRES_IN = "7d";

export type TokenPayload = {
  sub: string;
  email: string;
};

function getTokenSecret() {
  return process.env.AUTH_TOKEN_SECRET || "dev-thread-app-secret";
}

export function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .scryptSync(password, salt, HASH_KEY_LENGTH)
    .toString("hex");

  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string) {
  const [salt, originalHash] = storedHash.split(":");

  if (!salt || !originalHash) {
    return false;
  }

  const candidateHash = crypto
    .scryptSync(password, salt, HASH_KEY_LENGTH)
    .toString("hex");

  return crypto.timingSafeEqual(
    Buffer.from(candidateHash, "hex"),
    Buffer.from(originalHash, "hex"),
  );
}

export function createAuthToken({
  userId,
  email,
}: {
  userId: string;
  email: string;
}) {
  return jwt.sign({ email }, getTokenSecret(), {
    subject: userId,
    expiresIn: TOKEN_EXPIRES_IN,
  });
}

export function verifyAuthToken(token: string) {
  try {
    const payload = jwt.verify(token, getTokenSecret());

    if (typeof payload === "string" || !payload.sub || !payload.email) {
      return null;
    }

    return {
      sub: String(payload.sub),
      email: String(payload.email),
    } satisfies TokenPayload;
  } catch {
    return null;
  }
}
