"use client";

import { useState, useTransition } from "react";
import { usePaystackPayment } from "react-paystack";
import { toast } from "sonner";
import { CreditCard, Landmark, ShieldCheck, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CopyButton } from "@/components/ui/copy-button";
import {
  initializePaystackPayment,
  verifyPaystackPayment,
  recordEftPayment,
} from "./actions";

interface PaymentOptionsProps {
  email: string;
  userId: string;
  memberNumber: number;
  firstName: string | null;
  feeCents: number;
  feeDisplay: string;
  paystackPublicKey: string;
  bankDetails: {
    accountName: string;
    bank: string;
    accountNumber: string;
    branchCode: string;
  };
}

function PaystackInner({
  reference,
  email,
  feeCents,
  feeDisplay,
  paystackPublicKey,
  onVerifying,
}: {
  reference: string;
  email: string;
  feeCents: number;
  feeDisplay: string;
  paystackPublicKey: string;
  onVerifying: (ref: string) => void;
}) {
  const initPayment = usePaystackPayment({
    reference,
    email,
    amount: feeCents,
    currency: "ZAR",
    publicKey: paystackPublicKey,
  });

  return (
    <Button
      onClick={() => {
        initPayment({
          onSuccess: (response: Record<string, unknown> | undefined) => {
            const ref =
              (response?.reference as string | undefined) ?? reference;
            onVerifying(ref);
          },
          onClose: () =>
            toast.info("Payment cancelled. You can try again anytime."),
        });
      }}
      className="w-full"
      size="lg"
    >
      Pay {feeDisplay} now
    </Button>
  );
}

function PaystackButton({
  email,
  userId,
  feeCents,
  feeDisplay,
  paystackPublicKey,
}: {
  email: string;
  userId: string;
  feeCents: number;
  feeDisplay: string;
  paystackPublicKey: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [reference, setReference] = useState<string | null>(null);

  if (!reference) {
    return (
      <Button
        onClick={() => {
          startTransition(async () => {
            try {
              const { reference: ref } = await initializePaystackPayment();
              setReference(ref);
            } catch {
              toast.error("Failed to initialize payment. Please try again.");
            }
          });
        }}
        disabled={isPending}
        className="w-full"
        size="lg"
      >
        {isPending ? "Preparing..." : `Pay ${feeDisplay} now`}
      </Button>
    );
  }

  if (isPending) {
    return (
      <Button disabled className="w-full" size="lg">
        Verifying payment...
      </Button>
    );
  }

  return (
    <PaystackInner
      reference={reference}
      email={email}
      feeCents={feeCents}
      feeDisplay={feeDisplay}
      paystackPublicKey={paystackPublicKey}
      onVerifying={(ref) => {
        startTransition(async () => {
          try {
            await verifyPaystackPayment(ref);
            toast.success("Payment confirmed! Welcome to PNW.");
          } catch {
            toast.error(
              "Payment verification failed. Please contact support.",
            );
          }
        });
      }}
    />
  );
}

export function PaymentOptions({
  email,
  userId,
  memberNumber,
  firstName,
  feeCents,
  feeDisplay,
  paystackPublicKey,
  bankDetails,
}: PaymentOptionsProps) {
  const [isPending, startTransition] = useTransition();

  function handleEftConfirm() {
    startTransition(async () => {
      try {
        await recordEftPayment();
        toast.success(
          "EFT payment recorded. Your membership is pending admin approval.",
        );
      } catch {
        toast.error("Something went wrong. Please try again.");
      }
    });
  }

  const eftReference = firstName
    ? `${firstName}-${memberNumber}`
    : `PNW-${memberNumber}`;

  return (
    <Tabs defaultValue="online" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="online" className="gap-2">
          <CreditCard className="h-4 w-4" />
          Pay Online
        </TabsTrigger>
        <TabsTrigger value="eft" className="gap-2">
          <Landmark className="h-4 w-4" />
          EFT / Bank Transfer
        </TabsTrigger>
      </TabsList>

      <TabsContent value="online">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Secure Online Payment
            </CardTitle>
            <CardDescription>
              Pay instantly with card via Paystack. Your membership is activated
              immediately.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-muted/40 p-4">
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Membership fee</dt>
                  <dd className="font-semibold">{feeDisplay}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Currency</dt>
                  <dd>ZAR (South African Rand)</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Payment for</dt>
                  <dd>Annual membership</dd>
                </div>
              </dl>
            </div>
            <PaystackButton
              email={email}
              userId={userId}
              feeCents={feeCents}
              feeDisplay={feeDisplay}
              paystackPublicKey={paystackPublicKey}
            />
            <p className="text-center text-xs text-muted-foreground">
              Secured by Paystack. We never store your card details.
            </p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="eft">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Landmark className="h-5 w-5 text-primary" />
              EFT / Bank Transfer
            </CardTitle>
            <CardDescription>
              Make a direct bank transfer and let us know. Your membership will
              be activated once an admin confirms receipt.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="rounded-lg border border-border/60 bg-muted/20 p-4">
              <dl className="space-y-0">
                <div className="detail-row">
                  <dt>Account name</dt>
                  <dd>{bankDetails.accountName}</dd>
                </div>
                <div className="detail-row">
                  <dt>Bank</dt>
                  <dd>{bankDetails.bank}</dd>
                </div>
                <div className="detail-row">
                  <dt>Account number</dt>
                  <dd className="flex items-center gap-2">
                    <span className="font-mono text-lg">
                      {bankDetails.accountNumber}
                    </span>
                    <CopyButton
                      value={bankDetails.accountNumber.replace(/\s/g, "")}
                      label="Account number copied"
                    />
                  </dd>
                </div>
                <div className="detail-row">
                  <dt>Branch code</dt>
                  <dd className="font-mono">{bankDetails.branchCode}</dd>
                </div>
                <div className="detail-row">
                  <dt>Amount</dt>
                  <dd className="font-semibold">{feeDisplay}</dd>
                </div>
                <div className="detail-row">
                  <dt>Reference</dt>
                  <dd className="flex items-center gap-2">
                    <span className="font-mono">{eftReference}</span>
                    <CopyButton value={eftReference} label="Reference copied" />
                  </dd>
                </div>
              </dl>
            </div>

            <div className="flex items-start gap-3 rounded-lg bg-amber-50 p-4 dark:bg-amber-950/30">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
              <p className="text-sm text-amber-800 dark:text-amber-200">
                After making the EFT payment, click the button below to let us
                know. An admin will verify your payment and activate your
                membership, usually within 1-2 business days.
              </p>
            </div>

            <Button
              onClick={handleEftConfirm}
              disabled={isPending}
              variant="outline"
              className="w-full"
              size="lg"
            >
              {isPending
                ? "Recording..."
                : "I've made the EFT payment"}
            </Button>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
