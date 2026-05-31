import db from "@/db";
import { betterAuth } from "better-auth";
import { v4 as uuidv4 } from "uuid";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import * as schema from "@/db/schema/index";

export const auth = betterAuth({
  //...
  database: drizzleAdapter(db, {
    provider: "pg", // mysql, sqlite, etc. depending on your database
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),

  emailAndPassword: {
    enabled: true,
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24 * 1, // 1 days
    },
  },
  plugins: [nextCookies()],
  advanced: {
    database: {
      generateId: () => uuidv4(),
    },
  },
});
