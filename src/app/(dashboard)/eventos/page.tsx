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
