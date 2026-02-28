import { PageShell } from "@/components/layout/page-shell";
import { PageHero } from "@/components/layout/page-hero";
import Link from "next/link";

export default function TroubleshootingPage() {
  return (
    <PageShell>
      <PageHero eyebrow="Help" title="Troubleshooting" />
      <div className="prose prose-neutral mt-section max-w-none dark:prose-invert">
        <h2 className="font-display text-xl font-semibold">Is my browser supported?</h2>
        <p>
          This site works best in modern browsers: Chrome, Firefox, Safari, and Edge (latest versions). We recommend keeping your browser up to date for security and compatibility.
        </p>

        <h2 className="font-display mt-8 text-xl font-semibold">I&apos;m unable to sign in</h2>
        <p>
          Check that you are using the correct email address. If you have forgotten your password, use the &quot;Forgot password?&quot; link on the <Link href="/sign-in" className="text-primary hover:underline">sign-in page</Link>. You will receive an email with a reset link. Ensure your email provider is not blocking messages from our authentication provider.
        </p>

        <h2 className="font-display mt-8 text-xl font-semibold">Setting email and other preferences</h2>
        <p>
          Sign in and go to <Link href="/account/settings" className="text-primary hover:underline">Account → Settings</Link> to manage your email preferences, notification frequency, and other account options.
        </p>

        <h2 className="font-display mt-8 text-xl font-semibold">The site doesn&apos;t remember me or I get logged off</h2>
        <p>
          Session duration is managed by our authentication provider. If you are frequently logged out, try using a different browser or clearing cookies for this site and signing in again. Ensure &quot;Remember me&quot; (or equivalent) is selected when signing in if that option is offered.
        </p>

        <h2 className="font-display mt-8 text-xl font-semibold">I need more help</h2>
        <p>
          Contact us via the <Link href="/contact" className="text-primary hover:underline">Contact page</Link> or reach out to the membership administrator.
        </p>

        <p className="mt-8">
          <Link href="/help" className="text-primary hover:underline">Back to Help</Link>
          {" · "}
          <Link href="/help/member-registration" className="text-primary hover:underline">Member registration</Link>
        </p>
      </div>
    </PageShell>
  );
}
