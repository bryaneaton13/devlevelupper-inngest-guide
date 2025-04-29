import { EventSchemas, Inngest } from "inngest";
import {
  FinalMessageSentEvent,
  SendBroadcastEvent,
} from "./functions/send-broadcast";
import { SendMessageEvent } from "./functions/send-message";
import { ProcessIncomingMessageEvent } from "./functions/process-incoming-message";

type Events = {
  "broadcast.send": SendBroadcastEvent;
  "message.send": SendMessageEvent;
  "final-message-sent": FinalMessageSentEvent;
  "incoming-message.process": ProcessIncomingMessageEvent;
};

// Create a client to send and receive events
export const inngest = new Inngest({
  id: "my-app",
  schemas: new EventSchemas().fromRecord<Events>(),
});
