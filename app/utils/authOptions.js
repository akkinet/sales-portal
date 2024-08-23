import CredentialsProvider from "next-auth/providers/credentials";
// import User from "../models/user";
// import dbConnect from "./dbConnect";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "username",
          type: "text",
        },
        password: {
          label: "password",
          type: "password",
        },
      },
      async authorize(credentials, req) {
        if (credentials.username == "demo" && credentials.password == "demo") {
          return {
            email: "demo@hex.com",
            name: "demo",
          };
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
    async jwt({ token, account }) {
      return token;
    },
    // async session({ session, token }) {
    //   return session;
    // },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
