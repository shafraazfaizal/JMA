import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const {
            amount,
            frequency,
            donationType,
            campaignId,
            campaignTitle,
            donorName,
            donorEmail,
            giftAid,
            isDedication,
            dedicationType,
            dedicationName,
        } = body;

        // Validate
        if (!amount || typeof amount !== "number" || amount < 1) {
            return NextResponse.json(
                { error: "Invalid donation amount." },
                { status: 400 }
            );
        }

        if (!donorEmail || !donorEmail.includes("@")) {
            return NextResponse.json(
                { error: "Invalid email address." },
                { status: 400 }
            );
        }

        // Amount in pence
        const amountPence = Math.round(amount * 100);

        // Build metadata
        const metadata: Record<string, string> = {
            donorName: donorName || "",
            donorEmail: donorEmail || "",
            donationType: donationType || "General",
            frequency: frequency || "one-time",
            giftAid: giftAid ? "yes" : "no",
            campaignId: campaignId || "",
            campaignTitle: campaignTitle || "General Fund",
            source: "jma-website",
        };

        if (isDedication && dedicationName) {
            metadata.dedicationType = dedicationType || "";
            metadata.dedicationName = dedicationName || "";
        }

        // Create PaymentIntent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountPence,
            currency: "gbp",
            metadata,
            receipt_email: donorEmail,
            description: `JMA Donation — ${donationType} — ${donorName}`,
            automatic_payment_methods: { enabled: true },
        });

        return NextResponse.json({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
        });
    } catch (err) {
        console.error("[donate/route] Stripe error:", err);
        return NextResponse.json(
            { error: "Payment initialisation failed. Please try again." },
            { status: 500 }
        );
    }
}