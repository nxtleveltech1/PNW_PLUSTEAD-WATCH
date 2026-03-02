import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { MotionConfig } from "motion/react";
import { Syne, Source_Sans_3 } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { QueryProvider } from "@/components/providers/query-provider";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Plumstead Neighbourhood Watch",
  description: "Command-center platform for Plumstead community safety, incident awareness, and coordinated response.",
};

const clerkPubKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content = (
    <html lang="en" className={`${syne.variable} ${sourceSans.variable}`}>
      <body className="min-h-screen antialiased">
        <a
          href="#main"
          className="absolute left-4 top-4 z-[100] -translate-y-16 rounded-md bg-primary px-4 py-2 text-primary-foreground transition-transform focus:translate-y-0"
        >
          Skip to main content
        </a>
        <QueryProvider>
          <MotionConfig reducedMotion="user">
            {children}
            <Toaster />
          </MotionConfig>
        </QueryProvider>
      </body>
    </html>
  );

  if (clerkPubKey) {
    return <ClerkProvider>{content}</ClerkProvider>;
  }
  return content;
}
