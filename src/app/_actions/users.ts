"use server";
// import db from "@/db";
// import { user } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const fetchUsers = async () => {
  const users = await auth.api
    .listUsers({
      query: {
        limit: 50, // optional, default is 100
      },
      headers: await headers(),
    })
    .catch(() => {
      throw new Error("Failed to fetch users");
    });
  // console.log("Listed Users:", users);
  return users;
};

export const createUser = async (data: {
  email: string;
  password: string;
  name: string;
  role: "user" | "admin";
}) => {
  await auth.api
    .createUser({
      body: {
        email: data.email, // required
        password: data.password, // required
        name: data.name, // required
        role: data.role,
      },
    })
    .catch(() => {
      throw new Error("Failed to create user");
    });
};

export const deleteUser = async (userId: string) => {
  await auth.api
    .removeUser({
      body: {
        userId: userId, // required
      },
      // This endpoint requires session cookies.
      headers: await headers(),
    })
    .catch(() => {
      throw new Error("Failed to delete user");
    });
};
