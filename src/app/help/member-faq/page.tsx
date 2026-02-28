import { PageShell } from "@/components/layout/page-shell";
import { PageHero } from "@/components/layout/page-hero";
import Link from "next/link";

export default function MemberFaqPage() {
  return (
    <PageShell>
      <PageHero eyebrow="Help" title="Member FAQ" />
      <div className="prose prose-neutral mt-section max-w-none dark:prose-invert">
        <h2 className="font-display text-xl font-semibold">Who can register as a member?</h2>
        <p>
          If you live in the area covered by Plumstead Neighbourhood Watch, you are eligible for membership.{" "}
          <Link href="/register" className="text-primary hover:underline">Register here</Link>.
        </p>

        <h2 className="font-display mt-8 text-xl font-semibold">Who can register as a guest?</h2>
        <p>
          If you do not live in the area but wish to stay informed about PNW activities, you may register as a guest.{" "}
          <Link href="/register/guest" className="text-primary hover:underline">Register as a guest</Link>.
        </p>

        <h2 className="font-display mt-8 text-xl font-semibold">I forgot my password. What do I do?</h2>
        <p>
          On the sign-in page, use the &quot;Forgot password?&quot; link. You will receive an email with instructions to reset your password.
        </p>

        <h2 className="font-display mt-8 text-xl font-semibold">How do I update my details?</h2>
        <p>
          Sign in and go to your <Link href="/account/profile" className="text-primary hover:underline">Account</Link> to update your profile, membership details, and email preferences.
        </p>

        <h2 className="font-display mt-8 text-xl font-semibold">How do I report an incident?</h2>
        <p>
          Use the <Link href="/incidents" className="text-primary hover:underline">Report</Link> or Incidents page. Report all incidents to CVIC on 0860 002 669 and crimes to SAPS 10111.
        </p>

        <h2 className="font-display mt-8 text-xl font-semibold">My street is not in the list. Can I still register?</h2>
        <p>
          If your street is not listed, do not register and contact the membership administrator for assistance. Street coverage is defined by the organisation.
        </p>

        <h2 className="font-display mt-8 text-xl font-semibold">How long until my registration is approved?</h2>
        <p>
          PNW reserves the right to refuse registration for any reason. If you have not received a response within a week, contact the membership administrator.
        </p>

        <p className="mt-8">
          <Link href="/help" className="text-primary hover:underline">Back to Help</Link>
          {" · "}
          <Link href="/help/glossary" className="text-primary hover:underline">Glossary</Link>
        </p>
      </div>
    </PageShell>
  );
}
