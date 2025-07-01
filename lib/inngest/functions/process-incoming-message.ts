import { inngest } from "../client";
// @ts-expect-error: If you haven't installed @inngest/agent-kit, run: pnpm add @inngest/agent-kit
import {
  createAgent,
  createNetwork,
  openai,
  Agent,
  NetworkRouterParams,
} from "@inngest/agent-kit";
import { sendSlackAlert } from "@/lib/utils";

export type ProcessIncomingMessageEvent = {
  data: {
    message: string;
    userId: string;
    organizationId: string;
  };
};

// Agent 1: Unsubscribe detection
const unsubscribeAgent = createAgent({
  name: "UnsubscribeAgent",
  description: "Detects unsubscribe requests.",
  system:
    "If the message contains words like 'unsubscribe', 'stop', or 'remove me', respond with 'unsubscribe'. Otherwise, respond with 'pass'.",
  model: openai({ model: "gpt-3.5-turbo" }),
});

// Agent 2: Simple keyword detection
const keywordAgent = createAgent({
  name: "KeywordAgent",
  description: "Detects simple keywords like 'help' or 'info'.",
  system:
    "If the message contains 'help', 'info', or 'support', respond with the keyword. Otherwise, respond with 'pass'.",
  model: openai({ model: "gpt-3.5-turbo" }),
});

// Agent 3: Harm detection
const harmDetectionAgent = createAgent({
  name: "HarmDetectionAgent",
  description: "Detects if the user is expressing self-harm or harmful intent.",
  system:
    "If the message contains language indicating the user may harm themselves or others, respond with 'harm'. Otherwise, respond with 'safe'.",
  model: openai({ model: "gpt-3.5-turbo" }),
});

// Agent 4: LLM intent detection
const llmAgent = createAgent({
  name: "LLMAgent",
  description: "Uses LLM to interpret user intent.",
  system: "Summarize what the user is trying to say in a short sentence.",
  model: openai({ model: "gpt-3.5-turbo" }),
});

// Router: Runs agents in order, stops if a match is found
const router = ({
  lastResult,
  callCount,
  network,
  input,
}: NetworkRouterParams): Agent | undefined => {
  if (callCount === 0) return unsubscribeAgent;
  if (callCount === 1) return keywordAgent;
  if (callCount === 2) return harmDetectionAgent;
  if (callCount === 3) return llmAgent;
  return undefined;
};

const networkInstance = createNetwork({
  name: "IncomingMessageNetwork",
  agents: [unsubscribeAgent, keywordAgent, harmDetectionAgent, llmAgent],
  defaultModel: openai({ model: "gpt-3.5-turbo" }),
  router,
});

export const processIncomingMessage = inngest.createFunction(
  {
    id: "process-incoming-message",
  },
  { event: "incoming-message.process" },
  async ({ event, step }) => {
    const { message, userId, organizationId } = event.data;
    const result = await networkInstance.run(message);

    // Check harm detection result
    const harmResult = result.output.find(
      (msg: any) => msg.agent === "HarmDetectionAgent" && msg.content === "harm"
    );
    if (harmResult) {
      await sendSlackAlert(
        `Harmful message detected from user ${userId} in org ${organizationId}: ${message}`
      );
    }

    return { result };
  }
);
