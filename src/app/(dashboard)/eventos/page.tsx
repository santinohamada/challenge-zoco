"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import EventTable from "@/components/eventos/EventTable";
import Link from "next/link";
import type { Evento } from "@/types/database";
import { useToast } from "@/components/ui/Toaster";

// Evitar pre-renderizado estático
export const dynamic = 'force-dynamic';

export default function EventosPage() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [filteredEventos, setFilteredEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para filtros
  const [filterCategoria, setFilterCategoria] = useState<string>("");
  const [filterFechaDesde, setFilterFechaDesde] = useState<string>("");

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
      setFilteredEventos(data || []); // Inicialmente muestra todo
    }
    setLoading(false);
  };

  // Efecto para aplicar filtros
  useEffect(() => {
    let result = eventos;

    if (filterCategoria) {
      result = result.filter(e => e.categoria === filterCategoria);
    }

    if (filterFechaDesde) {
      const fechaDesde = new Date(filterFechaDesde);
      result = result.filter(e => new Date(e.fecha_evento) >= fechaDesde);
    }

    setFilteredEventos(result);
  }, [filterCategoria, filterFechaDesde, eventos]); // Se ejecuta cuando cambian los filtros o la lista base

  useEffect(() => {
    fetchEventos();
  }, []);

  const { showToast } = useToast();

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("eventos").delete().eq("id", id);
    if (error) {
      console.error("Error deleting evento:", error);
      showToast("Error al eliminar el evento.", "error");
    } else {
      showToast("Evento eliminado correctamente.", "success");
      fetchEventos(); // Refrescar lista
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
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
        >
          Crear Evento
        </Link>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-lg border">
        <div className="flex-1">
          <label htmlFor="filter-cat" className="block text-sm font-medium text-zinc-700 mb-1">
            Categoría
          </label>
          <select
            id="filter-cat"
            value={filterCategoria}
            onChange={(e) => setFilterCategoria(e.target.value)}
            className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="">Todas</option>
            <option value="Música">Música</option>
            <option value="Feria">Feria</option>
            <option value="Gastronomía">Gastronomía</option>
            <option value="Arte">Arte</option>
            <option value="Deportes">Deportes</option>
          </select>
        </div>
        <div className="flex-1">
          <label htmlFor="filter-fecha" className="block text-sm font-medium text-zinc-700 mb-1">
            Desde Fecha
          </label>
          <input
            id="filter-fecha"
            type="date"
            value={filterFechaDesde}
            onChange={(e) => setFilterFechaDesde(e.target.value)}
            className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>
        {(filterCategoria || filterFechaDesde) && (
          <div className="flex items-end">
            <button
              onClick={() => { setFilterCategoria(""); setFilterFechaDesde(""); }}
              className="h-10 px-4 text-sm text-red-600 hover:underline"
            >
              Limpiar
            </button>
          </div>
        )}
      </div>

      <EventTable eventos={filteredEventos} onDelete={handleDelete} />
    </div>
  );
}
