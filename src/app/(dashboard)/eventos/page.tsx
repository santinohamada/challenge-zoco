"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import EventTable from "@/components/eventos/EventTable";
import Link from "next/link";
import type { Evento } from "@/types/database";

export default function EventosPage() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEventos = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("eventos")
      .select("*")
      .order("fecha_evento", { ascending: true });

    if (error) {
      console.error("Error fetching eventos:", error);
      setError("No se pudieron cargar los eventos.");
    } else {
      setEventos(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEventos();
  }, []);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("eventos").delete().eq("id", id);
    if (error) {
      console.error("Error deleting evento:", error);
      alert("Error al eliminar el evento.");
    } else {
      // Refrescar la lista (simple refresh)
      fetchEventos();
    }
  };

  if (loading) return <div>Cargando eventos...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Eventos</h1>
        <Link
          href="/dashboard/eventos/new"
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
        >
          Crear Evento
        </Link>
      </div>

      <EventTable eventos={eventos} onDelete={handleDelete} />
    </div>
  );
}
