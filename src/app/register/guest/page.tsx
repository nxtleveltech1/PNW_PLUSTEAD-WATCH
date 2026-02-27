import { Header } from "@/components/layout/header-server";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RegisterForm } from "../register-form";

export default async function GuestRegisterPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main" className="page-main flex items-center justify-center">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <p className="eyebrow">Onboarding</p>
            <CardTitle>Register as a guest</CardTitle>
            <CardDescription>You do not live in the Plumstead area. Complete your details before signing up.</CardDescription>
          </CardHeader>
          <CardContent>
            <RegisterForm memberType="GUEST" zones={[]} />
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
