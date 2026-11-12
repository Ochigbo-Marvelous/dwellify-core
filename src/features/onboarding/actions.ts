"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const roleSchema = z.object({
  role: z.enum(["BUYER", "PROVIDER"]),
});

const profileSchema = z.object({
  fullName: z.string().min(3).max(100),
  phone: z.string().min(10).max(15),
});

const identitySchema = z.object({
  bvn: z.string().length(11).regex(/^\d+$/),
  nin: z.string().length(11).regex(/^\d+$/),
});

const countrySchema = z.object({
  country: z.literal("NG"),
});

export async function saveRole(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const parsed = roleSchema.safeParse({
    role: formData.get("role"),
  });

  if (!parsed.success) return { error: "Invalid role" };

  await prisma.user.update({
    where: { id: session.user.id },
    data: { role: parsed.data.role },
  });

  revalidatePath("/onboarding");
  return { success: true };
}

export async function saveCountry(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const country = formData.get("country");

  if (country !== "NG") {
    return { error: "Dwellify will be available in your region soon" };
  }

  const parsed = countrySchema.safeParse({ country });

  if (!parsed.success) {
    return { error: "Dwellify will be available in your region soon" };
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { country: "NG" },
  });

  revalidatePath("/onboarding");
  return { success: true };
}

export async function saveProfile(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const parsed = profileSchema.safeParse({
    fullName: formData.get("fullName"),
    phone: formData.get("phone"),
  });

  if (!parsed.success) return { error: "Invalid profile data" };

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      fullName: parsed.data.fullName,
      phone: parsed.data.phone,
    },
  });

  revalidatePath("/onboarding");
  return { success: true };
}

export async function saveIdentity(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const parsed = identitySchema.safeParse({
    bvn: formData.get("bvn"),
    nin: formData.get("nin"),
  });

  if (!parsed.success) return { error: "Invalid BVN or NIN" };

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      bvn: parsed.data.bvn,
      nin: parsed.data.nin,
      status: "ACTIVE",
    },
  });

  revalidatePath("/onboarding");
  return { success: true };
}

export async function saveProfilePhoto(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const file = formData.get("photo") as File | null;

  if (!file || file.size === 0) {
    return { error: "No photo provided" };
  }

  if (file.size > 2 * 1024 * 1024) {
    return { error: "Photo must be under 2MB" };
  }

  if (!file.type.startsWith("image/")) {
    return { error: "File must be an image" };
  }

  const photoPath = `/uploads/profiles/${session.user.id}-${Date.now()}.jpg`;

  await prisma.user.update({
    where: { id: session.user.id },
    data: { profilePhoto: photoPath },
  });

  revalidatePath("/onboarding");
  return { success: true, path: photoPath };
}