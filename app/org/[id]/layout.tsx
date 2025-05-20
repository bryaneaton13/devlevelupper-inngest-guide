import { Building2 } from "lucide-react";
import Link from "next/link";
import NavLinks from "@/app/_components/NavLinks";
import { prisma } from "@/lib/prisma/client";
import { notFound } from "next/navigation";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const organization = await prisma.organization.findUnique({ where: { id } });

  if (!organization) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="flex h-16 items-center px-4 gap-8">
            <Link href="/" className="flex items-center gap-2">
              <Building2 className="h-6 w-6" />
              <span className="font-semibold">{organization?.name}</span>
            </Link>

            <NavLinks id={id} />
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto p-6">{children}</main>
    </div>
  );
}
