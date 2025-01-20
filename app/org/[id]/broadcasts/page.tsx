import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import AddBroadcast from "@/app/_components/AddBroadcast";
import { prisma } from "@/lib/prisma/client";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const organizationId = (await params).id;
  const broadcasts = await prisma.broadcast.findMany({
    where: { organizationId },
    include: { _count: { select: { Messages: true } } },
    orderBy: { time: "asc" },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Broadcasts</h1>
          <p className="text-gray-600">Manage your message broadcasts</p>
        </div>

        <AddBroadcast />
      </div>

      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Message</TableHead>
              <TableHead>Scheduled For</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Progress</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {broadcasts.map((broadcast) => (
              <TableRow key={broadcast.id}>
                <TableCell className="font-medium">
                  {broadcast.message}
                </TableCell>
                <TableCell>{format(broadcast.time, "PPp")}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn({
                      "bg-yellow-50 text-yellow-700 border-yellow-200":
                        broadcast.status === "pending",
                      "bg-blue-50 text-blue-700 border-blue-200":
                        broadcast.status === "sending",
                      "bg-green-50 text-green-700 border-green-200":
                        broadcast.status === "sent",
                      "bg-red-50 text-red-700 border-red-200":
                        broadcast.status === "failed",
                    })}
                  >
                    {broadcast.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {broadcast._count.Messages.toLocaleString()} messages sent
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
