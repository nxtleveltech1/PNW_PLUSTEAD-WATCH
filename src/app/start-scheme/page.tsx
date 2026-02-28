import Link from "next/link";
import { Header } from "@/components/layout/header-server";
import { Footer } from "@/components/layout/footer";
import { AnimateSection, AnimateItem } from "@/components/ui/animate-section";
import { SchemeInquiryForm } from "./scheme-inquiry-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ListOrdered } from "lucide-react";

const STEPS = [
  { n: 1, title: "Host a kick-off meeting", desc: "Invite your neighbours to attend." },
  { n: 2, title: "Attend training", desc: "Receive materials to share with your neighbours." },
  { n: 3, title: "Discuss your area", desc: "We'll meet with you to discuss concerns in your neighbourhood." },
  { n: 4, title: "Fill out the inquiry form", desc: "Or contact your local Community Service Officer." },
];

export default function StartSchemePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main" className="page-main">
        <AnimateSection>
          <div className="page-hero">
            <p className="eyebrow">Expansion</p>
            <h1 className="section-heading mt-2">
              <span className="headline-gradient">Start a Scheme</span>
            </h1>
            <p className="section-subheading">No active group in your area? Use this process to start one.</p>
          </div>
        </AnimateSection>

        <AnimateSection className="mt-12">
          <h2 className="font-display text-xl font-semibold text-foreground">4 steps to get started</h2>
          <div className="mt-6 space-y-4">
            {STEPS.map((s) => (
              <AnimateItem key={s.n}>
              <div className="card-elevated flex gap-4 rounded-2xl border-0 bg-card p-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/15 font-display font-semibold text-primary">
                  {s.n}
                </span>
                <div>
                  <p className="font-semibold">{s.title}</p>
                  <p className="text-sm text-muted-foreground">{s.desc}</p>
                </div>
              </div>
              </AnimateItem>
            ))}
          </div>
        </AnimateSection>

        <AnimateSection className="mt-16">
          <AnimateItem>
          <Card className="card-elevated max-w-md border-0">
            <CardHeader>
              <div className="flex items-center gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/15">
                  <ListOrdered className="h-6 w-6 text-primary" />
                </span>
                <div>
                  <CardTitle className="font-display text-xl text-foreground">
                    Inquiry form
                  </CardTitle>
                  <CardDescription>
                    We&apos;ll be in touch to discuss starting a scheme in your area.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <SchemeInquiryForm />
            </CardContent>
          </Card>
          </AnimateItem>
        </AnimateSection>

        <AnimateSection className="mt-12">
          <Button variant="outline" asChild>
            <Link href="/contact">Contact committee directly</Link>
          </Button>
        </AnimateSection>
      </main>
      <Footer />
    </div>
  );
}
