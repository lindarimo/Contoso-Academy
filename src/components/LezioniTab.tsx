// src/pages/LezioniTab.tsx
import { useEffect, useState } from "react";
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Button,
  TextField,
  Stack
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import api from "../api";

const LezioniTab = ({ corsoId }: { corsoId: string }) => {
  const [lezioni, setLezioni] = useState<{ id: string; argomento: string; data: string }[]>([]);
  const [data, setData] = useState("");
  const [argomento, setArgomento] = useState("");

  useEffect(() => {
    api.get(`/lezioni?corsoId=${corsoId}`).then((res) => setLezioni(res.data as { id: string; argomento: string; data: string }[]));
  }, [corsoId]);

  const handleAggiungi = async () => {
    if (!data || !argomento) return;
    await api.post("/lezioni", { data, argomento, corsoId });
    const res = await api.get<{ id: string; argomento: string; data: string }[]>(`/lezioni?corsoId=${corsoId}`);
    setLezioni(res.data);
    setData("");
    setArgomento("");
  };

  const handleRimuovi = async (id: string) => {
    await api.delete(`/lezioni/${id}`);
    setLezioni((prev) => prev.filter((l) => l.id !== id));
  };

  return (
    <>
      <Typography variant="h6" gutterBottom>Lezioni</Typography>

      <List>
        {lezioni.map((lezione) => (
          <ListItem
            key={lezione.id}
            secondaryAction={
              <IconButton edge="end" onClick={() => handleRimuovi(lezione.id)}>
                <Delete />
              </IconButton>
            }
          >
            <ListItemText primary={lezione.argomento} secondary={lezione.data} />
          </ListItem>
        ))}
      </List>

      <Stack direction="row" spacing={2} mt={2}>
        <TextField
          label="Data"
          type="date"
          value={data}
          onChange={(e) => setData(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Argomento"
          value={argomento}
          onChange={(e) => setArgomento(e.target.value)}
        />
        <Button variant="contained" onClick={handleAggiungi}>
          Aggiungi
        </Button>
      </Stack>
    </>
  );
};

export default LezioniTab;
