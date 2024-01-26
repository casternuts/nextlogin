import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "lib/axios";
const nextAuthOptions = (req, res) => {
  return {
    pages: {
      signIn: "/auth/signIn",
    },
    providers: [
      CredentialsProvider({
        credentials: {
          id: { label: "Username", type: "text", placeholder: "jsmith" },
          pwd: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
          try {
            const response = await axios.post("/api/v1/auth/signin", {
              id: credentials?.id,
              pwd: credentials?.pwd,
              ip: "10.8.247.106",
              os: "mac",
              device: "mac",
            });

            const cookies = response.headers["set-cookie"];

            res.setHeader("Set-Cookie", cookies);

            return response.data;
          } catch (error) {
            console.log(error);
            throw Error(error.response);
          }
        },
      }),
    ],
    callbacks: {
      async jwt({ token, user, account }) {
        //console.log({ account });

        return { ...token, ...user };
      },
      async session({ session, token, user }) {
        session.user = token;

        return session;
      },
      async redirect({ url, baseUrl }) {
        // Allows relative callback URLs
        console.log("여기", url);
        if (url.startsWith("/")) return `${baseUrl}${url}`;
        // Allows callback URLs on the same origin
        else if (new URL(url).origin === baseUrl) return url;
        return baseUrl;
      },
    },
  };
};

export default (req, res) => {
  return NextAuth(req, res, nextAuthOptions(req, res));
};
