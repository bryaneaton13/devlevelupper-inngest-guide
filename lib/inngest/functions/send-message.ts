import { prisma } from "@/lib/prisma/client";
import { inngest } from "../client";

export type SendMessageEvent = {
  data: {
    broadcastId: string;
    organizationId: string;
    message: string;
    userId: string;
    isLastMessage?: boolean;
  };
};

export const sendMessage = inngest.createFunction(
  {
    id: "send-message",
    concurrency: [
      {
        // Only run 2 messages at a time PER ORGANIZATION
        key: "event.data.organizationId",
        limit: 2,
      },
      {
        // Only run 10 messages at a time across all organizations
        limit: 10,
      },
    ],
  },
  { event: "message.send" },
  async ({ event, step }) => {
    const { message, userId, broadcastId, organizationId, isLastMessage } =
      event.data;
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new Error("User not found");
    }
    // Save a message to the database
    await step.run("save-message", async () => {
      await prisma.message.create({
        data: { message, userId, broadcastId, organizationId },
      });
    });

    if (isLastMessage) {
      await step.sendEvent("tell-everyone-last-message-sent", {
        name: "final-message-sent",
        data: { broadcastId, organizationId },
      });
    }

    // Add a fake delay to simulate a slow response
    await new Promise((resolve) => setTimeout(resolve, 2000));

    return { message: `Message sent` };
  }
);
