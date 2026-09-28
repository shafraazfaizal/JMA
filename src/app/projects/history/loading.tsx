export default function ProjectsLoading() {
    return (
        <div style={{ backgroundColor: "#F5F0E1", minHeight: "100vh" }}>
            {/* Hero skeleton */}
            <div
                className="animate-pulse"
                style={{
                    background: "linear-gradient(135deg, #073D47 0%, #0D5C6B 100%)",
                    padding: "5rem 1.5rem 3rem",
                }}
            >
                <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                    {/* Breadcrumb */}
                    <div
                        className="h-4 rounded-full animate-pulse mb-8"
                        style={{ background: "rgba(255,255,255,0.1)", width: "160px" }}
                    />
                    {/* Gold pill */}
                    <div
                        className="h-6 rounded-full animate-pulse mb-5"
                        style={{ background: "rgba(201,168,76,0.15)", width: "220px" }}
                    />
                    {/* Heading */}
                    <div
                        className="h-12 rounded-lg animate-pulse mb-4"
                        style={{ background: "rgba(255,255,255,0.12)", maxWidth: "480px" }}
                    />
                    {/* Subtitle */}
                    <div
                        className="h-5 rounded animate-pulse mb-2"
                        style={{ background: "rgba(255,255,255,0.07)", maxWidth: "520px" }}
                    />
                    <div
                        className="h-5 rounded animate-pulse mb-10"
                        style={{ background: "rgba(255,255,255,0.07)", maxWidth: "380px" }}
                    />
                    {/* Stats */}
                    <div
                        className="rounded-2xl overflow-hidden inline-grid"
                        style={{
                            gridTemplateColumns: "repeat(4, auto)",
                            background: "rgba(255,255,255,0.07)",
                            border: "1px solid rgba(255,255,255,0.1)",
                        }}
                    >
                        {[1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                style={{
                                    padding: "1.125rem 1.5rem",
                                    borderRight:
                                        i < 4 ? "1px solid rgba(255,255,255,0.08)" : "none",
                                }}
                            >
                                <div
                                    className="h-7 w-20 rounded animate-pulse mb-1"
                                    style={{ background: "rgba(255,255,255,0.12)" }}
                                />
                                <div
                                    className="h-3 w-16 rounded animate-pulse"
                                    style={{ background: "rgba(255,255,255,0.07)" }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Year tabs skeleton */}
            <div
                style={{
                    backgroundColor: "#073D47",
                    borderBottom: "1px solid rgba(255,255,255,0.08)",
                    padding: "0 1.5rem",
                    display: "flex",
                    gap: "0.25rem",
                }}
            >
                {[80, 64, 72, 64, 72, 64, 80, 64, 72, 64, 64].map((w, i) => (
                    <div
                        key={i}
                        className="animate-pulse"
                        style={{
                            height: "36px",
                            width: `${w}px`,
                            background: "rgba(255,255,255,0.08)",
                            borderRadius: "6px 6px 0 0",
                            marginTop: "6px",
                        }}
                    />
                ))}
            </div>

            {/* Content skeleton */}
            <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem 1.5rem" }}>
                {/* Stats bar */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "1.5rem",
                        flexWrap: "wrap",
                        gap: "1rem",
                    }}
                >
                    <div style={{ display: "flex", gap: "1.5rem" }}>
                        <div
                            className="h-8 w-20 rounded-lg animate-pulse"
                            style={{ background: "rgba(13,92,107,0.1)" }}
                        />
                        <div
                            className="h-8 w-28 rounded-lg animate-pulse"
                            style={{ background: "rgba(13,92,107,0.08)" }}
                        />
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div
                                key={i}
                                className="h-8 rounded-full animate-pulse"
                                style={{
                                    background: "rgba(13,92,107,0.08)",
                                    width: `${70 + i * 8}px`,
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* Table skeleton */}
                <div
                    style={{
                        background: "#ffffff",
                        borderRadius: "1rem",
                        border: "1px solid rgba(13,92,107,0.1)",
                        overflow: "hidden",
                    }}
                    className="hidden md:block"
                >
                    {/* Header */}
                    <div
                        style={{
                            background: "linear-gradient(90deg, #073D47 0%, #0D5C6B 100%)",
                            padding: "0.875rem 1rem",
                            display: "grid",
                            gridTemplateColumns: "100px 130px 1fr 160px 110px 130px",
                            gap: "1rem",
                        }}
                    >
                        {[60, 80, 120, 100, 70, 80].map((w, i) => (
                            <div
                                key={i}
                                className="h-3 rounded animate-pulse"
                                style={{ background: "rgba(255,255,255,0.15)", width: `${w}px` }}
                            />
                        ))}
                    </div>
                    {/* Rows */}
                    {Array.from({ length: 12 }).map((_, i) => (
                        <div
                            key={i}
                            style={{
                                padding: "0.875rem 1rem",
                                display: "grid",
                                gridTemplateColumns: "100px 130px 1fr 160px 110px 130px",
                                gap: "1rem",
                                borderBottom:
                                    i < 11 ? "1px solid rgba(13,92,107,0.07)" : "none",
                                background: i % 2 === 0 ? "#fff" : "rgba(245,240,225,0.4)",
                            }}
                        >
                            <div
                                className="h-4 rounded animate-pulse"
                                style={{ background: "rgba(13,92,107,0.07)", width: "72px" }}
                            />
                            <div
                                className="h-5 rounded-full animate-pulse"
                                style={{
                                    background: "rgba(13,92,107,0.07)",
                                    width: `${90 + (i % 3) * 20}px`,
                                }}
                            />
                            <div
                                className="h-4 rounded animate-pulse"
                                style={{
                                    background: "rgba(13,92,107,0.07)",
                                    width: `${55 + (i % 5) * 15}%`,
                                }}
                            />
                            <div
                                className="h-4 rounded animate-pulse"
                                style={{
                                    background: "rgba(13,92,107,0.07)",
                                    width: `${50 + (i % 4) * 10}%`,
                                }}
                            />
                            <div
                                className="h-4 rounded animate-pulse ml-auto"
                                style={{ background: "rgba(201,168,76,0.15)", width: "80px" }}
                            />
                            <div
                                className="h-4 rounded animate-pulse ml-auto"
                                style={{ background: "rgba(13,92,107,0.07)", width: "100px" }}
                            />
                        </div>
                    ))}
                </div>

                {/* Mobile card skeletons */}
                <div className="md:hidden space-y-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div
                            key={i}
                            style={{
                                background: "#ffffff",
                                borderRadius: "0.875rem",
                                border: "1px solid rgba(13,92,107,0.1)",
                                padding: "1rem",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    marginBottom: "0.5rem",
                                }}
                            >
                                <div
                                    className="h-5 rounded-full animate-pulse"
                                    style={{
                                        background: "rgba(13,92,107,0.08)",
                                        width: "100px",
                                    }}
                                />
                                <div
                                    className="h-4 rounded animate-pulse"
                                    style={{
                                        background: "rgba(13,92,107,0.06)",
                                        width: "60px",
                                    }}
                                />
                            </div>
                            <div
                                className="h-5 rounded animate-pulse mb-2"
                                style={{
                                    background: "rgba(13,92,107,0.06)",
                                    width: `${65 + (i % 3) * 10}%`,
                                }}
                            />
                            <div
                                className="h-4 rounded animate-pulse mb-4"
                                style={{
                                    background: "rgba(13,92,107,0.05)",
                                    width: "120px",
                                }}
                            />
                            <div
                                style={{
                                    borderTop: "1px solid rgba(13,92,107,0.08)",
                                    paddingTop: "0.75rem",
                                    display: "flex",
                                    gap: "1.5rem",
                                }}
                            >
                                <div>
                                    <div
                                        className="h-2 rounded animate-pulse mb-1"
                                        style={{ background: "rgba(13,92,107,0.06)", width: "30px" }}
                                    />
                                    <div
                                        className="h-6 rounded animate-pulse"
                                        style={{ background: "rgba(201,168,76,0.12)", width: "80px" }}
                                    />
                                </div>
                                <div>
                                    <div
                                        className="h-2 rounded animate-pulse mb-1"
                                        style={{ background: "rgba(13,92,107,0.06)", width: "30px" }}
                                    />
                                    <div
                                        className="h-6 rounded animate-pulse"
                                        style={{ background: "rgba(13,92,107,0.07)", width: "100px" }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}