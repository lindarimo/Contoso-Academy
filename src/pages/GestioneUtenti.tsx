// src/pages/GestioneUtenti.tsx
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  TextField,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Link,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import api from "../api";

interface Utente {
  id: string;
  username: string;
  email: string;
  role: string;
}

const GestioneUtenti = () => {
  const [utenti, setUtenti] = useState<Utente[]>([]);
  const [filtro, setFiltro] = useState("");
  const [dialogAperta, setDialogAperta] = useState(false);
  const [utenteCorrente, setUtenteCorrente] = useState<Partial<Utente> | null>(
    null
  );

  const caricaUtenti = async () => {
    const res = await api.get<Utente[]>("/utenti");
    setUtenti(res.data);
  };

  useEffect(() => {
    caricaUtenti();
  }, []);

  const handleDelete = async (utente: Utente) => {
    const iscrizioni = await api.get<{ corsoId: string }[]>(
      `/iscritti?utenteId=${utente.id}`
    );
    const corsiInCorso = await Promise.all(
      iscrizioni.data.map((i) =>
        api.get<{ stato: string }>(`/corsi/${i.corsoId}`)
      )
    );
    const bloccanti = corsiInCorso.some((res) => res.data.stato === "in corso");
    if (bloccanti) {
      alert("Impossibile eliminare: l'utente è iscritto a un corso in corso.");
      return;
    }
    if (window.confirm("Confermi l'eliminazione dell'utente?")) {
      await api.delete(`/utenti/${utente.id}`);
      await caricaUtenti();
    }
  };

  const utentiFiltrati = utenti.filter(
    (u) =>
      u.username.toLowerCase().includes(filtro.toLowerCase()) ||
      u.email.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <Box px={4} py={3}>
      <Typography variant="h5" gutterBottom>
        Gestione Utenti
      </Typography>
      <Stack direction="row" spacing={2} mb={2}>
        <TextField
          label="Cerca per nome o email"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />
        <Button
          variant="contained"
          onClick={() => {
            setUtenteCorrente(null);
            setDialogAperta(true);
          }}
        >
          + Nuovo Utente
        </Button>
      </Stack>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Username</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Ruolo</TableCell>
            <TableCell align="right">Azioni</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {utentiFiltrati.map((u) => (
            <TableRow key={u.id}>
              <TableCell>
                <Link component="a" href={`/utenti/${u.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                  {u.username}
                </Link>
              </TableCell>
              <TableCell>{u.email}</TableCell>
              <TableCell>{u.role}</TableCell>
              <TableCell align="right">
                <IconButton
                  onClick={() => {
                    setUtenteCorrente(u);
                    setDialogAperta(true);
                  }}
                >
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleDelete(u)}>
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={dialogAperta} onClose={() => setDialogAperta(false)}>
        <DialogTitle>
          {utenteCorrente ? "Modifica Utente" : "Nuovo Utente"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Username"
            fullWidth
            margin="normal"
            value={utenteCorrente?.username || ""}
            onChange={(e) =>
              setUtenteCorrente({ ...utenteCorrente, username: e.target.value })
            }
          />
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={utenteCorrente?.email || ""}
            onChange={(e) =>
              setUtenteCorrente({ ...utenteCorrente, email: e.target.value })
            }
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="role-label">Ruolo</InputLabel>
            <Select
              labelId="role-label"
              value={utenteCorrente?.role || ""}
              label="Ruolo"
              onChange={(e) =>
                setUtenteCorrente({ ...utenteCorrente, role: e.target.value })
              }
            >
              <MenuItem value="studente">Studente</MenuItem>
              <MenuItem value="admin">Amministratore</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogAperta(false)}>Annulla</Button>
          <Button
            variant="contained"
            onClick={async () => {
              if (utenteCorrente?.id) {
                await api.put(`/utenti/${utenteCorrente.id}`, utenteCorrente);
              } else {
                await api.post(`/utenti`, utenteCorrente);
              }
              await caricaUtenti();
              setDialogAperta(false);
            }}
          >
            Salva
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GestioneUtenti;
