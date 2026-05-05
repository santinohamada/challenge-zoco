import { getSupabaseServerClient } from "@/lib/supabase/server";
import EventTable from "@/components/eventos/EventTable";
import Link from "next/link";

export default async function EventosPage() {
  const supabase = getSupabaseServerClient();

  const { data: eventos, error } = await supabase
    .from("eventos")
    .select("*")
    .order("fecha_evento", { ascending: true });

  if (error) {
    console.error("Error fetching eventos:", error);
    // En producción, usarías un componente de error handling
    return <div>Error al cargar los eventos</div>;
  }

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

      <EventTable eventos={eventos || []} />
    </div>
  );
}
