"use server";

import db from "@/db";
import { user } from "@/db/schema";
import { auth } from "@/lib/auth";

export const adminLogin = async (email: string, password: string) => {
  try {
    const response = await auth.api.signInEmail({
      body: {
        email,
        password,
      },
      asResponse: true,
    });
    console.log(response);
  } catch (error) {
    console.error("Login Error:", error);
  }
};

export const createFirstAdmin = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  try {
    const existingAdmins = await db.select().from(user);

    console.log("Existing Admins: ", existingAdmins);

    if (existingAdmins && existingAdmins.length > 0) {
      throw new Error("An admin user already exists.");
    }

    const { name, email, password } = data;
    const response = await auth.api.signUpEmail({
      body: {
        name,
        email, // required
        password, // required
        callbackURL: "/dashboard", // optional
      },
    });
  } catch (error) {
    throw new Error("Error creating admin user.");
  }

  // Check if an admin already exists
};

export const adminSignOut = async () => {
  try {
    await auth.api.signOut();
  } catch (error) {
    throw new Error("Error signing out.");
  }
};
