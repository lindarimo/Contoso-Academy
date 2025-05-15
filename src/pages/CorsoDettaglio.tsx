import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  CircularProgress,
  Button
} from "@mui/material";
import { Corso } from "../models/Corso";
import api from "../api";
import IscrittiTab from "../components/IscrittiTab";
import LezioniTab from "../components/LezioniTab";
import MaterialiTab from "../components/MaterialiTab";
import ValutazioniTab from "../components/ValutazioniTab";


const CorsoDettaglio = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tabIndex, setTabIndex] = useState(0);
  const [corso, setCorso] = useState<Corso | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/corsi/${id}`)
      .then((res) => res.data as Corso)
      .then((data) => {
        setCorso(data);
        setLoading(false);
      });
  }, [id]);

  if (loading || !corso) return <CircularProgress sx={{ m: 4 }} />;

  return (
    <Box px={4} py={3}>
      <Button onClick={() => navigate(-1)} variant="outlined" sx={{ mb: 2 }}>
        ← Indietro
      </Button>

      <Typography variant="h5" gutterBottom>
        {corso.titolo}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        {corso.descrizione} (Stato: {corso.stato})
      </Typography>

      <Tabs
        value={tabIndex}
        onChange={(_, newValue) => setTabIndex(newValue)}
        sx={{ mb: 2 }}
      >
        <Tab label="Iscritti" />
        <Tab label="Lezioni" />
        <Tab label="Materiali" />
        <Tab label="Valutazioni" />
      </Tabs>

      {tabIndex === 0 && <IscrittiTab corsoId={corso.id} stato={corso.stato} />}
      {tabIndex === 1 && <LezioniTab corsoId={corso.id} />}
      {tabIndex === 2 && <MaterialiTab corsoId={corso.id} />}
      {tabIndex === 3 && (
        <ValutazioniTab
          corsoId={corso.id}
          corsoStato={corso.stato}
          chiusuraData={corso.chiusuraData}
        />
      )}
    </Box>
  );
};

export default CorsoDettaglio;