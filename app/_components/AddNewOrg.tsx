"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createOrganization } from "../../lib/actions";

export default function AddNewOrg() {
  const router = useRouter();
  const [newOrgName, setNewOrgName] = useState("");

  async function handleCreateOrg() {
    const createdOrg = await createOrganization({
      name: newOrgName,
    });
    router.push(`/org/${createdOrg.id}`);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Organization</CardTitle>
        <CardDescription>Start fresh with a new organization</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-3">
          <Input
            placeholder="Organization name"
            value={newOrgName}
            onChange={(e) => setNewOrgName(e.target.value)}
          />
          <Button onClick={handleCreateOrg}>
            <Plus className="mr-2 h-4 w-4" />
            Create
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
