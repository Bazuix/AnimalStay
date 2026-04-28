import { useEffect, useState } from "react";
import api from "../api/axios";
import { deleteOwner } from "../api/owners";
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

    const [form, setForm] = useState<Pet>({
        name: "",
        species: "",
        breed: "",
        age: 0,
        ownerId: 0
    });

    const [ownerForm, setOwnerForm] = useState({
        name: "",
        email: "",
        phone: ""
    });

    const fetchAll = async () => {
        const [pRes, oRes] = await Promise.all([
            api.get("/pets"),
            api.get("/owners")
        ]);

        const petsData = Array.isArray(pRes.data) ? pRes.data : [];
        const ownersData = Array.isArray(oRes.data) ? oRes.data : [];

        setPets(petsData);
        setFiltered(petsData);
        setOwners(ownersData);

        if (ownersData.length > 0 && form.ownerId === 0) {
            setForm((f) => ({ ...f, ownerId: ownersData[0].id }));
        }
    };

    useEffect(() => {
        fetchAll();
    }, []);

    useEffect(() => {
        if (!speciesFilter) {
            setFiltered(pets);
            return;
        }

        setFiltered(
            pets.filter((p) =>
                p.species.toLowerCase().includes(speciesFilter.toLowerCase())
            )
        );
    }, [speciesFilter, pets]);

    // ---------------- PET ----------------

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            await api.post("/pets", form);
            setForm({
                name: "",
                species: "",
                breed: "",
                age: 0,
                ownerId: owners[0]?.id || 0
            });
            setShowModal(false);
            fetchAll();
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to add pet");
        }
    };

    const handleDeletePet = async (id: number) => {
        if (!window.confirm("Remove this pet?")) return;

        try {
            await api.delete(`/pets/${id}`);
            fetchAll();
        } catch (err) {
            console.error(err);
        }
    };

    // ---------------- OWNER ----------------

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

    const handleDeleteOwner = async (id: number) => {
        if (!window.confirm("Delete this owner? Pets will also be removed!")) return;

        try {
            await deleteOwner(id);
            fetchAll();
        } catch (err) {
            console.error(err);
            alert("Failed to delete owner");
        }
    };

    // ---------------- UI ----------------

    const speciesEmoji: Record<string, string> = {
        Dog: "🐶",
        Cat: "🐱",
        Bird: "🐦",
        Rabbit: "🐰",
        Hamster: "🐹",
        Reptile: "🦎",
        Other: "🐾",
    };

    return (
        <div className="page-wrap">
            <div className="page-header">
                <h1>Pets</h1>

                <div style={{ display: "flex", gap: 10 }}>
                    <button
                        className="btn ghost sm"
                        onClick={() => setShowOwnerModal(true)}
                    >
                        + Owner
                    </button>

                    <button
                        className="btn primary"
                        onClick={() => setShowModal(true)}
                    >
                        + Add Pet
                    </button>
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

            {/* PETS LIST */}
            <div className="grid-3">
                {filtered.map((p) => (
                    <div key={p.id} className="card pet-card">
                        <div className="pet-emoji">
                            {speciesEmoji[p.species] || "🐾"}
                        </div>

                        <div className="pet-info">
                            <h3>{p.name}</h3>
                            <p>{p.species}{p.breed ? ` · ${p.breed}` : ""}</p>
                            <p>{p.age} years old</p>

                            {p.owner && (
                                <p className="pet-owner">
                                    👤 {p.owner.name} · {p.owner.phone}
                                </p>
                            )}
                        </div>

                        <button
                            className="btn danger sm"
                            onClick={() => handleDeletePet(p.id!)}
                        >
                            Remove Pet
                        </button>
                    </div>
                ))}
            </div>

            {/* OWNERS LIST + DELETE */}
            <div style={{ marginTop: 40 }}>
                <h2>Owners</h2>

                {owners.map((o) => (
                    <div key={o.id} className="card" style={{ marginBottom: 10 }}>
                        <div>
                            <strong>{o.name}</strong> — {o.email} — {o.phone}
                        </div>

                        <button
                            className="btn danger sm"
                            onClick={() => handleDeleteOwner(o.id)}
                        >
                            Delete Owner
                        </button>
                    </div>
                ))}
            </div>

            {/* MODAL PET */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h2>Add Pet</h2>

                        <form onSubmit={handleSubmit}>
                            <input
                                placeholder="Name"
                                value={form.name}
                                onChange={(e) =>
                                    setForm({ ...form, name: e.target.value })
                                }
                            />

                            <select
                                value={form.species}
                                onChange={(e) =>
                                    setForm({ ...form, species: e.target.value })
                                }
                            >
                                <option value="">Select species</option>
                                {SPECIES.map((s) => (
                                    <option key={s}>{s}</option>
                                ))}
                            </select>

                            <input
                                type="number"
                                placeholder="Age"
                                value={form.age}
                                onChange={(e) =>
                                    setForm({ ...form, age: Number(e.target.value) })
                                }
                            />

                            <select
                                value={form.ownerId}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        ownerId: Number(e.target.value),
                                    })
                                }
                            >
                                <option value={0}>Select owner</option>
                                {owners.map((o) => (
                                    <option key={o.id} value={o.id}>
                                        {o.name}
                                    </option>
                                ))}
                            </select>

                            <button type="submit" className="btn primary">
                                Save
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL OWNER */}
            {showOwnerModal && (
                <div
                    className="modal-overlay"
                    onClick={() => setShowOwnerModal(false)}
                >
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h2>Add Owner</h2>

                        <form onSubmit={handleAddOwner}>
                            <input
                                placeholder="Name"
                                value={ownerForm.name}
                                onChange={(e) =>
                                    setOwnerForm({
                                        ...ownerForm,
                                        name: e.target.value,
                                    })
                                }
                            />

                            <input
                                placeholder="Email"
                                value={ownerForm.email}
                                onChange={(e) =>
                                    setOwnerForm({
                                        ...ownerForm,
                                        email: e.target.value,
                                    })
                                }
                            />

                            <input
                                placeholder="Phone"
                                value={ownerForm.phone}
                                onChange={(e) =>
                                    setOwnerForm({
                                        ...ownerForm,
                                        phone: e.target.value,
                                    })
                                }
                            />

                            <button type="submit" className="btn primary">
                                Save Owner
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Pets;