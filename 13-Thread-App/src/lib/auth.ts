import crypto from "node:crypto";

const HASH_KEY_LENGTH = 64;
const HASH_DIGEST = "sha512";
const TOKEN_TTL_MS = 1000 * 60 * 60 * 24 * 7;

type TokenPayload = {
  sub: string;
  email: string;
  exp: number;
};

function toBase64Url(value: string) {
  return Buffer.from(value).toString("base64url");
}

function fromBase64Url(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

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
  const payload: TokenPayload = {
    sub: userId,
    email,
    exp: Date.now() + TOKEN_TTL_MS,
  };

  const encodedPayload = toBase64Url(JSON.stringify(payload));
  const signature = crypto
    .createHmac(HASH_DIGEST, getTokenSecret())
    .update(encodedPayload)
    .digest("base64url");

  return `${encodedPayload}.${signature}`;
}

export function verifyAuthToken(token: string) {
  const [encodedPayload, signature] = token.split(".");

  if (!encodedPayload || !signature) {
    return null;
  }

  const expectedSignature = crypto
    .createHmac(HASH_DIGEST, getTokenSecret())
    .update(encodedPayload)
    .digest("base64url");

  if (expectedSignature !== signature) {
    return null;
  }

  try {
    const payload = JSON.parse(fromBase64Url(encodedPayload)) as TokenPayload;

    if (payload.exp <= Date.now()) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}
