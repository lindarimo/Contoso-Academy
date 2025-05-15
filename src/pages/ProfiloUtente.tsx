import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Button,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  Chip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import api from "../api";
import { useAuth } from "../context/AuthContext";

interface Utente {
  id: string;
  username: string;
  email: string;
  role: string;
  profileImage?: string;
}

interface Corso {
  id: string;
  titolo: string;
}

interface Lezione {
  id: string;
  corsoId: string;
  data: string;
  argomento: string;
}

interface Materiale {
  id: string;
  corsoId: string;
  titolo: string;
  contenuto: string;
}

interface Valutazione {
  id: string;
  corsoId: string;
  utenteId: string;
  voto: number;
}

const ProfiloUtente = () => {
  const { user } = useAuth();
  const [utente, setUtente] = useState<Utente | null>(null);
  const [corsi, setCorsi] = useState<Corso[]>([]);
  const [lezioni, setLezioni] = useState<Lezione[]>([]);
  const [materiali, setMateriali] = useState<Materiale[]>([]);
  const [valutazioni, setValutazioni] = useState<Valutazione[]>([]);

  useEffect(() => {
    if (!user?.email) return;
    api.get(`/utenti?email=${user.email}`).then((res) => {
      const result = Array.isArray(res.data) ? res.data[0] : res.data;
      setUtente(result);

      api.get(`/iscritti?utenteId=${result.id}`).then(async (res) => {
        const corsiUtenteIds = (res.data as { corsoId: string }[]).map(
          (i) => i.corsoId
        );
        const corsiUtentePromises = corsiUtenteIds.map((id) =>
          api.get(`/corsi/${id}`)
        );
        const corsiUtenteResponses = await Promise.all(corsiUtentePromises);
        setCorsi(corsiUtenteResponses.map((r) => r.data as Corso));
      });

      api
        .get(`/valutazioni?utenteId=${result.id}`)
        .then((res) => setValutazioni(res.data as Valutazione[]));
    });

    api.get(`/lezioni`).then((res) => setLezioni(res.data as Lezione[]));
    api.get(`/materiali`).then((res) => setMateriali(res.data as Materiale[]));
  }, [user]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && utente) {
      if (!["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
        alert("Puoi caricare solo file PNG o JPEG.");
        return;
      }

      const filename = file.name;
      const imagePath = `uploads/${filename}`;

      await api.patch(`/utenti/${utente.id}`, { profileImage: imagePath });
      setUtente({ ...utente, profileImage: imagePath });
      alert("Foto profilo aggiornata");
    }
  };

  if (!utente) return null;

  return (
    <Box px={4} py={3}>
      <Typography variant="h5" gutterBottom>
        Benvenuto, {utente.username}{" "}
        <Chip
          label={utente.role}
          color={utente.role === "admin" ? "primary" : "default"}
          size="small"
          sx={{ ml: 2 }}
        />
      </Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar
            src={utente.profileImage ? `/${utente.profileImage}` : undefined}
            sx={{ width: 64, height: 64 }}
          />
          <Box>
            <Typography variant="h6">{utente.username}</Typography>
            <Typography variant="body2">{utente.email}</Typography>
            <Typography variant="body2">Ruolo: {utente.role}</Typography>
          </Box>
        </Box>

        <Box mt={2}>
          <Button variant="contained" component="label">
            Carica Foto
            <input hidden accept="image/png, image/jpeg, image/jpg" type="file" onChange={handleUpload} />
          </Button>
        </Box>
      </Paper>

      <Typography variant="h6">Corsi</Typography>
      {corsi.map((corso) => (
        <Accordion key={corso.id}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{corso.titolo}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="subtitle2">Lezioni</Typography>
            <List dense>
              {lezioni
                .filter((l) => l.corsoId === corso.id)
                .map((lez) => (
                  <ListItem key={lez.id}>
                    <ListItemText primary={`${lez.data} - ${lez.argomento}`} />
                  </ListItem>
                ))}
            </List>
            <Divider sx={{ my: 1 }} />
            <Typography variant="subtitle2">Materiali</Typography>
            <List dense>
              {materiali
                .filter((m) => m.corsoId === corso.id)
                .map((mat) => (
                  <ListItem key={mat.id}>
                    <ListItemText primary={mat.titolo} />
                  </ListItem>
                ))}
            </List>
            <Divider sx={{ my: 1 }} />
            <Typography variant="subtitle2">Valutazione</Typography>
            <Typography>
              {valutazioni.find((v) => v.corsoId === corso.id)?.voto ?? "-"}
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default ProfiloUtente;
