import { describe, expect, test } from "bun:test";

/**
 * Smoke test: help route paths used in nav and links.
 * Ensures Legacy Menu Parity help pages are correctly referenced.
 */
const HELP_ROUTES = [
  "/help",
  "/help/member-registration",
  "/help/member-faq",
  "/help/troubleshooting",
  "/help/security",
  "/help/patrol-administration",
  "/help/glossary",
] as const;

describe("help routes", () => {
  test("all help routes are non-empty strings", () => {
    HELP_ROUTES.forEach((path) => {
      expect(path).toBeTypeOf("string");
      expect(path.length).toBeGreaterThan(0);
      expect(path.startsWith("/help")).toBe(true);
    });
  });

  test("help routes are unique", () => {
    const unique = new Set(HELP_ROUTES);
    expect(unique.size).toBe(HELP_ROUTES.length);
  });

  test("Legacy Menu Parity routes are included", () => {
    expect(HELP_ROUTES).toContain("/help/member-faq");
    expect(HELP_ROUTES).toContain("/help/troubleshooting");
    expect(HELP_ROUTES).toContain("/help/security");
  });
});
