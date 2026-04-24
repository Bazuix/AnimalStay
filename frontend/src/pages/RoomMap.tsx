import { useEffect, useState, useCallback } from "react";
import api from "../api/axios";
import DatePicker from "../components/DatePicker";

interface StayOnRoom {
    id: number;
    startDate: string;
    endDate: string;
    status: string;
    needsMeds: boolean;
    needsWalk: boolean;
    medsInfo?: string;
    notes?: string;
    pet: {
        id: number;
        name: string;
        species: string;
        breed?: string;
        age: number;
        owner: { name: string; phone: string; email: string };
    };
    services: { service: { id: number; name: string; price: number } }[];
}

interface Room {
    id: number;
    number: number;
    type: string;
    pricePerDay: number;
    status: string;
    stays: StayOnRoom[];
}

const TYPE_COLORS: Record<string, string> = {
    Standard: "#4f9cf9",
    Deluxe:   "#7c6af7",
    Suite:    "#f59e0b",
    Kennel:   "#3ecf8e",
    Aquarium: "#06b6d4",
};

const SPECIES_EMOJI: Record<string, string> = {
    dog: "🐶", cat: "🐱", bird: "🐦", rabbit: "🐰",
    hamster: "🐹", reptile: "🦎",
};
const emoji = (s: string) => SPECIES_EMOJI[s?.toLowerCase()] || "🐾";

const fmt = (d: string) =>
    new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short" });

const todayStr = () => new Date().toISOString().split("T")[0];
const addDays = (d: string, n: number) => {
    const dt = new Date(d);
    dt.setDate(dt.getDate() + n);
    return dt.toISOString().split("T")[0];
};

