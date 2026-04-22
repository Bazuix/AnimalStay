import { useEffect, useState } from "react";
import api from "../api/axios";
import type { Stay } from "../types/Stay";

const Dashboard = () => {
    const [activeStays, setActiveStays] = useState<Stay[]>([]);
    const [allStays, setAllStays] = useState<Stay[]>([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState<"active" | "all">("active");

    const fetchData = async () => {
        setLoading(true);
        try {
            const [activeRes, allRes] = await Promise.all([
                api.get("/stays/active"),
                api.get("/stays"),
            ]);
            setActiveStays(activeRes.data);
            setAllStays(allRes.data);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleCareUpdate = async (id: number, field: string, value: boolean | string) => {
        await api.patch(`/stays/${id}`, { [field]: value });
        fetchData();
    };

    const needsMeds = activeStays.filter((s) => s.needsMeds);
    const needsWalk = activeStays.filter((s) => s.needsWalk);

    const stays = tab === "active" ? activeStays : allStays;

    const speciesEmoji: Record<string, string> = {
        dog: "🐶", cat: "🐱", bird: "🐦", rabbit: "🐰",
        hamster: "🐹", reptile: "🦎",
    };
    const getEmoji = (species: string) => speciesEmoji[species.toLowerCase()] || "🐾";

    if (loading) {
        return (
            <div className="page-wrap">
                <div className="empty-state"><p>Loading…</p></div>
            </div>
        );
    }

    return (
        <div className="page-wrap">
            <div className="page-header">
                <h1>Dashboard</h1>
                <button className="btn ghost sm" onClick={fetchData}>↻ Refresh</button>
            </div>

            {/* Stats row */}
            <div className="stats-row">
                <div className="stat-card card">
                    <div className="stat-number">{activeStays.length}</div>
                    <div className="stat-label">Currently Checked In</div>
                </div>
                <div className="stat-card card">
                    <div className="stat-number" style={{ color: "var(--orange)" }}>{needsMeds.length}</div>
                    <div className="stat-label">Need Medication 💊</div>
                </div>
                <div className="stat-card card">
                    <div className="stat-number" style={{ color: "var(--green)" }}>{needsWalk.length}</div>
                    <div className="stat-label">Need Walk 🦮</div>
                </div>
                <div className="stat-card card">
                    <div className="stat-number" style={{ color: "var(--accent2)" }}>{allStays.length}</div>
                    <div className="stat-label">Total Reservations</div>
                </div>
            </div>

            {/* Alerts */}
            {needsMeds.length > 0 && (
                <div className="alert-banner meds">
                    <strong>💊 Medication needed today:</strong>{" "}
                    {needsMeds.map((s) => s.pet.name).join(", ")}
                </div>
            )}

            {/* Tabs */}
            <div className="tabs">
                <button className={`tab ${tab === "active" ? "active" : ""}`} onClick={() => setTab("active")}>
                    Currently In Hotel ({activeStays.length})
                </button>
                <button className={`tab ${tab === "all" ? "active" : ""}`} onClick={() => setTab("all")}>
                    All Reservations ({allStays.length})
                </button>
            </div>

            {stays.length === 0 ? (
                <div className="empty-state">
                    <div className="icon">{tab === "active" ? "🏠" : "📋"}</div>
                    <p>{tab === "active" ? "No animals currently checked in." : "No reservations found."}</p>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {stays.map((s) => (
                        <div key={s.id} className="card dashboard-card">
                            <div className="dc-left">
                                <div className="dc-emoji">{getEmoji(s.pet.species)}</div>
                                <div className="dc-info">
                                    <div className="dc-name">{s.pet.name}</div>
                                    <div className="dc-species">{s.pet.species}{s.pet.breed ? ` · ${s.pet.breed}` : ""} · {s.pet.age}y</div>
                                    <div className="dc-owner">👤 {s.pet.owner.name} · {s.pet.owner.phone}</div>
                                    <div className="dc-room">🏠 Room #{s.room.number} ({s.room.type})</div>
                                    <div className="dc-dates">
                                        📅 {new Date(s.startDate).toLocaleDateString()} → {new Date(s.endDate).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>

                            <div className="dc-right">
                                <div className="dc-care">
                                    <label className="checkbox-row">
                                        <input type="checkbox" checked={s.needsWalk}
                                               onChange={(e) => handleCareUpdate(s.id, "needsWalk", e.target.checked)} />
                                        <span>🦮 Walk</span>
                                    </label>
                                    <label className="checkbox-row">
                                        <input type="checkbox" checked={s.needsMeds}
                                               onChange={(e) => handleCareUpdate(s.id, "needsMeds", e.target.checked)} />
                                        <span>💊 Meds</span>
                                    </label>
                                </div>

                                {s.medsInfo && (
                                    <div className="dc-meds-info">
                                        <strong>Meds:</strong> {s.medsInfo}
                                    </div>
                                )}

                                {s.services.length > 0 && (
                                    <div className="dc-services">
                                        {s.services.map((sv) => (
                                            <span key={sv.service.id} className="badge purple">{sv.service.name}</span>
                                        ))}
                                    </div>
                                )}

                                {s.notes && <div className="dc-notes">📝 {s.notes}</div>}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
