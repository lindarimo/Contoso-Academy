export enum StatoCorso {
  IN_CORSO = "in corso",
  CHIUSO = "chiuso",
  PIANIFICATO = "pianificato",
}

export interface Corso {
  id: string;
  titolo: string;
  descrizione: string;
  anno: number;
  stato: StatoCorso;
  immagine: string;
  iscritti: number;
  chiusuraData: string;
}
