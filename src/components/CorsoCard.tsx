import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  IconButton,
  Chip,
  CardActions,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Corso } from "../models/Corso";
import { ReactNode } from "react";
import { Link } from "react-router-dom";

interface Props {
  corso: Corso;
  onEdit?: (corso: Corso) => void;
  onDelete?: (corsoId: string) => void;
  children?: ReactNode;
}

const CorsoCard = ({ corso, onEdit, onDelete, children }: Props) => {
  const statoColor = {
    pianificato: "info",
    "in corso": "success",
    chiuso: "default",
  } as const;

  // fallback a un'immagine placeholder se non presente
  const immagineSrc = corso.immagine?.startsWith("data:")
    ? corso.immagine
    : "/logo.svg";

  return (
    <Card>
      <CardMedia
        component="img"
        height="140"
        image={immagineSrc}
        alt={`Corso ${corso.titolo}`}
        sx={{ objectFit: "contain", backgroundColor: "#fff" }}
      />
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography gutterBottom variant="h6">
            {corso.titolo}
          </Typography>
          <Chip
            label={corso.stato}
            color={statoColor[corso.stato.toLowerCase() as keyof typeof statoColor]}
            size="small"
          />
        </Box>
        <Typography variant="body2" color="textSecondary">
          {corso.descrizione}
        </Typography>
        <Typography variant="caption" display="block" mt={1}>
          Iscritti: {corso.iscritti}
        </Typography>
        <Box display="flex" justifyContent="flex-end" gap={1} mt={1} flexWrap="wrap">
          <IconButton onClick={() => onEdit?.(corso)}>
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton onClick={() => onDelete?.(corso.id)}>
            <DeleteIcon fontSize="small" />
          </IconButton>
          <Link to={`/corsi/${corso.id}`} style={{ textDecoration: "none", flexGrow: 1 }}>
            <Button variant="outlined" fullWidth>
              Vai al dettaglio
            </Button>
          </Link>
        </Box>
      </CardContent>
      {children && <CardActions>{children}</CardActions>}
    </Card>
  );
};

export default CorsoCard;
