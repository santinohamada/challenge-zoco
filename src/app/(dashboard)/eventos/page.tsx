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
      setFilteredEventos(data || []);
    }
    setLoading(false);
  };

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
  }, [filterCategoria, filterFechaDesde, eventos]);

  useEffect(() => {
    fetchEventos();
  }, []);

  const { showToast } = useToast();

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("eventos").delete().eq("id", id);
    if (error) {
      showToast("Error al eliminar el evento.", "error");
    } else {
      showToast("Evento eliminado correctamente.", "success");
      fetchEventos();
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[500px]">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-zinc-900 border-t-transparent"></div>
        <p className="text-sm text-zinc-500">Cargando eventos...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center min-h-[500px]">
      <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center max-w-lg">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>
        <p className="text-lg font-semibold text-red-700">Error al cargar</p>
        <p className="text-sm text-red-500 mt-2">{error}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Eventos</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Gestioná los eventos de Zoco Tucumán
          </p>
        </div>
        <Link
          href="/eventos/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-zinc-800 hover:shadow-lg active:scale-[0.98]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14"/>
            <path d="M12 5v14"/>
          </svg>
          Crear Evento
        </Link>
      </div>

      {/* Filtros */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 space-y-2">
            <label htmlFor="filter-cat" className="text-sm font-medium text-zinc-700">
              Categoría
            </label>
            <select
              id="filter-cat"
              value={filterCategoria}
              onChange={(e) => setFilterCategoria(e.target.value)}
              className="h-11 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm transition-all hover:border-zinc-300 focus:border-zinc-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900/20"
            >
              <option value="">Todas</option>
              <option value="Música">Música</option>
              <option value="Feria">Feria</option>
              <option value="Gastronomía">Gastronomía</option>
              <option value="Arte">Arte</option>
              <option value="Deportes">Deportes</option>
            </select>
          </div>
          <div className="flex-1 space-y-2">
            <label htmlFor="filter-fecha" className="text-sm font-medium text-zinc-700">
              Desde Fecha
            </label>
            <input
              id="filter-fecha"
              type="date"
              value={filterFechaDesde}
              onChange={(e) => setFilterFechaDesde(e.target.value)}
              className="h-11 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm transition-all hover:border-zinc-300 focus:border-zinc-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900/20"
            />
          </div>
          {(filterCategoria || filterFechaDesde) && (
            <div className="flex items-end">
              <button
                onClick={() => { setFilterCategoria(""); setFilterFechaDesde(""); }}
                className="h-11 px-5 text-sm font-medium text-red-600 transition-all hover:text-red-700 hover:underline"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Contador de resultados */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-500">
          Mostrando <span className="font-semibold text-zinc-900">{filteredEventos.length}</span> de <span className="font-semibold text-zinc-900">{eventos.length}</span> eventos
        </p>
      </div>

      {/* Tabla / Lista vacía */}
      {filteredEventos.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100">
            <svg className="h-8 w-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
            </svg>
          </div>
          <p className="text-lg font-semibold text-zinc-700">No hay eventos</p>
          <p className="text-sm text-zinc-500 mt-1">No se encontraron eventos con los filtros seleccionados.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
          <EventTable eventos={filteredEventos} onDelete={handleDelete} />
        </div>
      )}
    </div>
  );
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

   if (loading) return (
     <div className="flex items-center justify-center min-h-[400px]">
       <div className="flex flex-col items-center gap-4">
         <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
         <p className="text-sm text-muted-foreground">Cargando eventos...</p>
       </div>
     </div>
   );

   if (error) return (
     <div className="flex items-center justify-center min-h-[400px]">
       <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
         <p className="text-red-600 font-medium">Error al cargar</p>
         <p className="text-sm text-red-500 mt-1">{error}</p>
       </div>
     </div>
   );

   return (
     <div className="space-y-6">
       {/* Header */}
       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
         <div>
           <h1 className="text-3xl font-bold tracking-tight">Eventos</h1>
           <p className="text-sm text-muted-foreground mt-1">
             Gestioná los eventos de Zoco Tucumán
           </p>
         </div>
         <Link
           href="/eventos/new"
           className="inline-flex items-center justify-center gap-2 rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-zinc-800 hover:shadow-md active:scale-[0.98]"
         >
           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
             <path d="M5 12h14"/>
             <path d="M12 5v14"/>
           </svg>
           Crear Evento
         </Link>
       </div>

       {/* Filtros */}
       <div className="rounded-xl border bg-card p-5 shadow-sm">
         <div className="flex flex-col sm:flex-row gap-4">
           <div className="flex-1 space-y-1.5">
             <label htmlFor="filter-cat" className="text-sm font-medium text-zinc-700">
               Categoría
             </label>
             <select
               id="filter-cat"
               value={filterCategoria}
               onChange={(e) => setFilterCategoria(e.target.value)}
               className="h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm transition-colors focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/20"
             >
               <option value="">Todas</option>
               <option value="Música">Música</option>
               <option value="Feria">Feria</option>
               <option value="Gastronomía">Gastronomía</option>
               <option value="Arte">Arte</option>
               <option value="Deportes">Deportes</option>
             </select>
           </div>
           <div className="flex-1 space-y-1.5">
             <label htmlFor="filter-fecha" className="text-sm font-medium text-zinc-700">
               Desde Fecha
             </label>
             <input
               id="filter-fecha"
               type="date"
               value={filterFechaDesde}
               onChange={(e) => setFilterFechaDesde(e.target.value)}
               className="h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm transition-colors focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/20"
             />
           </div>
           {(filterCategoria || filterFechaDesde) && (
             <div className="flex items-end">
               <button
                 onClick={() => { setFilterCategoria(""); setFilterFechaDesde(""); }}
                 className="h-10 px-4 text-sm font-medium text-red-600 transition-colors hover:text-red-700 hover:underline"
               >
                 Limpiar filtros
               </button>
             </div>
           )}
         </div>
       </div>

       {/* Tabla */}
       <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
         <EventTable eventos={filteredEventos} onDelete={handleDelete} />
       </div>
     </div>
   );
}
