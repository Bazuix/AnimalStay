import { useEffect, useState } from "react";
import api from "../api/axios";
import type {Pet} from "../types/Pet";

const Pets = () => {
    const [pets, setPets] = useState<Pet[]>([]);

    useEffect(() => {
        api.get("/pets")
            .then((res) => setPets(res.data))
            .catch((err) => console.error(err));
    }, []);

    return (
        <div className="page">
            <h2>Lista zwierząt 🐶</h2>

            {pets.length === 0 ? (
                <p>Brak zwierząt</p>
            ) : (
                <ul>
                    {pets.map((pet) => (
                        <li key={pet.id}>
                            <strong>{pet.name}</strong> ({pet.species}) – {pet.age} lat
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Pets;