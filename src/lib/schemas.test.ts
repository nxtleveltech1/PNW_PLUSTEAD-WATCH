import { describe, expect, test } from "bun:test";
import {
  businessListingSchema,
  businessMessageSchema,
  businessEventSchema,
  businessReferralSchema,
  businessListingsSearchParamsSchema,
} from "./schemas";

describe("businessListingSchema", () => {
  test("accepts valid listing", () => {
    const result = businessListingSchema.safeParse({
      name: "Test Shop",
      description: "A wonderful local shop with great products and service.",
      category: "RETAIL",
      email: "test@example.com",
    });
    expect(result.success).toBe(true);
  });

  test("rejects short name", () => {
    const result = businessListingSchema.safeParse({
      name: "A",
      description: "A wonderful local shop with great products and service.",
      category: "RETAIL",
      email: "test@example.com",
    });
    expect(result.success).toBe(false);
  });

  test("rejects short description", () => {
    const result = businessListingSchema.safeParse({
      name: "Test Shop",
      description: "Short",
      category: "RETAIL",
      email: "test@example.com",
    });
    expect(result.success).toBe(false);
  });

  test("rejects invalid email", () => {
    const result = businessListingSchema.safeParse({
      name: "Test Shop",
      description: "A wonderful local shop with great products and service.",
      category: "RETAIL",
      email: "invalid",
    });
    expect(result.success).toBe(false);
  });

  test("accepts valid URL for websiteUrl", () => {
    const result = businessListingSchema.safeParse({
      name: "Test Shop",
      description: "A wonderful local shop with great products and service.",
      category: "RETAIL",
      email: "test@example.com",
      websiteUrl: "https://example.com",
    });
    expect(result.success).toBe(true);
  });

  test("rejects invalid URL for websiteUrl", () => {
    const result = businessListingSchema.safeParse({
      name: "Test Shop",
      description: "A wonderful local shop with great products and service.",
      category: "RETAIL",
      email: "test@example.com",
      websiteUrl: "not-a-url",
    });
    expect(result.success).toBe(false);
  });
});

describe("businessMessageSchema", () => {
  test("accepts valid message", () => {
    const result = businessMessageSchema.safeParse({
      listingId: "clx123",
      body: "I would like to know more about your services.",
    });
    expect(result.success).toBe(true);
  });

  test("rejects short body", () => {
    const result = businessMessageSchema.safeParse({
      listingId: "clx123",
      body: "Short",
    });
    expect(result.success).toBe(false);
  });

  test("rejects empty listingId", () => {
    const result = businessMessageSchema.safeParse({
      listingId: "",
      body: "I would like to know more about your services.",
    });
    expect(result.success).toBe(false);
  });
});

describe("businessEventSchema", () => {
  test("accepts valid event", () => {
    const result = businessEventSchema.safeParse({
      title: "Networking Meetup",
      location: "Community Hall",
      startAt: "2025-03-01T10:00:00.000Z",
    });
    expect(result.success).toBe(true);
  });

  test("rejects end before start", () => {
    const result = businessEventSchema.safeParse({
      title: "Networking Meetup",
      location: "Community Hall",
      startAt: "2025-03-01T12:00:00.000Z",
      endAt: "2025-03-01T10:00:00.000Z",
    });
    expect(result.success).toBe(false);
  });
});

describe("businessReferralSchema", () => {
  test("accepts valid referral", () => {
    const result = businessReferralSchema.safeParse({
      listingId: "clx123",
      referredName: "Jane Doe",
      referredEmail: "jane@example.com",
    });
    expect(result.success).toBe(true);
  });

  test("rejects short name", () => {
    const result = businessReferralSchema.safeParse({
      listingId: "clx123",
      referredName: "J",
      referredEmail: "jane@example.com",
    });
    expect(result.success).toBe(false);
  });

  test("rejects invalid email", () => {
    const result = businessReferralSchema.safeParse({
      listingId: "clx123",
      referredName: "Jane Doe",
      referredEmail: "invalid",
    });
    expect(result.success).toBe(false);
  });
});

describe("businessListingsSearchParamsSchema", () => {
  test("accepts empty params", () => {
    const result = businessListingsSearchParamsSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  test("accepts valid category", () => {
    const result = businessListingsSearchParamsSchema.safeParse({
      category: "RETAIL",
    });
    expect(result.success).toBe(true);
  });

  test("rejects invalid category", () => {
    const result = businessListingsSearchParamsSchema.safeParse({
      category: "INVALID",
    });
    expect(result.success).toBe(false);
  });
});
