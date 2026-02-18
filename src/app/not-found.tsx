import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main" className="container flex flex-1 flex-col items-center justify-center py-24">
        <h1 className="font-display text-4xl font-bold">404</h1>
        <p className="mt-2 text-muted-foreground">Page not found</p>
        <Button asChild className="mt-6">
          <Link href="/">Back to home</Link>
        </Button>
      </main>
      <Footer />
    </div>
  );
}