export default function RoomMap() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);
    const [startDate, setStartDate] = useState(todayStr());
    const [endDate, setEndDate] = useState(addDays(todayStr(), 0)); // same-day = "tonight"
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [filterType, setFilterType] = useState("All");

    const fetchRooms = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get("/rooms/map", {
                params: { startDate, endDate: endDate || startDate },
            });
            setRooms(res.data);
        } finally {
            setLoading(false);
        }
    }, [startDate, endDate]);

    useEffect(() => { fetchRooms(); }, [fetchRooms]);

    const types = ["All", ...Array.from(new Set(rooms.map((r) => r.type)))];
    const visible = filterType === "All" ? rooms : rooms.filter((r) => r.type === filterType);

    const occupied = rooms.filter((r) => r.stays.length > 0).length;
    const free     = rooms.length - occupied;

    const handleStatusChange = async (stayId: number, field: string, value: boolean) => {
        await api.patch(`/stays/${stayId}`, { [field]: value });
        fetchRooms();
        // update selected room live
        setSelectedRoom((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                stays: prev.stays.map((s) =>
                    s.id === stayId ? { ...s, [field]: value } : s
                ),
            };
        });
    };

    return (
        <div className="page-wrap">
            {/* ── Header ── */}
            <div className="page-header">
                <h1>Room Map</h1>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button
                        className={`btn sm ${viewMode === "grid" ? "primary" : "ghost"}`}
                        onClick={() => setViewMode("grid")}
                    >⊞ Grid</button>
                    <button
                        className={`btn sm ${viewMode === "list" ? "primary" : "ghost"}`}
                        onClick={() => setViewMode("list")}
                    >☰ List</button>
                </div>
            </div>

            {/* ── Date Picker ── */}
            <div className="rm-filter-bar card">
                <div className="rm-date-group">
                    <DatePicker
                        label="From date"
                        value={startDate}
                        onChange={(d) => {
                            setStartDate(d);
                            if (d > endDate) setEndDate(d);
                        }}
                        placeholder="Select start…"
                    />
                    <div className="rm-date-sep">→</div>
                    <DatePicker
                        label="To date"
                        value={endDate}
                        min={startDate}
                        onChange={(d) => setEndDate(d)}
                        placeholder="Select end…"
                    />
                    <button className="btn primary sm" onClick={fetchRooms} style={{ alignSelf: "flex-end" }}>
                        Search
                    </button>
                </div>

                <div className="rm-quick-btns">
                    <span style={{ fontSize: 12, color: "var(--muted)" }}>Quick:</span>
                    {[
                        { label: "Today",      s: todayStr(),        e: todayStr() },
                        { label: "This week",  s: todayStr(),        e: addDays(todayStr(), 7) },
                        { label: "Next 30d",   s: todayStr(),        e: addDays(todayStr(), 30) },
                    ].map((q) => (
                        <button
                            key={q.label}
                            className="btn ghost sm"
                            onClick={() => { setStartDate(q.s); setEndDate(q.e); }}
                        >{q.label}</button>
                    ))}
                </div>
            </div>

            {/* ── Stats ── */}
            <div className="rm-stats">
                <div className="rm-stat">
                    <span className="rm-stat-n">{rooms.length}</span>
                    <span className="rm-stat-l">Total Rooms</span>
                </div>
                <div className="rm-stat occupied">
                    <span className="rm-stat-n">{occupied}</span>
                    <span className="rm-stat-l">Occupied</span>
                </div>
                <div className="rm-stat free">
                    <span className="rm-stat-n">{free}</span>
                    <span className="rm-stat-l">Available</span>
                </div>
                <div className="rm-stat meds">
          <span className="rm-stat-n">
            {rooms.flatMap((r) => r.stays).filter((s) => s.needsMeds).length}
          </span>
                    <span className="rm-stat-l">Need Meds 💊</span>
                </div>
            </div>

            {/* ── Type Filter ── */}
            <div className="rm-type-filter">
                {types.map((t) => (
                    <button
                        key={t}
                        className={`rm-type-btn ${filterType === t ? "active" : ""}`}
                        style={filterType === t && t !== "All"
                            ? { borderColor: TYPE_COLORS[t], color: TYPE_COLORS[t], background: TYPE_COLORS[t] + "18" }
                            : {}}
                        onClick={() => setFilterType(t)}
                    >{t}</button>
                ))}
            </div>

            {/* ── Room Grid / List ── */}
            {loading ? (
                <div className="empty-state"><p>Loading rooms…</p></div>
            ) : visible.length === 0 ? (
                <div className="empty-state">
                    <div className="icon">🏠</div>
                    <p>No rooms found.</p>
                </div>
            ) : viewMode === "grid" ? (
                <div className="rm-grid">
                    {visible.map((room) => {
                        const isOccupied = room.stays.length > 0;
                        const stay = room.stays[0];
                        const color = TYPE_COLORS[room.type] || "#4f9cf9";
                        return (
                            <button
                                key={room.id}
                                className={`rm-room-card ${isOccupied ? "occupied" : "free"}`}
                                style={{ "--room-color": color } as any}
                                onClick={() => setSelectedRoom(room)}
                            >
                                <div className="rm-room-number">#{room.number}</div>
                                <div className="rm-room-type">{room.type}</div>
                                <div className="rm-room-price">${room.pricePerDay}/day</div>

                                {isOccupied ? (
                                    <div className="rm-room-pet">
                                        <div className="rm-pet-emoji">{emoji(stay.pet.species)}</div>
                                        <div className="rm-pet-name">{stay.pet.name}</div>
                                        <div className="rm-pet-dates">{fmt(stay.startDate)} → {fmt(stay.endDate)}</div>
                                        <div className="rm-care-icons">
                                            {stay.needsWalk && <span title="Needs walk">🦮</span>}
                                            {stay.needsMeds && <span title="Needs meds">💊</span>}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="rm-free-label">✓ Available</div>
                                )}
                            </button>
                        );
                    })}
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {visible.map((room) => {
                        const isOccupied = room.stays.length > 0;
                        const color = TYPE_COLORS[room.type] || "#4f9cf9";
                        return (
                            <div
                                key={room.id}
                                className="card rm-list-row"
                                style={{ borderLeft: `3px solid ${color}`, cursor: "pointer" }}
                                onClick={() => setSelectedRoom(room)}
                            >
                                <div className="rm-list-room">
                                    <span className="rm-list-num">Room #{room.number}</span>
                                    <span className="rm-list-type" style={{ color }}>{room.type}</span>
                                    <span className="rm-list-price">${room.pricePerDay}/day</span>
                                </div>
                                <div className="rm-list-status">
                                    {isOccupied ? (
                                        room.stays.map((s) => (
                                            <div key={s.id} className="rm-list-stay">
                                                {emoji(s.pet.species)} <strong>{s.pet.name}</strong>
                                                <span style={{ color: "var(--muted)", fontSize: 13 }}>
                          {fmt(s.startDate)} → {fmt(s.endDate)}
                        </span>
                                                {s.needsWalk && <span>🦮</span>}
                                                {s.needsMeds && <span>💊</span>}
                                            </div>
                                        ))
                                    ) : (
                                        <span className="badge green">Available</span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* ── Room Detail Panel ── */}
            {selectedRoom && (
                <div className="modal-overlay" onClick={() => setSelectedRoom(null)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="rm-detail-header">
                            <div>
                                <h2>Room #{selectedRoom.number}</h2>
                                <span
                                    className="rm-detail-type"
                                    style={{ color: TYPE_COLORS[selectedRoom.type] || "var(--accent)" }}
                                >
                  {selectedRoom.type} · ${selectedRoom.pricePerDay}/day
                </span>
                            </div>
                            <button className="btn ghost sm" onClick={() => setSelectedRoom(null)}>✕</button>
                        </div>

                        {selectedRoom.stays.length === 0 ? (
                            <div className="empty-state" style={{ padding: "32px 0" }}>
                                <div className="icon">✓</div>
                                <p>This room is available for the selected period.</p>
                            </div>
                        ) : (
                            selectedRoom.stays.map((stay) => (
                                <div key={stay.id} className="rm-detail-stay">
                                    <div className="rm-detail-pet-row">
                                        <span className="rm-detail-emoji">{emoji(stay.pet.species)}</span>
                                        <div>
                                            <div className="rm-detail-pet-name">{stay.pet.name}</div>
                                            <div className="rm-detail-pet-info">
                                                {stay.pet.species}{stay.pet.breed ? ` · ${stay.pet.breed}` : ""} · {stay.pet.age}y
                                            </div>
                                        </div>
                                        <span className={`badge ${stay.status === "active" ? "green" : stay.status === "scheduled" ? "blue" : "purple"}`}>
                      {stay.status}
                    </span>
                                    </div>

                                    <div className="rm-detail-grid">
                                        <div className="rm-detail-item">
                                            <span className="rdl">Owner</span>
                                            <span>{stay.pet.owner.name}</span>
                                        </div>
                                        <div className="rm-detail-item">
                                            <span className="rdl">Phone</span>
                                            <span>{stay.pet.owner.phone}</span>
                                        </div>
                                        <div className="rm-detail-item">
                                            <span className="rdl">Check-in</span>
                                            <span>{fmt(stay.startDate)}</span>
                                        </div>
                                        <div className="rm-detail-item">
                                            <span className="rdl">Check-out</span>
                                            <span>{fmt(stay.endDate)}</span>
                                        </div>
                                    </div>

                                    <div className="rm-detail-care">
                                        <label className="checkbox-row">
                                            <input
                                                type="checkbox"
                                                checked={stay.needsWalk}
                                                onChange={(e) => handleStatusChange(stay.id, "needsWalk", e.target.checked)}
                                            />
                                            <span>🦮 Needs daily walk</span>
                                        </label>
                                        <label className="checkbox-row">
                                            <input
                                                type="checkbox"
                                                checked={stay.needsMeds}
                                                onChange={(e) => handleStatusChange(stay.id, "needsMeds", e.target.checked)}
                                            />
                                            <span>💊 Needs medication</span>
                                        </label>
                                    </div>

                                    {stay.medsInfo && (
                                        <div className="stay-meds-info">💊 {stay.medsInfo}</div>
                                    )}

                                    {stay.services.length > 0 && (
                                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 10 }}>
                                            {stay.services.map((sv) => (
                                                <span key={sv.service.id} className="badge purple">{sv.service.name}</span>
                                            ))}
                                        </div>
                                    )}

                                    {stay.notes && (
                                        <div className="stay-notes" style={{ marginTop: 10 }}>📝 {stay.notes}</div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}