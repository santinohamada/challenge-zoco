import { getSupabaseServerClient } from "@/lib/supabase/server";
import EventEditClient from "./EventEditClient";
import { notFound } from "next/navigation";

interface EditEventoPageProps {
  params: { id: string };
}

export default async function EditEventoPage({ params }: EditEventoPageProps) {
  const supabase = getSupabaseServerClient();

  const { data: evento, error } = await supabase
    .from("eventos")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !evento) {
    notFound();
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Editar Evento</h1>
        <p className="text-muted-foreground">
          Modificá los datos del evento seleccionado.
        </p>
      </div>
      <EventEditClient evento={evento} />
    </div>
  );
}
