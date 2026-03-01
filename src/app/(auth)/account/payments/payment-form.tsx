"use client";

import { useState, useTransition } from "react";
import { usePaystackPayment } from "react-paystack";
import { toast } from "sonner";
import {
  CreditCard,
  Landmark,
  ShieldCheck,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  type PaymentTypeConfig,
  type PaymentTypeValue,
  formatCentsDisplay,
} from "@/lib/payment";
import {
  initializeAccountPayment,
  verifyAccountPayment,
  recordAccountEftPayment,
} from "./actions";

interface PaymentFormProps {
  email: string;
  memberNumber: number;
  firstName: string | null;
  paystackPublicKey: string;
  paymentTypes: PaymentTypeConfig[];
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
  amountCents,
  paystackPublicKey,
  onVerifying,
}: {
  reference: string;
  email: string;
  amountCents: number;
  paystackPublicKey: string;
  onVerifying: (ref: string) => void;
}) {
  const initPayment = usePaystackPayment({
    reference,
    email,
    amount: amountCents,
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
      Pay {formatCentsDisplay(amountCents)} now
    </Button>
  );
}

function PaystackButton({
  email,
  amountCents,
  paystackPublicKey,
  paymentType,
  description,
  onComplete,
}: {
  email: string;
  amountCents: number;
  paystackPublicKey: string;
  paymentType: PaymentTypeValue;
  description: string;
  onComplete: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [reference, setReference] = useState<string | null>(null);
  const [resolvedAmount, setResolvedAmount] = useState(amountCents);

  if (!reference) {
    return (
      <Button
        onClick={() => {
          startTransition(async () => {
            try {
              const result = await initializeAccountPayment(
                paymentType,
                amountCents,
                description || undefined,
              );
              setReference(result.reference);
              setResolvedAmount(result.amountCents);
            } catch {
              toast.error("Failed to initialize payment. Please try again.");
            }
          });
        }}
        disabled={isPending}
        className="w-full"
        size="lg"
      >
        {isPending ? "Preparing..." : `Pay ${formatCentsDisplay(amountCents)} now`}
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
      amountCents={resolvedAmount}
      paystackPublicKey={paystackPublicKey}
      onVerifying={(ref) => {
        startTransition(async () => {
          try {
            await verifyAccountPayment(ref);
            toast.success("Payment confirmed! Thank you.");
            onComplete();
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

export function PaymentForm({
  email,
  memberNumber,
  firstName,
  paystackPublicKey,
  paymentTypes,
  bankDetails,
}: PaymentFormProps) {
  const [selectedType, setSelectedType] = useState<PaymentTypeValue>("MEMBERSHIP");
  const [customAmountRands, setCustomAmountRands] = useState("");
  const [description, setDescription] = useState("");
  const [isPending, startTransition] = useTransition();
  const [formKey, setFormKey] = useState(0);

  const config = paymentTypes.find((t) => t.value === selectedType)!;
  const customCents = Math.round(parseFloat(customAmountRands || "0") * 100);
  const amountCents = config.fixedAmountCents ?? customCents;
  const amountValid = amountCents >= config.minAmountCents;

  const eftReference = firstName
    ? `${firstName}-${memberNumber}`
    : `PNW-${memberNumber}`;

  function resetForm() {
    setCustomAmountRands("");
    setDescription("");
    setFormKey((k) => k + 1);
  }

  function handleEftConfirm() {
    if (!amountValid) {
      toast.error(`Minimum amount is ${formatCentsDisplay(config.minAmountCents)}`);
      return;
    }
    startTransition(async () => {
      try {
        await recordAccountEftPayment(
          selectedType,
          amountCents,
          description || undefined,
        );
        toast.success(
          "EFT payment recorded. It will be confirmed once an admin verifies receipt.",
        );
        resetForm();
      } catch {
        toast.error("Something went wrong. Please try again.");
      }
    });
  }

  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <Label className="text-sm font-medium">Payment type</Label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {paymentTypes.map((pt) => (
            <button
              key={pt.value}
              type="button"
              onClick={() => {
                setSelectedType(pt.value);
                setCustomAmountRands("");
              }}
              className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
                selectedType === pt.value
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-background text-muted-foreground hover:bg-muted"
              }`}
            >
              {pt.label}
            </button>
          ))}
        </div>
      </div>

      {config.allowCustomAmount && (
        <div className="space-y-1.5">
          <Label htmlFor="amount">
            Amount (ZAR) — minimum {formatCentsDisplay(config.minAmountCents)}
          </Label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              R
            </span>
            <Input
              id="amount"
              type="number"
              min={config.minAmountCents / 100}
              step="1"
              placeholder="0"
              value={customAmountRands}
              onChange={(e) => setCustomAmountRands(e.target.value)}
              className="pl-7"
            />
          </div>
        </div>
      )}

      {selectedType !== "MEMBERSHIP" && (
        <div className="space-y-1.5">
          <Label htmlFor="description">Description (optional)</Label>
          <Textarea
            id="description"
            placeholder="e.g. Fun Run entry, patrol equipment donation"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            maxLength={200}
          />
        </div>
      )}

      <Tabs defaultValue="online" className="w-full" key={formKey}>
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
                Pay instantly with card via Paystack.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-muted/40 p-4">
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Payment type</dt>
                    <dd className="font-medium">{config.label}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Amount</dt>
                    <dd className="font-semibold">
                      {amountValid ? formatCentsDisplay(amountCents) : "—"}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Currency</dt>
                    <dd>ZAR (South African Rand)</dd>
                  </div>
                </dl>
              </div>
              {amountValid ? (
                <PaystackButton
                  key={`${selectedType}-${amountCents}-${formKey}`}
                  email={email}
                  amountCents={amountCents}
                  paystackPublicKey={paystackPublicKey}
                  paymentType={selectedType}
                  description={description}
                  onComplete={resetForm}
                />
              ) : (
                <Button disabled className="w-full" size="lg">
                  Enter a valid amount
                </Button>
              )}
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
                Make a direct bank transfer and let us know. Payment will be
                confirmed once an admin verifies receipt.
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
                    <dd className="font-semibold">
                      {amountValid ? formatCentsDisplay(amountCents) : "—"}
                    </dd>
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
                  know. An admin will verify your payment, usually within 1–2
                  business days.
                </p>
              </div>

              <Button
                onClick={handleEftConfirm}
                disabled={isPending || !amountValid}
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
    </div>
  );
}
