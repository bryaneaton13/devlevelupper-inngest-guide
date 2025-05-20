"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useState } from "react";
import { createUser } from "../../lib/actions";
import { useParams, useRouter } from "next/navigation";

export default function AddPerson() {
  const router = useRouter();
  const params = useParams();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newPerson, setNewPerson] = useState({ name: "", phone: "" });

  async function handleAddPerson() {
    await createUser({
      name: newPerson.name,
      phone: newPerson.phone,
      organizationId: params.id as string,
    });
    setNewPerson({ name: "", phone: "" });
    setIsAddDialogOpen(false);
    router.refresh();
  }

  return (
    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">
          <Plus className="mr-2 h-4 w-4" />
          Add Person
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Person</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input
              placeholder="Enter name"
              value={newPerson.name}
              onChange={(e) =>
                setNewPerson({ ...newPerson, name: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Phone</label>
            <Input
              placeholder="Enter phone number"
              value={newPerson.phone}
              onChange={(e) =>
                setNewPerson({ ...newPerson, phone: e.target.value })
              }
            />
          </div>
          <Button onClick={handleAddPerson} className="w-full">
            Add Person
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
