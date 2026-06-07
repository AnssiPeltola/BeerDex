import argon2 from "argon2";

const ARGON2_HASH_OPTIONS: argon2.Options & { type: typeof argon2.argon2id } = {
  type: argon2.argon2id,
  // If free tier of neon database can handle this well, you can add more memoryCost
  memoryCost: 19456,
  timeCost: 2,
  parallelism: 1,
};

// hashPassword with made options
export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, ARGON2_HASH_OPTIONS);
}

// Verify if password is correct
export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  try {
    return await argon2.verify(hash, password);
  } catch {
    return false;
  }
}
