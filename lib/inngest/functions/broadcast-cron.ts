import { prisma } from "@/lib/prisma/client";
import { inngest } from "../client";

export const broadcastCron = inngest.createFunction(
  { id: "broadcast-cron" },
  { cron: "*/1 * * * *" }, // Every minute
  async ({ event, step }) => {
    // See if there are any broadcasts that are pending and the date is in the past
    const broadcasts = await prisma.broadcast.findMany({
      where: { status: "pending", time: { lte: new Date() } },
    });

    for (const broadcast of broadcasts) {
      await step.sendEvent("send-broadcast", {
        name: "broadcast.send",
        data: {
          broadcastId: broadcast.id,
          organizationId: broadcast.organizationId,
        },
      });
    }
  }
);
