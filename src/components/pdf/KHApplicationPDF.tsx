import {
    Page,
    Text,
    View,
    Image,
    StyleSheet,
    Font,
} from "@react-pdf/renderer";
import type { KHFormData } from "@/app/api/khardal-hasana/register/route";

Font.register({
    family: "Inter",
    fonts: [
        {
            src: "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff",
            fontWeight: 400,
        },
        {
            src: "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hiJ-Ek-_EeA.woff",
            fontWeight: 700,
        },
    ],
});

const s = StyleSheet.create({
    page: {
        fontFamily: "Inter",
        fontSize: 10,
        color: "#1F2937",
        paddingTop: 40,
        paddingBottom: 60,
        paddingHorizontal: 50,
        backgroundColor: "#ffffff",
    },
    // ── Header ──
    header: {
        marginBottom: 16,
        borderBottom: "2 solid #0D5C6B",
        paddingBottom: 12,
    },
    headerTitle: {
        fontSize: 14,
        fontWeight: 700,
        color: "#0D5C6B",
        textAlign: "center",
        marginBottom: 3,
    },
    headerSub: {
        fontSize: 8.5,
        color: "#6B7280",
        textAlign: "center",
    },
    // ── Membership badge ──
    badge: {
        backgroundColor: "#C9A84C",
        color: "#ffffff",
        padding: "3 10",
        fontSize: 10,
        fontWeight: 700,
        textAlign: "center",
        marginBottom: 10,
    },
    // ── Section heading ──
    sectionTitle: {
        fontSize: 10,
        fontWeight: 700,
        color: "#0D5C6B",
        backgroundColor: "#E8F4F6",
        padding: "4 8",
        marginBottom: 6,
        marginTop: 12,
    },
    // ── Field row ──
    row: {
        flexDirection: "row",
        marginBottom: 5,
        alignItems: "flex-start",
    },
    fieldLabel: {
        width: 130,
        fontWeight: 700,
        fontSize: 9,
        color: "#374151",
        paddingTop: 2,
    },
    fieldValue: {
        flex: 1,
        fontSize: 9,
        color: "#111827",
        borderBottom: "1 solid #E5E7EB",
        paddingBottom: 2,
        minHeight: 14,
    },
    // ── Family table ──
    tableHeader: {
        flexDirection: "row",
        backgroundColor: "#0D5C6B",
        padding: "4 6",
        marginBottom: 1,
    },
    tableHeaderCell: { color: "#ffffff", fontWeight: 700, fontSize: 8.5 },
    tableRow: { flexDirection: "row", borderBottom: "1 solid #E5E7EB", padding: "3 6", backgroundColor: "#F9FAFB" },
    tableRowAlt: { flexDirection: "row", borderBottom: "1 solid #E5E7EB", padding: "3 6", backgroundColor: "#ffffff" },
    tableCell: { fontSize: 8.5, color: "#374151" },
    // ── Declaration ──
    declarationBox: {
        border: "1.5 solid #0D5C6B",
        padding: "8 12",
        marginTop: 14,
        marginBottom: 10,
        backgroundColor: "#F9FAFB",
    },
    declarationText: {
        fontSize: 8.5,
        color: "#374151",
        lineHeight: 1.6,
        textAlign: "center",
    },
    // ── Signature block ──
    sigBlock: {
        marginTop: 10,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    sigSide: { width: "46%" },
    sigBox: {
        border: "1 solid #D1D5DB",
        borderRadius: 4,
        height: 52,
        backgroundColor: "#ffffff",
        marginBottom: 4,
        overflow: "hidden",
    },
    sigImage: { width: "100%", height: "100%", objectFit: "contain" },
    sigLabel: { fontSize: 8, color: "#6B7280" },
    sigDate: { fontSize: 9, fontWeight: 700, color: "#111827", paddingTop: 6, paddingLeft: 4 },
    // ── Office use ──
    officeBox: {
        border: "1 solid #E5E7EB",
        padding: "6 10",
        marginTop: 12,
    },
    officeTitle: {
        fontSize: 8,
        fontWeight: 700,
        color: "#9CA3AF",
        marginBottom: 6,
        textTransform: "uppercase",
        letterSpacing: 1,
    },
    officeGrid: { flexDirection: "row", flexWrap: "wrap" },
    officeField: { width: "48%", marginBottom: 5, marginRight: "2%" },
    officeFieldLabel: { fontSize: 8, color: "#9CA3AF", marginBottom: 1 },
    officeFieldLine: { borderBottom: "1 solid #D1D5DB", height: 12 },
    // ── Footer ──
    footer: {
        position: "absolute",
        bottom: 22,
        left: 50,
        right: 50,
        flexDirection: "row",
        justifyContent: "space-between",
        borderTop: "1 solid #E5E7EB",
        paddingTop: 5,
    },
    footerText: { fontSize: 7, color: "#9CA3AF" },
});

const col = { name: "40%", rel: "25%", dob: "20%", sex: "15%" };

export function KHApplicationPDF({
    data,
    signatureDataUrl,
}: {
    data: KHFormData;
    signatureDataUrl?: string | null;
}) {
    const today = new Date().toLocaleDateString("en-GB");
    const fee = data.membershipType === "family" ? "£300 (Family)" : "£200 (Individual)";

    return (
        <Page size="A4" style={s.page}>

            {/* Header */}
            <View style={s.header}>
                <Text style={s.headerTitle}>JMA KARDHAL HASANA — JANAZA FUND REGISTRATION FORM</Text>
                <Text style={s.headerSub}>Jaffna Muslim Association UK · Registered Charity No. 1143032</Text>
            </View>

            {/* Badge */}
            <Text style={s.badge}>
                {data.membershipType === "family" ? "Family Membership" : "Individual Membership"} — {fee}
            </Text>

            {/* Personal details */}
            <Text style={s.sectionTitle}>Personal Details</Text>
            {[
                ["First Name", data.firstName],
                ["Last Name", data.lastName],
                ["Address", data.address],
                ["Post Code", data.postCode],
                ["Mobile", data.mobile],
                ["Email", data.email],
                ["Emergency Contact", data.emergencyContact],
                ["Next of Kin", data.nextOfKin],
                ...(data.additionalDetails ? [["Additional Details", data.additionalDetails]] : []),
            ].map(([label, value]) => (
                <View key={label} style={s.row}>
                    <Text style={s.fieldLabel}>{label}</Text>
                    <Text style={s.fieldValue}>{value || " "}</Text>
                </View>
            ))}

            {/* Family members */}
            {data.familyMembers.length > 0 && (
                <>
                    <Text style={s.sectionTitle}>Family Members</Text>
                    <View style={s.tableHeader}>
                        <Text style={[s.tableHeaderCell, { width: col.name }]}>Full Name</Text>
                        <Text style={[s.tableHeaderCell, { width: col.rel }]}>Relationship</Text>
                        <Text style={[s.tableHeaderCell, { width: col.dob }]}>Date of Birth</Text>
                        <Text style={[s.tableHeaderCell, { width: col.sex }]}>Sex</Text>
                    </View>
                    {data.familyMembers.map((m, i) => (
                        <View key={i} style={i % 2 === 0 ? s.tableRow : s.tableRowAlt}>
                            <Text style={[s.tableCell, { width: col.name }]}>{m.fullName}</Text>
                            <Text style={[s.tableCell, { width: col.rel }]}>{m.relationship}</Text>
                            <Text style={[s.tableCell, { width: col.dob }]}>{m.dob}</Text>
                            <Text style={[s.tableCell, { width: col.sex }]}>{m.sex}</Text>
                        </View>
                    ))}
                </>
            )}

            {/* Declaration */}
            <View style={s.declarationBox}>
                <Text style={s.declarationText}>
                    I hereby agree to the Terms &amp; Conditions of the JMA Kardhal Hasana project.{"\n"}
                    I understand that membership fees are non-refundable and that this fund is solely{"\n"}
                    for burial expenditures of registered members.
                </Text>
            </View>

            {/* Signature block */}
            <View style={s.sigBlock}>
                {/* Signature side */}
                <View style={s.sigSide}>
                    <View style={s.sigBox}>
                        {signatureDataUrl ? (
                            <Image src={signatureDataUrl} style={s.sigImage} />
                        ) : null}
                    </View>
                    <Text style={s.sigLabel}>Signature</Text>
                </View>

                {/* Date side */}
                <View style={s.sigSide}>
                    <View style={s.sigBox}>
                        <Text style={s.sigDate}>{today}</Text>
                    </View>
                    <Text style={s.sigLabel}>Date</Text>
                </View>
            </View>

            {/* Office use */}
            <View style={s.officeBox}>
                <Text style={s.officeTitle}>For Office Use Only</Text>
                <View style={s.officeGrid}>
                    {["Membership No.", "Referred By", "Area", "Date"].map((f) => (
                        <View key={f} style={s.officeField}>
                            <Text style={s.officeFieldLabel}>{f}</Text>
                            <View style={s.officeFieldLine} />
                        </View>
                    ))}
                </View>
            </View>

            {/* Footer */}
            <View style={s.footer} fixed>
                <Text style={s.footerText}>JMA Kardhal Hasana · jaffnamuslims.org.uk</Text>
                <Text style={s.footerText}>Generated: {today}</Text>
            </View>

        </Page>
    );
}