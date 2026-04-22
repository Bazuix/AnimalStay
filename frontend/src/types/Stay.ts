export interface Stay {
    id: number;
    startDate: string;
    endDate: string;
    status: string;
    notes?: string;
    needsMeds: boolean;
    needsWalk: boolean;
    medsInfo?: string;
    pet: {
        id: number;
        name: string;
        species: string;
        breed?: string;
        age: number;
        owner: { name: string; phone: string; email: string };
    };
    room: { id: number; number: number; type: string; pricePerDay: number };
    services: { service: { id: number; name: string; price: number } }[];
}
