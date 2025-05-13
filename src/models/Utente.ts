export interface Utente {
  id: number;
  username: string;
  password: string;
  email: string;
  role: "admin" | "studente";
}
