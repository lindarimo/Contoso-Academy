// src/pages/Dashboard.tsx
import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Stack,
} from "@mui/material";
import CorsoCard from "../components/CorsoCard";
import { Corso, StatoCorso } from "../models/Corso";
import api from "../api";
import CorsoDialog from "../components/CorsoDialog";
import { useCorsoApi } from "../service/CorsoApi";

const Dashboard = () => {
  const [anniDisponibili, setAnniDisponibili] = useState<number[]>([]);
  const [anno, setAnno] = useState(2025);
  const [corsi, setCorsi] = useState<Corso[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Corso | null>(null);

  const { getCorsi, createCorso, updateCorso, deleteCorso } = useCorsoApi();

  // Carica tutti i corsi una sola volta per estrarre anni
  useEffect(() => {
    api
      .get("/corsi")
      .then((res) => res.data as Corso[])
      .then((data) => {
        const anni = Array.from(new Set(data.map((c) => c.anno))).sort(
          (a, b) => b - a
        );
        setAnniDisponibili(anni);
        setAnno(anni[0]); // default al più recente
      });
  }, []);

  // Carica corsi filtrati per anno
  useEffect(() => {
    if (anno !== null) {
      api
        .get(`/corsi?anno=${anno}`)
        .then((res) => res.data as Corso[])
        .then((data: Corso[]) => setCorsi(data));
    }
  }, [anno]);

  // Funzione per aprire la dialog di creazione/modifica
  const handleSaveCorso = async (corso: Partial<Corso>) => {
    if (editingCourse) {
      await updateCorso(editingCourse.id, corso);
    } else {
      await createCorso({ ...corso, anno });
    }
    setOpenDialog(false);
    setEditingCourse(null);
    const updated = await getCorsi(anno);
    setCorsi(updated);
  };

  return (
    <Box px={4} py={3}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Typography variant="h4">Gestione Corsi</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setEditingCourse(null); 
            setOpenDialog(true); 
          }}
        >
          + Nuovo Corso
        </Button>
      </Box>

      <FormControl fullWidth sx={{ mb: 4 }}>
        <InputLabel id="anno-label">Anno accademico</InputLabel>
        <Select
          labelId="anno-label"
          value={anno ?? ""}
          onChange={(e) => setAnno(Number(e.target.value))}
          label="Anno accademico"
        >
          {anniDisponibili.map((a) => (
            <MenuItem key={a} value={a}>
              {a}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Stack
        direction="row"
        spacing={3}
        useFlexGap
        flexWrap="wrap"
        justifyContent="flex-start"
      >
        {corsi.map((corso) => (
          <Box
            key={corso.id}
            width={{
              xs: "100%",
              sm: "calc(50% - 12px)",
              md: "calc(33.33% - 12px)",
            }}
          >
            <CorsoCard
              corso={corso}
              onEdit={() => {
                setEditingCourse(corso);
                setOpenDialog(true);
              }}
              // un corso non può essere eliminato se è in corso o chiuso.
              onDelete={async () => {
                if (corso.stato !== StatoCorso.PIANIFICATO) {
                  alert("Non puoi eliminare un corso che è in corso o già chiuso.");
                  return;
                }
                if (window.confirm("Vuoi davvero eliminare il corso?")) {
                  await deleteCorso(corso.id);
                  setCorsi((prev) => prev.filter((c) => c.id !== corso.id));
                }
              }}              
            />
          </Box>
        ))}
      </Stack>

      <CorsoDialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
          setEditingCourse(null);
        }}
        onSave={handleSaveCorso}
        corsoToEdit={editingCourse}
        annoCorrente={anno}
      />
    </Box>
  );
};

export default Dashboard;
