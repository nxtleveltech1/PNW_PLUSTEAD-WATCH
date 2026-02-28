import { PageShell } from "@/components/layout/page-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RegisterForm } from "../register-form";

export default async function GuestRegisterPage() {
  return (
    <PageShell>
      <Card className="w-full max-w-lg">
        <CardHeader>
          <p className="eyebrow">Onboarding</p>
          <CardTitle>Register as a guest</CardTitle>
          <CardDescription>You do not live in the Plumstead area. Complete your details before signing up.</CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm memberType="GUEST" zones={[]} streets={[]} />
        </CardContent>
      </Card>
    </PageShell>
  );
}
