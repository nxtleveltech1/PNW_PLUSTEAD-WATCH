import { Webhook } from "svix";
import type { WebhookEvent } from "@clerk/nextjs/server";

type SvixHeaders = {
  svixId: string;
  svixTimestamp: string;
  svixSignature: string;
};

export function verifyClerkWebhook(
  rawBody: string,
  secret: string,
  headers: SvixHeaders,
): WebhookEvent {
  const wh = new Webhook(secret);
  return wh.verify(rawBody, {
    "svix-id": headers.svixId,
    "svix-timestamp": headers.svixTimestamp,
    "svix-signature": headers.svixSignature,
  }) as WebhookEvent;
}

