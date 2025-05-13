import { useEffect, useState } from "react";
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Autocomplete,
  TextField,
  Button,
  Stack,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import api from "../api";

interface Iscritto {
  id: string;
  corsoId: string;
  utenteId?: string;
  nome?: string;
  email?: string;
  user?: Utente;
}

interface Utente {
  id: string;
  username: string;
  email: string;
  role: string;
}

const IscrittiTab = ({
  corsoId,
  stato,
}: {
  corsoId: string;
  stato: string;
}) => {
  const [iscritti, setIscritti] = useState<Iscritto[]>([]);
  const [utenti, setUtenti] = useState<Utente[]>([]);
  const [utenteSelezionato, setUtenteSelezionato] = useState<Utente | null>(
    null
  );

  useEffect(() => {
    Promise.all([
      api.get(`/iscritti?corsoId=${corsoId}`),
      api.get(`/utenti?role=studente`),
    ]).then(([iscrittiRes, utentiRes]) => {
      const utentiArr: Utente[] = utentiRes.data as Utente[];
      const iscrittiArr: Iscritto[] = (iscrittiRes.data as Iscritto[]).map((i: Iscritto) => {
        const user = (utentiRes.data as Utente[]).find(
          (u: Utente) => u.id === i.utenteId
        );
        return { ...i, user };
      });
      setUtenti(utentiArr);
      setIscritti(iscrittiArr);
    });
  }, [corsoId]);

  const handleAggiungi = async () => {
    if (!utenteSelezionato) return;
    await api.post("/iscritti", {
      corsoId,
      utenteId: utenteSelezionato.id,
    });
    const res = await api.get(`/iscritti?corsoId=${corsoId}`);
    const iscrittiAggiornati: Iscritto[] = (res.data as Iscritto[]).map(
      (i: Iscritto) => {
        const user = utenti.find((u) => u.id === i.utenteId);
        return { ...i, user };
      }
    );
    setIscritti(iscrittiAggiornati);
    setUtenteSelezionato(null);
  };

  const handleRimuovi = async (id: string) => {
    await api.delete(`/iscritti/${id}`);
    setIscritti((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Iscritti
      </Typography>

      <List>
        {iscritti.map((i) => (
          <ListItem
            key={i.id}
            secondaryAction={
              <IconButton edge="end" onClick={() => handleRimuovi(i.id)}>
                <Delete />
              </IconButton>
            }
          >
            <ListItemText
              primary={i.user?.username || i.nome}
              secondary={i.user?.email || i.email}
            />
          </ListItem>
        ))}
      </List>

      {stato !== "chiuso" && (
        <Stack direction="row" spacing={2} mt={2} alignItems="center">
          <Autocomplete
            options={utenti}
            getOptionLabel={(u) => `${u.username} (${u.email})`}
            value={utenteSelezionato}
            onChange={(e, val) => setUtenteSelezionato(val)}
            sx={{ minWidth: 300 }}
            renderInput={(params) => (
              <TextField {...params} label="Seleziona studente" />
            )}
          />
          <Button
            variant="contained"
            onClick={handleAggiungi}
            disabled={!utenteSelezionato}
          >
            Aggiungi
          </Button>
        </Stack>
      )}

      {stato === "chiuso" && (
        <Typography variant="body2" color="text.secondary" mt={2}>
          Non è possibile aggiungere iscritti a un corso chiuso.
        </Typography>
      )}
    </>
  );
};

export default IscrittiTab;
