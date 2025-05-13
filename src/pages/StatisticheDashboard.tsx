import { useEffect, useState } from "react";
import { Box, Typography, Paper } from "@mui/material";
import Grid from "@mui/material/Grid";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import api from "../api";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const StatisticheDashboard = () => {
  const [numCorsi, setNumCorsi] = useState(0);
  const [numIscritti, setNumIscritti] = useState(0);
  const [numMateriali, setNumMateriali] = useState(0);
  const [completamentoCorsi, setCompletamentoCorsi] = useState<{ name: string; value: number; }[]>([]);

  useEffect(() => {
    api.get<{ stato: string }[]>("/corsi").then((res) => {
      setNumCorsi(res.data.length);
      const statoCount = res.data.reduce((acc: Record<string, number>, corso: { stato: string }) => {
        acc[corso.stato] = (acc[corso.stato] || 0) + 1;
        return acc;
      }, {});
      setCompletamentoCorsi(
        Object.entries(statoCount).map(([name, value]) => ({ name, value }))
      );
    });
    api.get<{ length: number }>("/iscritti").then((res) => setNumIscritti(res.data.length));
    api.get<{ length: number }>("/materiali").then((res) => setNumMateriali(res.data.length));
  }, []);

  return (
    <Box px={4} py={3}>
      <Typography variant="h5" gutterBottom>
        Statistiche del Portale
      </Typography>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Corsi totali</Typography>
            <Typography variant="h4">{numCorsi}</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Iscritti totali</Typography>
            <Typography variant="h4">{numIscritti}</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Materiali caricati</Typography>
            <Typography variant="h4">{numMateriali}</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2, height: 300 }}>
            <Typography variant="h6" gutterBottom>
              Completamento Corsi
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={completamentoCorsi}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label
                >
                  {completamentoCorsi.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StatisticheDashboard;
