"use server";

import { prisma } from "./prisma/client";

export async function createOrganization({ name }: { name: string }) {
  return await prisma.organization.create({ data: { name } });
}

export async function createUser({
  name,
  organizationId,
  phone,
}: {
  name: string;
  organizationId: string;
  phone: string;
}) {
  return await prisma.user.create({
    data: { name, organizationId, phone },
  });
}

export async function createBroadcast({
  message,
  time,
  organizationId,
}: {
  message: string;
  time: Date;
  organizationId: string;
}) {
  return await prisma.broadcast.create({
    data: { message, time, organizationId },
  });
}
