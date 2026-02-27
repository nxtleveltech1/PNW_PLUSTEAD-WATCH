import { Header } from "@/components/layout/header-server";
import { Footer } from "@/components/layout/footer";
import Link from "next/link";

export default function PatrolAdministrationHelpPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main" className="page-main">
        <div className="page-hero">
          <p className="eyebrow">Help</p>
          <h1 className="section-heading mt-2">Patrol Administration</h1>
        </div>
        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="font-medium">
            Note: A patrol zone is a completely separate entity from a member zone. A patrol zone may comprise one or more member zones.
          </p>
          <p>
            If your organisation runs member patrols, you must set up the patrol functionality before assigning patrol slots. The main areas are:
          </p>
          <ul>
            <li>Email &amp; documentation options</li>
            <li>Patrol resources</li>
            <li>Patrol types</li>
            <li>Patrol zone setup</li>
          </ul>

          <h2 className="font-display mt-10 text-xl font-semibold">Patrol zone setup</h2>
          <p>
            To add a patrol zone, click the &quot;Add Patrol Zone&quot; button. The fields include:
          </p>
          <p>
            <strong>Is Special:</strong> Special patrol zones can be set up for specific operations (e.g. SAPS-requested traffic control). The patrol administrator may create a special zone comprising any number of member zones, active for a specified period. Members can book patrols in either their patrol zone or available special zones.
          </p>
          <p>
            If selected: Allow Bookings From Date, Runs To Date, and Runs From Date become available.
          </p>

          <h2 className="font-display mt-10 text-xl font-semibold">Patrol types</h2>
          <p>
            To edit a patrol type, click the edit icon next to the type. Fields include:
          </p>
          <ul>
            <li><strong>In Use:</strong> Whether the patrol type can be used when booking.</li>
            <li><strong>Designation:</strong> A 1–3 letter abbreviation (e.g. for the roster).</li>
            <li><strong>Description:</strong> Description of the patrol type.</li>
            <li><strong>Name:</strong> e.g. Vehicle patrol.</li>
          </ul>

          <h2 className="font-display mt-10 text-xl font-semibold">Patrol resources</h2>
          <p>
            To add a patrol resource, click &quot;Add Patrol Resource&quot;. Fields include:
          </p>
          <ul>
            <li><strong>In Use:</strong> Whether the resource is available when booking.</li>
            <li><strong>Description:</strong> e.g. Radio for patrol zone 1.</li>
            <li><strong>Name:</strong> e.g. Radio.</li>
          </ul>

          <h2 className="font-display mt-10 text-xl font-semibold">Email &amp; documentation options</h2>
          <p>
            The patrol roster may be emailed at various times. You can choose what information to include (e.g. to help patrollers recognise others in their zone). Additional options cover documentation category IDs for radio/call signs, suspicious persons, suspicious vehicles, and general patrol documentation. You can also enable email reminders 24 hours before a patrol and booking notifications.
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
