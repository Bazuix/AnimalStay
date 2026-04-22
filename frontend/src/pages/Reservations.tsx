import { useEffect, useState } from "react";
import api from "../api/axios";
import type { Stay } from "../types/Stay";

interface Pet { id: number; name: string; species: string; owner: { name: string } }
interface Room { id: number; number: number; type: string; pricePerDay: number; status: string }
interface Service { id: number; name: string; price: number }

const STATUS_COLORS: Record<string, string> = {
    scheduled: "blue",
    active: "green",
    completed: "purple",
    cancelled: "red",
};

const Reservations = () => {
    const [stays, setStays] = useState<Stay[]>([]);
    const [pets, setPets] = useState<Pet[]>([]);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [form, setForm] = useState({
        petId: 0,
        roomId: 0,
        startDate: "",
        endDate: "",
        notes: "",
        needsMeds: false,
        needsWalk: true,
        medsInfo: "",
        serviceIds: [] as number[],
    });

    const fetchAll = async () => {
        const [sRes, pRes, rRes, svRes] = await Promise.all([
            api.get("/stays"),
            api.get("/pets"),
            api.get("/rooms"),
            api.get("/services"),
        ]);
        setStays(sRes.data);
        setPets(pRes.data);
        setRooms(rRes.data);
        setServices(svRes.data);
        if (pRes.data.length > 0) setForm((f) => ({ ...f, petId: pRes.data[0].id }));
        if (rRes.data.length > 0) setForm((f) => ({ ...f, roomId: rRes.data[0].id }));
    };

    useEffect(() => { fetchAll(); }, []);

    const toggleService = (id: number) => {
        setForm((f) => ({
            ...f,
            serviceIds: f.serviceIds.includes(id)
                ? f.serviceIds.filter((s) => s !== id)
                : [...f.serviceIds, id],
        }));
    };

    const calcNights = () => {
        if (!form.startDate || !form.endDate) return 0;
        const diff = new Date(form.endDate).getTime() - new Date(form.startDate).getTime();
        return Math.max(0, Math.ceil(diff / 86400000));
    };

    const calcTotal = () => {
        const room = rooms.find((r) => r.id === form.roomId);
        const nights = calcNights();
        const roomCost = (room?.pricePerDay || 0) * nights;
        const svcCost = services
            .filter((s) => form.serviceIds.includes(s.id))
            .reduce((a, b) => a + b.price, 0) * nights;
        return roomCost + svcCost;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (new Date(form.endDate) <= new Date(form.startDate)) {
            setError("End date must be after start date");
            return;
        }
        if (form.petId === 0 || form.roomId === 0) {
            setError("Please select a pet and room");
            return;
        }
        try {
            await api.post("/stays", form);
            setSuccess("Reservation created successfully!");
            setShowModal(false);
            setForm({ petId: pets[0]?.id || 0, roomId: rooms[0]?.id || 0, startDate: "", endDate: "", notes: "", needsMeds: false, needsWalk: true, medsInfo: "", serviceIds: [] });
            fetchAll();
            setTimeout(() => setSuccess(""), 3000);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to create reservation");
        }
    };

    const handleStatusChange = async (id: number, status: string) => {
        await api.patch(`/stays/${id}`, { status });
        fetchAll();
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Delete this reservation?")) return;
        await api.delete(`/stays/${id}`);
        fetchAll();
    };

    const today = new Date().toISOString().split("T")[0];

    return (
        <div className="page-wrap">
            <div className="page-header">
                <h1>Reservations</h1>
                <button className="btn primary" onClick={() => { setError(""); setShowModal(true); }}>
                    + New Reservation
                </button>
            </div>

            {success && <div className="alert success">{success}</div>}

            {stays.length === 0 ? (
                <div className="empty-state">
                    <div className="icon">📅</div>
                    <p>No reservations yet. Book the first stay!</p>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {stays.map((s) => (
                        <div key={s.id} className="card stay-card">
                            <div className="stay-header">
                                <div className="stay-pet">
                                    <span className="stay-pet-name">{s.pet.name}</span>
                                    <span className="stay-pet-species">{s.pet.species}</span>
                                    <span style={{ color: "var(--muted)", fontSize: 13 }}>· {s.pet.owner.name}</span>
                                </div>
                                <span className={`badge ${STATUS_COLORS[s.status] || "blue"}`}>{s.status}</span>
                            </div>

                            <div className="stay-details">
                                <div className="stay-detail">
                                    <span className="label">Room</span>
                                    <span>#{s.room.number} ({s.room.type})</span>
                                </div>
                                <div className="stay-detail">
                                    <span className="label">Check-in</span>
                                    <span>{new Date(s.startDate).toLocaleDateString()}</span>
                                </div>
                                <div className="stay-detail">
                                    <span className="label">Check-out</span>
                                    <span>{new Date(s.endDate).toLocaleDateString()}</span>
                                </div>
                                <div className="stay-detail">
                                    <span className="label">Care</span>
                                    <span>
                    {s.needsWalk && <span className="badge green" style={{ marginRight: 4 }}>🦮 Walk</span>}
                                        {s.needsMeds && <span className="badge orange">💊 Meds</span>}
                                        {!s.needsWalk && !s.needsMeds && <span className="badge" style={{ background: "var(--bg3)", color: "var(--muted)" }}>None</span>}
                  </span>
                                </div>
                            </div>

                            {s.medsInfo && (
                                <div className="stay-meds-info">💊 {s.medsInfo}</div>
                            )}

                            {s.services.length > 0 && (
                                <div className="stay-services">
                                    {s.services.map((sv) => (
                                        <span key={sv.service.id} className="badge purple">{sv.service.name}</span>
                                    ))}
                                </div>
                            )}

                            {s.notes && <div className="stay-notes">📝 {s.notes}</div>}

                            <div className="stay-actions">
                                <select
                                    value={s.status}
                                    onChange={(e) => handleStatusChange(s.id, e.target.value)}
                                    style={{ width: "auto", padding: "6px 12px", fontSize: 13 }}
                                >
                                    <option value="scheduled">Scheduled</option>
                                    <option value="active">Active</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                                <button className="btn danger sm" onClick={() => handleDelete(s.id)}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h2>New Reservation</h2>
                        {error && <div className="alert error">{error}</div>}

                        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            <div className="form-group">
                                <label>Pet *</label>
                                <select required value={form.petId}
                                        onChange={(e) => setForm({ ...form, petId: Number(e.target.value) })}>
                                    <option value={0}>Select pet…</option>
                                    {pets.map((p) => (
                                        <option key={p.id} value={p.id}>{p.name} ({p.species}) – {p.owner?.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Room *</label>
                                <select required value={form.roomId}
                                        onChange={(e) => setForm({ ...form, roomId: Number(e.target.value) })}>
                                    <option value={0}>Select room…</option>
                                    {rooms.map((r) => (
                                        <option key={r.id} value={r.id}>Room #{r.number} – {r.type} (${r.pricePerDay}/day)</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Check-in Date *</label>
                                    <input type="date" required min={today} value={form.startDate}
                                           onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Check-out Date *</label>
                                    <input type="date" required min={form.startDate || today} value={form.endDate}
                                           onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
                                </div>
                            </div>

                            {calcNights() > 0 && (
                                <div className="cost-preview">
                                    <span>📆 {calcNights()} night{calcNights() !== 1 ? "s" : ""}</span>
                                    <span>💰 Estimated total: <strong>${calcTotal().toFixed(2)}</strong></span>
                                </div>
                            )}

                            <div className="form-group">
                                <label>Care Requirements</label>
                                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                    <label className="checkbox-row">
                                        <input type="checkbox" checked={form.needsWalk}
                                               onChange={(e) => setForm({ ...form, needsWalk: e.target.checked })} />
                                        <span>🦮 Needs daily walks</span>
                                    </label>
                                    <label className="checkbox-row">
                                        <input type="checkbox" checked={form.needsMeds}
                                               onChange={(e) => setForm({ ...form, needsMeds: e.target.checked })} />
                                        <span>💊 Needs medication</span>
                                    </label>
                                </div>
                            </div>

                            {form.needsMeds && (
                                <div className="form-group">
                                    <label>Medication Instructions</label>
                                    <textarea
                                        placeholder="e.g. 1 tablet of Rimadyl twice daily with food"
                                        value={form.medsInfo}
                                        onChange={(e) => setForm({ ...form, medsInfo: e.target.value })}
                                        rows={2}
                                        style={{ resize: "vertical" }}
                                    />
                                </div>
                            )}

                            {services.length > 0 && (
                                <div className="form-group">
                                    <label>Additional Services</label>
                                    <div className="services-grid">
                                        {services.map((s) => (
                                            <label key={s.id} className={`service-chip ${form.serviceIds.includes(s.id) ? "selected" : ""}`}>
                                                <input type="checkbox" style={{ display: "none" }}
                                                       checked={form.serviceIds.includes(s.id)}
                                                       onChange={() => toggleService(s.id)} />
                                                <span>{s.name}</span>
                                                <span className="svc-price">${s.price}/day</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="form-group">
                                <label>Notes</label>
                                <textarea placeholder="Any special instructions or notes…"
                                          value={form.notes}
                                          onChange={(e) => setForm({ ...form, notes: e.target.value })}
                                          rows={2} style={{ resize: "vertical" }} />
                            </div>

                            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                                <button type="button" className="btn ghost" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn primary">Book Stay</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Reservations;