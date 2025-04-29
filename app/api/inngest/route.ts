import { inngest } from "@/lib/inngest/client";
import { broadcastCron } from "@/lib/inngest/functions/broadcast-cron";
import { sendBroadcast } from "@/lib/inngest/functions/send-broadcast";
import { sendMessage } from "@/lib/inngest/functions/send-message";
import { handleTextMessage } from "@/lib/inngest/functions/text_message_handler";
import { serve } from "inngest/next";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [sendBroadcast, broadcastCron, sendMessage, handleTextMessage],
});
