"use server";

import { prisma } from "@/lib/prisma";
import argon2 from "argon2";
import { z } from "zod";
import { redirect } from "next/navigation";

const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function registerUser(formData: FormData) {
  const raw = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const parsed = registerSchema.safeParse(raw);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid input" };
  }

  const existing = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  });

  if (existing) {
    return { error: "An account with this email already exists" };
  }

  const passwordHash = await argon2.hash(parsed.data.password);

  await prisma.user.create({
    data: {
      email: parsed.data.email,
      passwordHash,
      status: "PENDING_ONBOARDING",
      country: "NG",
    },
  });

  redirect("/onboarding");
}