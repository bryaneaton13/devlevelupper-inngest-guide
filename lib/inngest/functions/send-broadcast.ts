import { prisma } from "@/lib/prisma/client";
import { inngest } from "../client";

export type SendBroadcastEvent = {
  data: {
    broadcastId: string;
    organizationId: string;
  };
};
export type FinalMessageSentEvent = {
  data: {
    broadcastId: string;
  };
};

export const sendBroadcast = inngest.createFunction(
  {
    id: "send-broadcast",
    concurrency: [
      {
        // Only run 1 broadcast at a time PER ORGANIZATION
        key: "event.data.organizationId",
        limit: 1,
      },
      {
        // Only run 5 broadcasts at a time across all organizations
        limit: 5,
      },
    ],
  },
  { event: "broadcast.send" },
  async ({ event, step }) => {
    const { broadcastId } = event.data;
    const finalResults: any = {};

    const broadcast = await step.run("get-broadcast", async () => {
      return await prisma.broadcast.findUnique({
        where: { id: broadcastId },
      });
    });
    if (!broadcast) {
      throw new Error("Broadcast not found");
    }

    if (broadcast.status !== "pending") {
      throw new Error("Broadcast is not pending");
    }

    // Mark the broadcast as sending
    await step.run("mark-broadcast-as-sending", async () => {
      await prisma.broadcast.update({
        where: { id: broadcastId },
        data: { status: "sending" },
      });
    });

    const organizationId = broadcast.organizationId;

    // Send all the messages to another inngest function
    const usersInOrg = await step.run("get-users-in-org", async () => {
      return await prisma.user.findMany({ where: { organizationId } });
    });

    if (usersInOrg.length === 0) {
      await step.run("no-users-in-org", async () => {
        await prisma.broadcast.update({
          where: { id: broadcastId },
          data: { status: "failed" },
        });
      });
      return;
    }
    finalResults.userCount = usersInOrg.length;

    const prepareMessages = usersInOrg.map((user) => ({
      message: broadcast.message,
      userId: user.id,
      broadcastId,
      organizationId,
    }));
    // Save the last message for passing another param
    const lastMessage = prepareMessages.pop();

    if (prepareMessages.length > 0) {
      // Inngest has a limit on how much data can be sent in a single event, 512kb, so we're batching by 50 userIds at a time
      // https://www.inngest.com/docs/events#sending-multiple-events-at-once
      const BATCH_SIZE = 50;
      for (let i = 0; i < prepareMessages.length; i += BATCH_SIZE) {
        const chunk = prepareMessages.slice(i, i + BATCH_SIZE);
        await step.sendEvent(
          `send-messages-in-batch-group-${i + 1}`,
          chunk.map((message) => ({ name: "message.send", data: message }))
        );
      }
    }

    // For the last message, apply an additional param so we know it's the last step
    if (lastMessage) {
      await step.sendEvent("send-last-message", {
        name: "message.send",
        data: { ...lastMessage, isLastMessage: true },
      });
    }

    const result = await step.waitForEvent("final-message-sent", {
      event: "final-message-sent",
      timeout: "10m",
      if: "async.data.broadcastId == event.data.broadcastId",
    });

    if (!result) {
      // We hit the timeout, but still want to mark the broadcast as sent
      finalResults.message = "Broadcast sent, but some users didn't receive it";
    } else {
      finalResults.message = "Broadcast sent";
    }

    await step.run("mark-broadcast-as-sent", async () => {
      await prisma.broadcast.update({
        where: { id: broadcastId },
        data: { status: "sent" },
      });
    });

    return finalResults;
  }
);
