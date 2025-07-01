import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Placeholder for sending a Slack message (replace with real implementation)
export async function sendSlackAlert(message: string) {
  // TODO: Integrate with Slack API or webhook
  console.log("[SLACK ALERT]", message);
}
