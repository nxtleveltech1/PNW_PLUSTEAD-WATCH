import { Header } from "@/components/layout/header-server";
import { Footer } from "@/components/layout/footer";
import Link from "next/link";

export default function MemberRegistrationHelpPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main" className="page-main">
        <div className="page-hero">
          <p className="eyebrow">Help</p>
          <h1 className="section-heading mt-2">Member Registration</h1>
        </div>
        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p>
            PNW reserves the right to refuse your registration for any reason whatsoever and is not obliged to enter into any communications with you thereafter.
          </p>
          <p>
            If you live in the area covered by PNW, you are eligible for membership. If you have not previously registered, you may do so by{" "}
            <Link href="/register" className="text-primary hover:underline">
              registering here
            </Link>
            .
          </p>
          <p>
            If you have previously registered and forgotten your username or password, you may retrieve these by signing in and using the &quot;Forgot password?&quot; link, then following the instructions in the email you receive.
          </p>
          <p>
            If you have any questions or require help regarding your membership or registration status, please contact the membership administrator.
          </p>

          <h2 className="font-display mt-10 text-xl font-semibold">Your details</h2>
          <p>
            The following fields are mandatory: First name, Last name, House number or name, and Street (select from the list). If your street is not listed, do not register and contact the membership administrator for assistance.
          </p>
          <p>
            We strongly advise you to provide an email address and cellphone number so that we may contact you in the event of an emergency at your registered address.
          </p>

          <h2 className="font-display mt-10 text-xl font-semibold">Additional contact details</h2>
          <p>
            Additional contact details are not required. The person you enter here will not receive any communication from us. The purpose is that we, or a neighbour, may contact them in the event of an emergency at your premises when you cannot be reached.
          </p>

          <h2 className="font-display mt-10 text-xl font-semibold">Privacy</h2>
          <p>
            By default, a limited amount of your registration detail (name, house number, phone, cell, and email) are available to members in your street so they can contact you if there&apos;s an emergency at your premises.
          </p>
          <p>
            The privacy setting allows you to hide your membership details from others in your street, though we do not recommend doing so.
          </p>

          <h2 className="font-display mt-10 text-xl font-semibold">Patrolling</h2>
          <p>
            If PNW undertakes patrols, selecting this option notifies us that you are prepared to do so.
          </p>
          <p>
            This option may not be available if: (1) PNW requires registration or other formal processes before you may patrol, or (2) PNW does not undertake member patrols. If the patrol checkbox is disabled, please contact your patrol administrator.
          </p>

          <h2 className="font-display mt-10 text-xl font-semibold">Email preferences</h2>
          <p>
            You may set your preferences for what type of email you receive and how often. The mail items are self-explanatory. If there is only one zone defined, the option for &quot;Receive incidents from other zones&quot; will be disabled.
          </p>
          <p>
            PNW may be affiliated with or receive automated information from other locally based neighbourhood watches. If you wish to receive notifications from these watches, select the relevant option.
          </p>

          <h2 className="font-display mt-10 text-xl font-semibold">Finish</h2>
          <p>
            Complete the form and click the submit button. If successful, you will receive a notification on screen and an email confirmation (if you entered an email address).
          </p>

          <p className="mt-10">
            <Link href="/help/glossary" className="text-primary hover:underline">
              Glossary of terms
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
