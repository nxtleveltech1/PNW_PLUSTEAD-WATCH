import { sendSystemNotification } from "@/lib/messaging";

export async function notifyMemberApproved(userId: string) {
  await sendSystemNotification(
    userId,
    "Membership Approved",
    "Your membership has been approved! You now have full access to the Plumstead Neighbourhood Watch platform. Welcome aboard.",
    { notificationType: "membership_approved", actionUrl: "/dashboard" }
  );
}

export async function notifyMemberRejected(userId: string) {
  await sendSystemNotification(
    userId,
    "Membership Update",
    "Your membership application has been reviewed. Please contact us if you have questions.",
    { notificationType: "membership_rejected", actionUrl: "/contact" }
  );
}

export async function notifyBusinessListingApproved(userId: string, listingName: string, listingId: string) {
  await sendSystemNotification(
    userId,
    "Business Listing Approved",
    `Your business listing "${listingName}" has been approved and is now visible in the directory.`,
    { notificationType: "listing_approved", entityId: listingId, actionUrl: `/business/${listingId}` }
  );
}

export async function notifyBusinessListingRejected(userId: string, listingName: string) {
  await sendSystemNotification(
    userId,
    "Business Listing Update",
    `Your business listing "${listingName}" was not approved. Please contact us for more information.`,
    { notificationType: "listing_rejected", actionUrl: "/contact" }
  );
}

export async function notifyIncidentInZone(userIds: string[], incidentType: string, location: string) {
  const subject = `Incident Alert: ${incidentType}`;
  const body = `A ${incidentType.toLowerCase()} incident has been reported at ${location}. Stay alert and report any suspicious activity.`;

  await Promise.all(
    userIds.map((uid) =>
      sendSystemNotification(uid, subject, body, {
        notificationType: "incident_alert",
        actionUrl: "/incidents",
      })
    )
  );
}

export async function notifyNewBusinessMessage(
  ownerId: string,
  senderName: string,
  listingName: string,
  listingId: string
) {
  await sendSystemNotification(
    ownerId,
    `New message about ${listingName}`,
    `${senderName} sent you a message about your business listing "${listingName}". Check your inbox to reply.`,
    { notificationType: "business_message", entityId: listingId, actionUrl: "/account/inbox?filter=business" }
  );
}
