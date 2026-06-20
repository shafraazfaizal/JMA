// ============================================
// QURBANI / EID AL-ADHA DATE CONFIG
// ============================================
// Update this file once a year when the moon-sighting-confirmed
// (or best-estimate) Gregorian date for Eid al-Adha is known.
//
// Eid al-Adha falls on 10th Dhul Hijjah. The order window is
// typically open from ~30 days before through 13th Dhul Hijjah
// (the last day of Tashreeq).
//
// isConfirmed: false means the date is an astronomical estimate
// and subject to moon-sighting confirmation closer to the time.

export interface EidDate {
    year: number;
    eidDate: string;      // ISO format YYYY-MM-DD — 10th Dhul Hijjah
    windowOpensDate: string;  // ISO format — when ordering opens (~30 days before)
    windowClosesDate: string; // ISO format — 13th Dhul Hijjah (end of Tashreeq)
    isConfirmed: boolean;
}

export const eidAlAdhaDates: EidDate[] = [
    {
        year: 2026,
        eidDate: "2026-05-27",
        windowOpensDate: "2026-04-27",
        windowClosesDate: "2026-05-30",
        isConfirmed: false,
    },
    {
        year: 2027,
        eidDate: "2027-05-16",
        windowOpensDate: "2027-04-16",
        windowClosesDate: "2027-05-19",
        isConfirmed: false,
    },
    {
        year: 2028,
        eidDate: "2028-05-05",
        windowOpensDate: "2028-04-05",
        windowClosesDate: "2028-05-08",
        isConfirmed: false,
    },
];

// Last completed Qurbani season stats — update after each Eid
export const lastQurbaniImpact = {
    year: 2025,
    sharesCompleted: 340,
    familiesFed: 1850,
    animalsSlaughtered: 95,
};

/**
 * Returns the relevant Eid date entry — the next upcoming one,
 * or the current one if we're inside an active window.
 */
export function getRelevantEidDate(referenceDate: Date = new Date()): EidDate | null {
    const today = referenceDate.getTime();

    // Find one we're currently inside the window for
    const active = eidAlAdhaDates.find((d) => {
        const opens = new Date(d.windowOpensDate).getTime();
        const closes = new Date(d.windowClosesDate).getTime();
        return today >= opens && today <= closes;
    });
    if (active) return active;

    // Otherwise find the next upcoming one
    const upcoming = eidAlAdhaDates
        .filter((d) => new Date(d.windowOpensDate).getTime() > today)
        .sort((a, b) => new Date(a.windowOpensDate).getTime() - new Date(b.windowOpensDate).getTime());

    return upcoming[0] ?? null;
}

export function isQurbaniWindowOpen(referenceDate: Date = new Date()): boolean {
    const today = referenceDate.getTime();
    return eidAlAdhaDates.some((d) => {
        const opens = new Date(d.windowOpensDate).getTime();
        const closes = new Date(d.windowClosesDate).getTime();
        return today >= opens && today <= closes;
    });
}

export function daysUntil(dateStr: string, referenceDate: Date = new Date()): number {
    const target = new Date(dateStr).getTime();
    const today = referenceDate.getTime();
    return Math.ceil((target - today) / (1000 * 60 * 60 * 24));
}