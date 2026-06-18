import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer, Document } from "@react-pdf/renderer";
import React from "react";
import { KHApplicationPDF } from "@/components/pdf/KHApplicationPDF";
import type { DocumentProps } from "@react-pdf/renderer";

async function sendEmail(pdfBuffer: Buffer, data: KHFormData) {
    if (!process.env.RESEND_API_KEY) {
        console.warn("[KH Register] No RESEND_API_KEY — skipping email send");
        return;
    }
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
        from: "JMA Website <noreply@jaffnamuslims.org.uk>",
        to: ["kh@jaffnamuslimuk.org"],
        subject: `New Khardal Hasana Registration — ${data.firstName} ${data.lastName}`,
        html: `
      <h2>New Khardal Hasana Registration</h2>
      <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Phone:</strong> ${data.mobile}</p>
      <p><strong>Address:</strong> ${data.address}, ${data.postCode}</p>
      <p><strong>Membership Type:</strong> ${data.membershipType}</p>
      <p><strong>Family Members:</strong> ${data.familyMembers.length}</p>
      <p>The completed and <strong>digitally signed</strong> application form is attached.</p>
    `,
        attachments: [
            {
                filename: `KH-Application-${data.firstName}-${data.lastName}.pdf`,
                content: pdfBuffer.toString("base64"),
            },
        ],
    });
}

export interface FamilyMember {
    fullName: string;
    relationship: string;
    dob: string;
    sex: string;
}

export interface KHFormData {
    firstName: string;
    lastName: string;
    address: string;
    postCode: string;
    mobile: string;
    email: string;
    emergencyContact: string;
    nextOfKin: string;
    additionalDetails: string;
    membershipType: "individual" | "family";
    familyMembers: FamilyMember[];
    signatureDataUrl?: string | null;
}

export async function POST(req: NextRequest) {
    try {
        const data: KHFormData = await req.json();

        if (!data.firstName || !data.lastName || !data.email || !data.mobile) {
            return NextResponse.json(
                { error: "Missing required fields." },
                { status: 400 }
            );
        }

        const element: React.ReactElement<DocumentProps> =
            React.createElement(
                Document as React.ComponentType<DocumentProps>,
                { title: `KH Application — ${data.firstName} ${data.lastName}` },
                React.createElement(KHApplicationPDF, {
                    data,
                    signatureDataUrl: data.signatureDataUrl ?? null,
                })
            );

        const pdfBuffer = Buffer.from(await renderToBuffer(element));

        try {
            await sendEmail(pdfBuffer, data);
        } catch (emailErr) {
            console.error("[KH Register] Email send failed:", emailErr);
        }

        return new NextResponse(new Uint8Array(pdfBuffer), {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="KH-Application-${data.firstName}-${data.lastName}.pdf"`,
                "Content-Length": pdfBuffer.length.toString(),
            },
        });
    } catch (err) {
        console.error("[KH Register] Error:", err);
        return NextResponse.json(
            { error: "Failed to process application. Please try again." },
            { status: 500 }
        );
    }
}