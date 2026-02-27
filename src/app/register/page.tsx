import { Header } from "@/components/layout/header-server";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main" className="page-main flex items-center justify-center">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <p className="eyebrow">Onboarding</p>
            <CardTitle>Register as a member</CardTitle>
            <CardDescription>
              You live in the Plumstead area. Complete your details before signing up.{" "}
              <Link href="/find" className="text-primary hover:underline">Find your zone</Link>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RegisterForm memberType="MEMBER" zones={zones} streets={streets} defaultZoneId={defaultZoneId} />
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
