"use client";

import { approveBusinessListing, rejectBusinessListing } from "../actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Listing = {
  id: string;
  name: string;
  category: string;
  email: string;
  status: string;
  createdAt: string;
};

export function BusinessApprovals({ listings }: { listings: Listing[] }) {
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Submitted</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {listings.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                No pending listings.
              </TableCell>
            </TableRow>
          ) : (
            listings.map((listing) => (
              <TableRow key={listing.id}>
                <TableCell className="font-medium">{listing.name}</TableCell>
                <TableCell>{listing.category}</TableCell>
                <TableCell>{listing.email}</TableCell>
                <TableCell>
                  {new Date(listing.createdAt).toLocaleDateString("en-ZA", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </TableCell>
                <TableCell className="text-right">
                  {listing.status === "PENDING" ? (
                    <div className="flex justify-end gap-2">
                      <form action={approveBusinessListing.bind(null, listing.id)}>
                        <Button type="submit" size="sm" variant="default">
                          Approve
                        </Button>
                      </form>
                      <form action={rejectBusinessListing.bind(null, listing.id)}>
                        <Button type="submit" size="sm" variant="outline">
                          Reject
                        </Button>
                      </form>
                    </div>
                  ) : (
                    <Badge variant={listing.status === "APPROVED" ? "default" : "secondary"}>
                      {listing.status}
                    </Badge>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
