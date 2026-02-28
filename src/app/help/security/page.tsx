import { PageShell } from "@/components/layout/page-shell";
import { PageHero } from "@/components/layout/page-hero";
import Link from "next/link";

export default function SecurityPage() {
  return (
    <PageShell>
      <PageHero eyebrow="Help" title="Security of Information" />
      <div className="prose prose-neutral mt-section max-w-none dark:prose-invert">
        <h2 className="font-display text-xl font-semibold">How we protect your data</h2>
        <p>
          Plumstead Neighbourhood Watch takes the security of your personal information seriously. We use industry-standard practices to store and transmit data, including encryption where appropriate.
        </p>

        <h2 className="font-display mt-8 text-xl font-semibold">What information do we collect?</h2>
        <p>
          We collect the information you provide when registering: name, contact details, address (for members), and preferences. See our{" "}
          <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link> for full details.
        </p>

        <h2 className="font-display mt-8 text-xl font-semibold">Who has access to my information?</h2>
        <p>
          Authorised PNW administrators and coordinators may access member information for operational purposes. A limited amount of your details (name, house number, phone, email) may be visible to members in your street for emergency contact, unless you have chosen to hide your details.
        </p>

        <h2 className="font-display mt-8 text-xl font-semibold">Privacy setting</h2>
        <p>
          You can choose to hide your details from other members in your street via your <Link href="/account/membership" className="text-primary hover:underline">Account → Membership</Link> settings. We do not recommend doing so, as it may limit neighbours&apos; ability to reach you in an emergency.
        </p>

        <h2 className="font-display mt-8 text-xl font-semibold">Concerns or questions</h2>
        <p>
          If you have concerns about how your information is handled, please contact us via the{" "}
          <Link href="/contact" className="text-primary hover:underline">Contact page</Link> or the membership administrator.
        </p>

        <p className="mt-8">
          <Link href="/help" className="text-primary hover:underline">Back to Help</Link>
          {" · "}
          <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
        </p>
      </div>
    </PageShell>
  );
}
