// src/pages/ProfiloUtente.tsx
import { useEffect, useState, useRef } from "react";
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
  TextField,
  Stack
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const [utente, setUtente] = useState<Utente | null>(null);
  const [corsi, setCorsi] = useState<Corso[]>([]);
  const [lezioni, setLezioni] = useState<Lezione[]>([]);
  const [materiali, setMateriali] = useState<Materiale[]>([]);
  const [valutazioni, setValutazioni] = useState<Valutazione[]>([]);
  const [emailEdit, setEmailEdit] = useState("");
  const [editVisible, setEditVisible] = useState(false);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (!user?.email || fetchedRef.current) return;
    fetchedRef.current = true;

    const fetchUserData = async () => {
      try {
        const resUtente = await api.get(`/utenti?email=${user.email}`);
        const utenteTrovato = Array.isArray(resUtente.data) ? resUtente.data[0] : resUtente.data;
        setUtente(utenteTrovato);
        setEmailEdit(utenteTrovato.email);

        const resIscritti = await api.get(`/iscritti?utenteId=${utenteTrovato.id}`);
        const corsoIds = (resIscritti.data as { corsoId: string }[]).map(i => i.corsoId);
        const corsiData = await Promise.all(corsoIds.map(id => api.get(`/corsi/${id}`)));
        setCorsi(corsiData.map(r => r.data as Corso));

        const resValutazioni = await api.get(`/valutazioni?utenteId=${utenteTrovato.id}`);
        setValutazioni(resValutazioni.data as Valutazione[]);
      } catch (err) {
        console.error("Errore caricamento dati profilo", err);
      }
    };

    fetchUserData();
  }, [user?.email]);

  useEffect(() => {
    const fetchStaticData = async () => {
      try {
        const lezioniRes = await api.get("/lezioni");
        setLezioni(lezioniRes.data as Lezione[]);

        const materialiRes = await api.get("/materiali");
        setMateriali(materialiRes.data as Materiale[]);
      } catch (err) {
        console.error("Errore caricamento lezioni o materiali", err);
      }
    };

    fetchStaticData();
  }, []);

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && utente) {
      if (!["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
        alert("Puoi caricare solo file PNG o JPEG.");
        return;
      }

      const base64 = await convertFileToBase64(file);
      await api.patch(`/utenti/${utente.id}`, { profileImage: base64 });
      setUtente({ ...utente, profileImage: base64 });
      alert("Foto profilo aggiornata");
    }
  };

  const handleEmailSave = async () => {
    if (utente && emailEdit) {
      await api.patch(`/utenti/${utente.id}`, { email: emailEdit });
      setUtente({ ...utente, email: emailEdit });
      alert("Email aggiornata");
      setEditVisible(false);
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
            src={utente.profileImage}
            sx={{ width: 64, height: 64 }}
          />
          <Box>
            <Typography variant="h6">{utente.username}</Typography>
            <Typography variant="body2">{utente.email}</Typography>
            <Typography variant="body2">Ruolo: {utente.role}</Typography>
          </Box>
        </Box>

        <Stack direction="row" spacing={2} mt={2}>
          <Button variant="contained" component="label">
            Carica Foto
            <input hidden accept="image/png, image/jpeg, image/jpg" type="file" onChange={handleUpload} />
          </Button>
          <Button variant="outlined" onClick={() => setEditVisible(!editVisible)}>
            Aggiorna contatto
          </Button>
        </Stack>

        {editVisible && (
          <Box mt={2}>
            <TextField
              label="Email"
              variant="outlined"
              value={emailEdit}
              onChange={(e) => setEmailEdit(e.target.value)}
              fullWidth
              sx={{ mb: 1 }}
            />
            <Button onClick={handleEmailSave} variant="contained">Salva Email</Button>
          </Box>
        )}
      </Paper>

      {utente.role === "studente" && (
        <>
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
                <Box mt={2}>
                  <Button size="small" variant="outlined" onClick={() => navigate(`/corsi/${corso.id}`)}>
                    Vedi dettaglio
                  </Button>
                </Box>
              </AccordionDetails>
            </Accordion>
          ))}
        </>
      )}
    </Box>
  );
};

export default ProfiloUtente;