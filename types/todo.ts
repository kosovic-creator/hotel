

export type Todo = {
    id: number;
    title: string;
    priority: number;
    korisnik: string;
    done: boolean;
    details?: string; // Added optional 'details' property
};

export default function Todo() {
    // Function implementation here
}
