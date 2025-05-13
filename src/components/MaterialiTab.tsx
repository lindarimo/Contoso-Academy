// src/pages/MaterialiTab.tsx (con upload simulato)
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
import { Delete, Download } from "@mui/icons-material";
import api from "../api";

const MaterialiTab = ({ corsoId }: { corsoId: string }) => {
  interface Materiale {
    id: string;
    titolo: string;
    contenuto: string;
  }
  
  const [materiali, setMateriali] = useState<Materiale[]>([]);
  const [titolo, setTitolo] = useState("");
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    api.get(`/materiali?corsoId=${corsoId}`).then((res) => setMateriali(res.data as Materiale[]));
  }, [corsoId]);

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };
  const handleAggiungi = async () => {
    if (!titolo || !file) return;
    const base64 = await convertFileToBase64(file);
    await api.post("/materiali", { titolo, contenuto: base64, corsoId });
    const res = await api.get<Materiale[]>(`/materiali?corsoId=${corsoId}`);
    setMateriali(res.data);
    setTitolo("");
    setFile(null);
  };

  const handleRimuovi = async (id: string) => {
    await api.delete(`/materiali/${id}`);
    setMateriali((prev) => prev.filter((m) => m.id !== id));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
  const selected = e.target.files?.[0] || null;
  if (!selected) return;

  const isPdf = selected.type === "application/pdf";
  const isSizeOk = selected.size <= 10 * 1024 * 1024;

  if (!isPdf) {
    alert("Puoi caricare solo file PDF.");
    return;
  }

  if (!isSizeOk) {
    alert("Il file deve essere inferiore a 10MB.");
    return;
  }

  setFile(selected);
};


  return (
    <>
      <Typography variant="h6" gutterBottom>Materiali</Typography>

      <List>
        {materiali.map((m) => (
          <ListItem
            key={m.id}
            secondaryAction={
              <>
                <IconButton
                  edge="end"
                  href={m.contenuto}
                  download={m.titolo.replace(/\s+/g, "_")}
                >
                  <Download />
                </IconButton>
                <IconButton edge="end" onClick={() => handleRimuovi(m.id)}>
                  <Delete />
                </IconButton>
              </>
            }
          >
            <ListItemText primary={m.titolo} secondary={file ? file.name : ""} />
          </ListItem>
        ))}
      </List>

      <Stack direction="row" spacing={2} mt={2} alignItems="center">
        <TextField
          label="Titolo"
          value={titolo}
          onChange={(e) => setTitolo(e.target.value)}
        />
        <Button variant="outlined" component="label">
          Scegli file
          <input
            type="file"
            hidden
            onChange={handleFileSelect}
          />
        </Button>
        <Button variant="contained" onClick={handleAggiungi} disabled={!file || !titolo}>
          Carica
        </Button>
      </Stack>

      {file && (
        <Typography variant="body2" color="text.secondary" mt={1}>
          File selezionato: {file.name}
        </Typography>
      )}
    </>
  );
};

export default MaterialiTab;
