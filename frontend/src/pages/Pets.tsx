import { useEffect, useState } from "react";
import api from "../api/axios";
import type { Pet } from "../types/Pet";

interface Owner {
    id: number;
    name: string;
    email: string;
    phone: string;
}

const SPECIES = ["Dog", "Cat", "Bird", "Rabbit", "Hamster", "Reptile", "Other"];

const Pets = () => {
    const [pets, setPets] = useState<Pet[]>([]);
    const [owners, setOwners] = useState<Owner[]>([]);
    const [filtered, setFiltered] = useState<Pet[]>([]);
    const [speciesFilter, setSpeciesFilter] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [showOwnerModal, setShowOwnerModal] = useState(false);
    const [error, setError] = useState("");

    const [form, setForm] = useState<Pet>({ name: "", species: "", breed: "", age: 0, ownerId: 0 });
    const [ownerForm, setOwnerForm] = useState({ name: "", email: "", phone: "" });

    const fetchAll = async () => {
        const [pRes, oRes] = await Promise.all([api.get("/pets"), api.get("/owners")]);
        const petsData  = Array.isArray(pRes.data)  ? pRes.data  : [];
        const ownersData = Array.isArray(oRes.data) ? oRes.data : [];
        setPets(petsData);
        setFiltered(petsData);
        setOwners(ownersData);
        if (ownersData.length > 0 && form.ownerId === 0) {
            setForm((f) => ({ ...f, ownerId: ownersData[0].id }));
        }
    };

    useEffect(() => { fetchAll(); }, []);

    useEffect(() => {
        if (!speciesFilter) return setFiltered(pets);
        setFiltered(pets.filter((p) => p.species.toLowerCase().includes(speciesFilter.toLowerCase())));
    }, [speciesFilter, pets]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        try {
            await api.post("/pets", form);
            setForm({ name: "", species: "", breed: "", age: 0, ownerId: owners[0]?.id || 0 });
            setShowModal(false);
            fetchAll();
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to add pet");
        }
    };

    const handleAddOwner = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await api.post("/owners", ownerForm);
            setOwners((prev) => [...prev, res.data]);
            setForm((f) => ({ ...f, ownerId: res.data.id }));
            setOwnerForm({ name: "", email: "", phone: "" });
            setShowOwnerModal(false);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to add owner");
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Remove this pet?")) return;
        await api.delete(`/pets/${id}`);
        fetchAll();
    };

    const speciesEmoji: Record<string, string> = {
        Dog: "🐶", Cat: "🐱", Bird: "🐦", Rabbit: "🐰",
        Hamster: "🐹", Reptile: "🦎", Other: "🐾",
    };

    return (
        <div className="page-wrap">
            <div className="page-header">
                <h1>Pets</h1>
                <div style={{ display: "flex", gap: 10 }}>
                    <button className="btn ghost sm" onClick={() => setShowOwnerModal(true)}>+ Owner</button>
                    <button className="btn primary" onClick={() => setShowModal(true)}>+ Add Pet</button>
                </div>
            </div>

            <div style={{ marginBottom: 20 }}>
                <input
                    placeholder="🔍 Filter by species…"
                    style={{ maxWidth: 300 }}
                    value={speciesFilter}
                    onChange={(e) => setSpeciesFilter(e.target.value)}
                />
            </div>

            {filtered.length === 0 ? (
                <div className="empty-state">
                    <div className="icon">🐾</div>
                    <p>No pets registered yet. Add the first one!</p>
                </div>
            ) : (
                <div className="grid-3">
                    {filtered.map((p) => (
                        <div key={p.id} className="card pet-card">
                            <div className="pet-emoji">{speciesEmoji[p.species] || "🐾"}</div>
                            <div className="pet-info">
                                <h3>{p.name}</h3>
                                <p>{p.species}{p.breed ? ` · ${p.breed}` : ""}</p>
                                <p>{p.age} year{p.age !== 1 ? "s" : ""} old</p>
                                {p.owner && (
                                    <p className="pet-owner">👤 {p.owner.name} · {p.owner.phone}</p>
                                )}
                            </div>
                            <button className="btn danger sm" onClick={() => handleDelete(p.id!)}>Remove</button>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h2>Add New Pet</h2>
                        {error && <div className="alert error">{error}</div>}
                        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Pet Name *</label>
                                    <input required placeholder="e.g. Buddy" value={form.name}
                                           onChange={(e) => setForm({ ...form, name: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Species *</label>
                                    <select required value={form.species}
                                            onChange={(e) => setForm({ ...form, species: e.target.value })}>
                                        <option value="">Select…</option>
                                        {SPECIES.map((s) => <option key={s}>{s}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Breed</label>
                                    <input placeholder="e.g. Labrador" value={form.breed}
                                           onChange={(e) => setForm({ ...form, breed: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Age (years) *</label>
                                    <input type="number" min={0} max={50} required value={form.age}
                                           onChange={(e) => setForm({ ...form, age: Number(e.target.value) })} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Owner *</label>
                                <select required value={form.ownerId}
                                        onChange={(e) => setForm({ ...form, ownerId: Number(e.target.value) })}>
                                    <option value={0}>Select owner…</option>
                                    {owners.map((o) => (
                                        <option key={o.id} value={o.id}>{o.name} ({o.email})</option>
                                    ))}
                                </select>
                                <small style={{ color: "var(--muted)", marginTop: 4 }}>
                                    No owner?{" "}
                                    <span style={{ color: "var(--accent)", cursor: "pointer" }}
                                          onClick={() => { setShowModal(false); setShowOwnerModal(true); }}>
                    Add one first
                  </span>
                                </small>
                            </div>
                            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                                <button type="button" className="btn ghost" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn primary">Add Pet</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showOwnerModal && (
                <div className="modal-overlay" onClick={() => setShowOwnerModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h2>Add New Owner</h2>
                        <form onSubmit={handleAddOwner} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                            <div className="form-group">
                                <label>Full Name *</label>
                                <input required placeholder="John Smith" value={ownerForm.name}
                                       onChange={(e) => setOwnerForm({ ...ownerForm, name: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Email *</label>
                                <input type="email" required placeholder="john@email.com" value={ownerForm.email}
                                       onChange={(e) => setOwnerForm({ ...ownerForm, email: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Phone *</label>
                                <input required placeholder="+48 123 456 789" value={ownerForm.phone}
                                       onChange={(e) => setOwnerForm({ ...ownerForm, phone: e.target.value })} />
                            </div>
                            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                                <button type="button" className="btn ghost" onClick={() => setShowOwnerModal(false)}>Cancel</button>
                                <button type="submit" className="btn primary">Add Owner</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Pets;