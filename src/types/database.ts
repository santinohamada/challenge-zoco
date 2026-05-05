export interface Evento {
  id: string;
  nombre: string;
  lugar: string;
  categoria: string | null;
  fecha_evento: string;
  fingerprint: string;
  fuente: string | null;
  created_at: string;
  updated_at: string;
}

export type EventoInsert = Omit<Evento, 'id' | 'created_at' | 'updated_at'>;
export type EventoUpdate = Partial<EventoInsert> & { id: string };
