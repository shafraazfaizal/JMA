// ============================================
// JMA GALLERY DATA
// ============================================
// To add real photos: set `src` to an image path (e.g. "/images/gallery/masjid-01.jpg",
// place the file in /public/images/gallery/) and the placeholder will be replaced
// automatically — no component changes needed.
//
// Recommended image specs: JPG/WebP, min 1200px on the longest edge, <500KB optimised.

export type GalleryCategory = "Projects" | "Events" | "Community" | "Distributions";

export interface GalleryItem {
    id: string;
    src: string | null; // null = use branded placeholder
    alt: string;
    caption: string;
    category: GalleryCategory;
    date: string; // ISO format, used for sorting
    // aspect controls placeholder/grid sizing — "wide" | "tall" | "square"
    aspect: "wide" | "tall" | "square";
}

export const galleryCategories: { value: GalleryCategory | "All"; label: string }[] = [
    { value: "All", label: "All Photos" },
    { value: "Projects", label: "Projects" },
    { value: "Events", label: "Events" },
    { value: "Community", label: "Community" },
    { value: "Distributions", label: "Distributions" },
];

export const galleryItems: GalleryItem[] = [
    { id: "1", src: null, alt: "Mankumban Masjid reconstruction — Phase 2 walls", caption: "Mankumban Masjid — Phase 2 construction", category: "Projects", date: "2025-06-10", aspect: "wide" },
    { id: "2", src: null, alt: "Scholarship recipients receiving books and uniforms", caption: "2025 Scholarship Fund recipients", category: "Community", date: "2025-06-04", aspect: "square" },
    { id: "3", src: null, alt: "Volunteers distributing food parcels in Jaffna", caption: "Emergency food distribution, Chavakacheri", category: "Distributions", date: "2025-05-15", aspect: "tall" },
    { id: "4", src: null, alt: "Annual Fundraising Dinner 2024 in Manchester", caption: "Annual Fundraising Dinner 2024", category: "Events", date: "2024-07-20", aspect: "wide" },
    { id: "5", src: null, alt: "Clean water well site assessment in Vaddukkoddai", caption: "Water project site assessment", category: "Projects", date: "2025-04-28", aspect: "square" },
    { id: "6", src: null, alt: "Community Eid gathering in London", caption: "Jaffna Day cultural celebration", category: "Community", date: "2024-09-14", aspect: "square" },
    { id: "7", src: null, alt: "Qurbani meat distribution to families", caption: "Qurbani distribution, Eid al-Adha 2024", category: "Distributions", date: "2024-06-17", aspect: "tall" },
    { id: "8", src: null, alt: "Khardal Hasana information evening in Birmingham", caption: "Khardal Hasana info evening", category: "Events", date: "2025-08-02", aspect: "square" },
    { id: "9", src: null, alt: "Volunteers packing winter relief supplies", caption: "Winter Relief campaign packing day", category: "Distributions", date: "2025-01-12", aspect: "wide" },
    { id: "10", src: null, alt: "Masjid foundation laying ceremony", caption: "Mankumban Masjid foundation ceremony", category: "Projects", date: "2024-11-05", aspect: "square" },
    { id: "11", src: null, alt: "Ramadan Iftar fundraiser gathering in Leicester", caption: "Ramadan Iftar fundraiser", category: "Events", date: "2025-03-18", aspect: "tall" },
    { id: "12", src: null, alt: "Elderly care visit by JMA welfare volunteers", caption: "Welfare visit, Vaddukkoddai", category: "Community", date: "2025-02-20", aspect: "square" },
];