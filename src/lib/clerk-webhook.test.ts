import { beforeEach, describe, expect, mock, test } from "bun:test";

const verifyMock = mock(() => ({ type: "user.created", data: { id: "user_123" } }));

mock.module("svix", () => ({
  Webhook: class {
    constructor(_secret: string) {}

    verify(body: string, headers: Record<string, string>) {
      return verifyMock(body, headers);
    }
  },
}));

import { verifyClerkWebhook } from "./clerk-webhook";

describe("verifyClerkWebhook", () => {
  beforeEach(() => {
    verifyMock.mockClear();
  });

  test("passes raw request body to svix verification", () => {
    const rawBody = "{\"type\":\"user.created\",\"data\":{\"id\":\"user_123\"}}\n";

    verifyClerkWebhook(rawBody, "whsec_test", {
      svixId: "msg_1",
      svixTimestamp: "1700000000",
      svixSignature: "sig_1",
    });

    expect(verifyMock).toHaveBeenCalledTimes(1);
    expect(verifyMock.mock.calls[0]?.[0]).toBe(rawBody);
    expect(verifyMock.mock.calls[0]?.[1]).toEqual({
      "svix-id": "msg_1",
      "svix-timestamp": "1700000000",
      "svix-signature": "sig_1",
    });
  });
});

