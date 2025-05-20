import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Building2 } from "lucide-react";
import AddNewOrg from "./_components/AddNewOrg";
import { prisma } from "../lib/prisma/client";
import Link from "next/link";

export default async function Page() {
  const organizations = await prisma.organization.findMany({
    take: 25,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Welcome to Broadcast
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your organizations and send messages to your people
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <AddNewOrg />

          <Card>
            <CardHeader>
              <CardTitle>Select Organization</CardTitle>
              <CardDescription>
                Choose from existing organizations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {organizations.map((org) => (
                  <Button
                    key={org.id}
                    variant="outline"
                    asChild
                    className="w-full justify-start"
                  >
                    <Link href={`/org/${org.id}`}>
                      <Building2 className="mr-2 h-4 w-4" />
                      {org.name}
                    </Link>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
