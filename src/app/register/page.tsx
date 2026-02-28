import { PageShell } from "@/components/layout/page-shell";
import { RegisterForm } from "./register-form";
import { prisma } from "@/lib/db";
import { parseRegisterSearchParams } from "@/lib/search-params";
import Link from "next/link";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ zone?: string }>;
}) {
  const { zone: zoneId } = await parseRegisterSearchParams(searchParams);
  const [zones, streets] = await Promise.all([
    prisma.zone.findMany({ orderBy: { name: "asc" }, include: { streets: { orderBy: { order: "asc" } } } }),
    prisma.street.findMany({ orderBy: { order: "asc" }, select: { id: true, name: true, zoneId: true } }),
  ]);
  const defaultZoneId = zoneId && zones.some((z) => z.id === zoneId) ? zoneId : zones[0]?.id;
  return (
    <PageShell>
      <div className="w-full max-w-5xl">
        <div className="mb-8">
          <p className="eyebrow">Onboarding</p>
          <h1 className="text-2xl font-semibold leading-none tracking-tight">Register as a member</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            You live in the Plumstead area. Complete your details before signing up.{" "}
            <Link href="/find" className="text-primary hover:underline">Find your zone</Link>
          </p>
        </div>
        <RegisterForm memberType="MEMBER" zones={zones} streets={streets} defaultZoneId={defaultZoneId} />
      </div>
    </PageShell>
  );
}
