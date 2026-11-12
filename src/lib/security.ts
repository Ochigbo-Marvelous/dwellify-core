import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function requireAuth() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  return session;
}

export async function requireActiveUser() {
  const session = await requireAuth();

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { status: true, role: true },
  });

  if (!user || user.status !== "ACTIVE") {
    redirect("/onboarding");
  }

  return { session, user };
}

export async function requireAdmin() {
  const { session, user } = await requireActiveUser();

  if (user.role !== "ADMIN") {
    // Log unauthorized admin access attempt
    await prisma.securityAuditLog.create({
      data: {
        userId: session.user.id,
        eventType: "UNAUTHORIZED_ADMIN_ACCESS",
        details: { path: "admin_route" },
      },
    });
    redirect("/");
  }

  return { session, user };
}