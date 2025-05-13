import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Stack
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import api from "../api";
import { StatoCorso } from "../models/Corso"; // Ensure StatoCorso is an enum in the imported file

interface Utente {
  id: string;
  username: string;
  email: string;
  role: string;
}

interface Corso {
  id: string;
  titolo: string;
  stato: StatoCorso
}

interface Iscrizione {
  id: string;
  corsoId: string;
  utenteId: string;
}

const DettaglioUtente = () => {
  const { id } = useParams();
  const [utente, setUtente] = useState<Utente | null>(null);
  const [corsi, setCorsi] = useState<Corso[]>([]);
  const [iscrizioni, setIscrizioni] = useState<Iscrizione[]>([]);
  const [corsoDaAggiungere, setCorsoDaAggiungere] = useState<string>("");

  useEffect(() => {
    api.get(`/utenti/${id}`).then((res) => setUtente(res.data as Utente));
    api.get(`/iscritti?utenteId=${id}`).then((res) => setIscrizioni(res.data as Iscrizione[]));
    api.get(`/corsi`).then((res) => setCorsi(res.data as Corso[]));
  }, [id]);

  const handleRimuovi = async (iscrizioneId: string, corsoId: string) => {
    const corso = corsi.find(c => c.id === corsoId);
    if (corso && corso.stato ===  StatoCorso.CHIUSO) {
      alert("Non è possibile rimuovere un utente da un corso chiuso.");
      return;
    }
    await api.delete(`/iscritti/${iscrizioneId}`);
    const aggiornate = await api.get(`/iscritti?utenteId=${id}`);
    setIscrizioni(aggiornate.data as Iscrizione[]);
  };

  const handleAggiungi = async () => {
    const corso = corsi.find(c => c.id === corsoDaAggiungere);
    if (!corso || corso.stato === StatoCorso.CHIUSO) {
      alert("Non è possibile iscrivere l'utente a un corso chiuso.");
      return;
    }
    await api.post(`/iscritti`, {
      corsoId: corsoDaAggiungere,
      utenteId: id
    });
    const aggiornate = await api.get(`/iscritti?utenteId=${id}`);
    setIscrizioni(aggiornate.data as Iscrizione[]);
    setCorsoDaAggiungere("");
  };

  const corsiIscritti = corsi.filter((c) =>
    iscrizioni.some((i) => i.corsoId === c.id)
  );

  const corsiNonIscritti = corsi.filter((c) =>
    !iscrizioni.some((i) => i.corsoId === c.id)
  );

  if (!utente) return null;

  return (
    <Box px={4} py={3}>
      <Typography variant="h5" gutterBottom>
        Dettaglio Utente
      </Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="subtitle1">Nome utente: {utente.username}</Typography>
        <Typography variant="subtitle1">Email: {utente.email}</Typography>
        <Typography variant="subtitle1">Ruolo: {utente.role}</Typography>
      </Paper>

      <Typography variant="h6">Corsi iscritti</Typography>
      <List>
        {corsiIscritti.map((corso) => {
          const iscrizione = iscrizioni.find((i) => i.corsoId === corso.id);
          return (
            <ListItem
              key={corso.id}
              secondaryAction={
                <IconButton onClick={() => handleRimuovi(iscrizione!.id, corso.id)}>
                  <Delete />
                </IconButton>
              }
            >
              <ListItemText primary={corso.titolo} />
            </ListItem>
          );
        })}
      </List>

      <Stack direction="row" spacing={2} mt={2} alignItems="center">
        <FormControl fullWidth>
          <InputLabel id="aggiungi-corso-label">Aggiungi corso</InputLabel>
          <Select
            labelId="aggiungi-corso-label"
            value={corsoDaAggiungere}
            onChange={(e) => setCorsoDaAggiungere(e.target.value)}
            label="Aggiungi corso"
          >
            {corsiNonIscritti.map((corso) => (
              <MenuItem key={corso.id} value={corso.id}>
                {corso.titolo}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="contained" onClick={handleAggiungi}>
          Aggiungi
        </Button>
      </Stack>
    </Box>
  );
};

export default DettaglioUtente;