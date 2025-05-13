// src/components/CorsoDialog.tsx
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select
  } from "@mui/material";
  import { useState, useEffect } from "react";
  import { Corso } from "../models/Corso";
  
  interface CorsoDialogProps {
    open: boolean;
    onClose: () => void;
    onSave: (corso: Partial<Corso>) => void;
    corsoToEdit?: Corso | null;
    annoCorrente: number;
  }
  
  const CorsoDialog = ({ open, onClose, onSave, corsoToEdit, annoCorrente }: CorsoDialogProps) => {
    const [corso, setCorso] = useState<Partial<Corso>>({
      titolo: "",
      descrizione: "",
      anno: annoCorrente,
      stato: "pianificato",
    });
  
    useEffect(() => {
      if (corsoToEdit) {
        setCorso(corsoToEdit);
      } else {
        setCorso({ titolo: "", descrizione: "", anno: annoCorrente, stato: "pianificato" });
      }
    }, [corsoToEdit, annoCorrente]);
  
    const handleChange = (field: keyof Corso, value: string | number) => {
      setCorso({ ...corso, [field]: value });
    };
  
    const handleSubmit = () => {
      onSave(corso);
    };
  
    return (
      <Dialog open={open} onClose={onClose} fullWidth>
        <DialogTitle>{corsoToEdit ? "Modifica Corso" : "Nuovo Corso"}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Titolo"
            fullWidth
            value={corso.titolo}
            onChange={(e) => handleChange("titolo", e.target.value)}
          />
          <TextField
            margin="dense"
            label="Descrizione"
            fullWidth
            value={corso.descrizione}
            onChange={(e) => handleChange("descrizione", e.target.value)}
          />
  
          {corsoToEdit && (
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel id="stato-label">Stato</InputLabel>
              <Select
                labelId="stato-label"
                value={corso.stato || "pianificato"}
                label="Stato"
                onChange={(e) => handleChange("stato", e.target.value)}
              >
                <MenuItem value="pianificato">Pianificato</MenuItem>
                {corso.stato === "pianificato" && <MenuItem value="in corso">In Corso</MenuItem>}
                {corso.stato === "in corso" && <MenuItem value="chiuso">Chiuso</MenuItem>}
              </Select>
            </FormControl>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Annulla</Button>
          <Button onClick={handleSubmit} variant="contained">
            Salva
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  
  export default CorsoDialog;