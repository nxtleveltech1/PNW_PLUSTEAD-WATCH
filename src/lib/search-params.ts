import { incidentsSearchParamsSchema, registerSearchParamsSchema } from "@/lib/schemas";

export async function parseIncidentsSearchParams(
  searchParams: Promise<{ zone?: string; type?: string }>
) {
  const raw = await searchParams;
  const parsed = incidentsSearchParamsSchema.safeParse(raw);
  if (!parsed.success) return {};
  return parsed.data;
}

export async function parseRegisterSearchParams(searchParams: Promise<{ zone?: string }>) {
  const raw = await searchParams;
  const parsed = registerSearchParamsSchema.safeParse(raw);
  if (!parsed.success) return {};
  return parsed.data;
}
