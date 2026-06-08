import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { authenticateUser } from "@/actions/auth/login";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      credentials: {
        identifier: {
          label: "Email or username",
          type: "text",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        const result = await authenticateUser(credentials);

        if (!result.ok) {
          return null;
        }

        return {
          id: result.user.id,
          email: result.user.email,
          name: result.user.username,
          username: result.user.username,
          role: result.user.role,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.username = user.username;
      }

      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.role = token.role ?? "user";
        session.user.username = token.username ?? session.user.name ?? "";
      }

      return session;
    },
  },
};
