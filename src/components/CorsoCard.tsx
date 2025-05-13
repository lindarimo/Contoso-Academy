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

  return (
    <Card>
      <CardMedia
        component="img"
        height="140"
        image={corso.immagine}
        alt={`Corso ${corso.titolo}`}
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
        <Box display="flex" justifyContent="flex-end" mt={1}>
          <IconButton onClick={() => onEdit?.(corso)}>
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton onClick={() => onDelete?.(corso.id)}>
            <DeleteIcon fontSize="small" />
          </IconButton>
          <Link
            to={`/corsi/${corso.id}`}
            style={{ textDecoration: "none", width: "100%" }}
          >
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
