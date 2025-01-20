"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Plus } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";
import { createBroadcast } from "../../lib/actions";

export default function AddBroadcast() {
  const params = useParams();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newBroadcast, setNewBroadcast] = useState({
    message: "",
    time: new Date(),
  });

  async function handleAddBroadcast() {
    await createBroadcast({
      message: newBroadcast.message,
      time: newBroadcast.time,
      organizationId: params.id as string,
    });
    setNewBroadcast({ message: "", time: new Date() });
    setIsAddDialogOpen(false);
  }

  return (
    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Broadcast
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Create New Broadcast</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Message</label>
            <Textarea
              placeholder="Enter your broadcast message"
              value={newBroadcast.message}
              onChange={(e) =>
                setNewBroadcast({
                  ...newBroadcast,
                  message: e.target.value,
                })
              }
              className="min-h-[100px]"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Schedule For</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !newBroadcast.time && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {newBroadcast.time ? (
                    format(newBroadcast.time, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={newBroadcast.time}
                  onSelect={(date) =>
                    setNewBroadcast({
                      ...newBroadcast,
                      time: date || new Date(),
                    })
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <Button onClick={handleAddBroadcast} className="w-full">
            Create Broadcast
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
