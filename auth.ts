// configuring next-auth
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { client } from "./sanity/lib/client";
import { AUTHOR_BY_GITHUB_ID_QUERY } from "./sanity/lib/queries";
import { writeClient } from "./sanity/lib/write-client";

// now, when we create a session, we will check if the user has an author account
// if they do, we will add the author id to the session object
// else we will create a new author account for them
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, profile }) {
      const existingUser = await client
        .withConfig({ useCdn: false })
        .fetch(AUTHOR_BY_GITHUB_ID_QUERY, {
          id: profile?.id,
        });

      if (!existingUser) {
        await writeClient.create({
          _type: "author",
          id: profile?.id,
          name: user?.name,
          username: profile?.login,
          email: user?.email,
          image: user?.image,
          bio: profile?.bio || "",
        });
      }
      return true;
    },

    // made changes since newly created Startups were getting no author id
    async jwt({ token, account, profile }) {
      // On initial sign-in
      if (account && profile) {
        const user = await client
          .withConfig({ useCdn: false })
          .fetch(AUTHOR_BY_GITHUB_ID_QUERY, { id: profile.id });

        if (user) {
          token.id = user._id;
        }
      }

      // On subsequent calls (no account/profile)
      if (!token.id && token.email) {
        const user = await client
          .withConfig({ useCdn: false })
          .fetch(AUTHOR_BY_GITHUB_ID_QUERY, { email: token.email });

        if (user) {
          token.id = user._id;
        }
      }

      return token;
    },

    async session({ session, token }) {
      Object.assign(session, { id: token.id as string });
      return session;
    },
  },
});

// we fetched here from client, without caching, so that we can instantly get session.id in the frontend
