import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";

type CreateUserInput = {
  email: string;
  username: string;
  passwordHash: string;
};

// All user related database queries goes into this file

export async function findUserByEmail(email: string) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  return user ?? null;
}

export async function findUserByUsername(username: string) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .limit(1);

  return user ?? null;
}

export async function createUser(input: CreateUserInput) {
  const [createdUser] = await db
    .insert(users)
    .values({
      email: input.email,
      username: input.username,
      passwordHash: input.passwordHash,
    })
    .returning({ id: users.id });

  return createdUser ?? null;
}
