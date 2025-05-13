import api from "../api";
import { Corso } from "../models/Corso";

export const useCorsoApi = () => {
  const getCorsi = async (anno: number): Promise<Corso[]> => {
    const res = await api.get<Corso[]>(`/corsi?anno=${anno}`);
    return res.data;
  };

  const createCorso = async (corso: Partial<Corso>) => {
    return await api.post("/corsi", corso);
  };

  const updateCorso = async (id: string, corso: Partial<Corso>) => {
    return await api.put(`/corsi/${id}`, corso);
  };

  const deleteCorso = async (id: string) => {
    return await api.delete(`/corsi/${id}`);
  };

  return { getCorsi, createCorso, updateCorso, deleteCorso };
};
