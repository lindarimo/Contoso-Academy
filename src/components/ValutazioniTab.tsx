import { useEffect, useState } from "react";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  IconButton,
  Paper,
  Box,
} from "@mui/material";
import { Edit, Save } from "@mui/icons-material";
import api from "../api";
import { StatoCorso } from "../models/Corso";

interface Utenti {
  id: string;
  username: string;
  passwoord: string;
  role: string;
  email: string;
}

interface Iscritto {
  id: string;
  corsoId: string;
  utenteId: string;
}

interface Valutazione {
  id: string;
  corsoId: string;
  utenteId: string;
  voto: number;
}

const ValutazioniTab = ({
  corsoId,
  corsoStato,
  chiusuraData,
}: {
  corsoId: string;
  corsoStato: StatoCorso;
  chiusuraData?: string;
}) => {
  const [utenti, setUtenti] = useState<Utenti[]>([]);
  const [valutazioni, setValutazioni] = useState<Valutazione[]>([]);
  const [iscritti, setIscritti] = useState<Iscritto[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedVoto, setEditedVoto] = useState<number | null>(null);
  const [isModificabile, setIsModificabile] = useState(true);

  useEffect(() => {
    api
      .get(`/iscritti?corsoId=${corsoId}`)
      .then((res) => setIscritti(res.data as Iscritto[]));
    api
      .get(`/valutazioni?corsoId=${corsoId}`)
      .then((res) => setValutazioni(res.data as Valutazione[]));
    api
      .get(`/utenti?role=studente`)
      .then((res) => setUtenti(res.data as Utenti[]));


    if (corsoStato === StatoCorso.CHIUSO && chiusuraData) {
      const oggi = new Date();
      const dataChiusura = new Date(chiusuraData);

      if (!isNaN(dataChiusura.getTime())) {
        const diffGiorni = Math.floor(
          (oggi.getTime() - dataChiusura.getTime()) / (1000 * 60 * 60 * 24)
        );
        setIsModificabile(diffGiorni <= 30);
      } else {
        setIsModificabile(false);
      }
    }
  }, [corsoId, corsoStato, chiusuraData]);

  const getVotoByStudente = (studenteId: string): number | null => {
    const entry = valutazioni.find((v) => v.utenteId === studenteId);
    return entry ? entry.voto : null;
  };

  const handleEdit = (studenteId: string) => {
    setEditingId(studenteId);
    const votoCorrente = getVotoByStudente(studenteId);
    setEditedVoto(votoCorrente ?? 0);
  };

  const handleSave = async (studenteId: string) => {
    const existing = valutazioni.find(
      (v) => String(v.utenteId) === String(studenteId)
    );
    if (existing) {
      await api.put(`/valutazioni/${existing.id}`, {
        ...existing,
        voto: editedVoto,
      });
    } else {
      await api.post("/valutazioni", { corsoId, studenteId, voto: editedVoto });
    }
    const updated = await api.get<Valutazione[]>(
      `/valutazioni?corsoId=${corsoId}`
    );
    setValutazioni(updated.data);
    setEditingId(null);
    setEditedVoto(null);
  };

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Valutazioni
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Studente</TableCell>
              <TableCell>Voto</TableCell>
              <TableCell align="right">Azioni</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {iscritti.map((iscritto) => {
              const voto = valutazioni.find(
                (v) => v.utenteId === iscritto.utenteId
              )?.voto;
              const isEditing = editingId === iscritto.utenteId;
              const utente = utenti.find((u) => u.id === iscritto.utenteId);

              return (
                <TableRow key={iscritto.id}>
                  <TableCell>{utente?.username || "-"}</TableCell>
                  <TableCell>
                    {isEditing ? (
                      <TextField
                        type="number"
                        value={editedVoto ?? 0}
                        onChange={(e) => setEditedVoto(Number(e.target.value))}
                        size="small"
                      />
                    ) : (
                      voto ?? "-"
                    )}
                  </TableCell>
                  <TableCell align="right">
                    {isModificabile &&
                      (isEditing ? (
                        <IconButton
                          onClick={() => handleSave(iscritto.utenteId)}
                        >
                          <Save />
                        </IconButton>
                      ) : (
                        <IconButton
                          onClick={() => handleEdit(iscritto.utenteId)}
                        >
                          {voto !== null ? (
                            <Edit />
                          ) : (
                            <span style={{ fontSize: 18 }}>➕</span>
                          )}
                        </IconButton>
                      ))}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {!isModificabile && (
        <Box mt={2}>
          <Typography variant="body2" color="error">
            Le valutazioni non sono più modificabili perché il corso è stato
            chiuso da oltre 30 giorni.
          </Typography>
        </Box>
      )}
    </>
  );
};

export default ValutazioniTab;
