import Link from "next/link";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Building2, MessageSquare, Users, Calendar, FileText } from "lucide-react";

export default async function AdminOverviewPage() {
  const [pendingListings, incidentsCount, eventsCount, documentsCount, messagesCount, pendingMembers] = await Promise.all([
    prisma.businessListing.count({ where: { status: "PENDING" } }),
    prisma.incident.count(),
    prisma.event.count(),
    prisma.document.count(),
    prisma.contactMessage.count(),
    prisma.user.count({ where: { memberType: "MEMBER", isApproved: false } }),
  ]);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display text-lg">
            <AlertTriangle className="h-5 w-5 text-accent" />
            Incidents
          </CardTitle>
          <CardDescription>Total incidents in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold">{incidentsCount}</p>
          <Button asChild variant="outline" size="sm" className="mt-4">
            <Link href="/admin/incidents">View table</Link>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display text-lg">
            <Calendar className="h-5 w-5 text-primary" />
            Events
          </CardTitle>
          <CardDescription>Community events and meetings</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold">{eventsCount}</p>
          <Button asChild variant="outline" size="sm" className="mt-4">
            <Link href="/admin/events">Manage</Link>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display text-lg">
            <FileText className="h-5 w-5 text-primary" />
            Documents
          </CardTitle>
          <CardDescription>Total documents in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold">{documentsCount}</p>
          <Button asChild variant="outline" size="sm" className="mt-4">
            <Link href="/admin/documents">Manage</Link>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display text-lg">
            <Building2 className="h-5 w-5 text-primary" />
            Business approvals
          </CardTitle>
          <CardDescription>Listings awaiting approval</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold">{pendingListings}</p>
          <Button asChild variant="outline" size="sm" className="mt-4">
            <Link href="/admin/business">Review</Link>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display text-lg">
            <Users className="h-5 w-5 text-primary" />
            Member approvals
          </CardTitle>
          <CardDescription>Members awaiting approval</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold">{pendingMembers}</p>
          <Button asChild variant="outline" size="sm" className="mt-4">
            <Link href="/admin/members">Review</Link>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display text-lg">
            <MessageSquare className="h-5 w-5 text-primary" />
            Contact messages
          </CardTitle>
          <CardDescription>Messages from contact form</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold">{messagesCount}</p>
          <Button asChild variant="outline" size="sm" className="mt-4">
            <Link href="/admin/messages">View all</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
