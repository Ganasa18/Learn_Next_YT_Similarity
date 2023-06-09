import { NextAuthOptions } from "next-auth";
import { db } from "@/lib/db";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";

function getGoogleCredentials() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || clientId.length === 0) {
    throw new Error("No clientID for google provider set");
  }
  if (!clientSecret || clientSecret.length === 0) {
    throw new Error("No Client Secret for google provider set");
  }

  return { clientId, clientSecret };
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    GoogleProvider({
      clientId: getGoogleCredentials().clientId,
      clientSecret: getGoogleCredentials().clientSecret,
    }),
  ],
  callbacks: {
    session({ token, session }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
      }
      return session;
    },
    async jwt({ token, user }) {
      const dbuser = await db.user.findFirst({
        where: {
          email: token.email,
        },
      });

      if (!dbuser) {
        token.id = user!.id;
        return token;
      }
      return {
        id: dbuser.id,
        name: dbuser.name,
        email: dbuser.email,
        picture: dbuser.image,
      };
    },
    redirect() {
      return "/dashboard";
    },
  },
};
