import { getSupabaseServerClient } from "@/lib/supabase/server";
import EventEditClient from "./EventEditClient";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

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
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Editar Evento</h1>
        <p className="mt-2 text-zinc-500">
          Modificá los datos del evento seleccionado.
        </p>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <EventEditClient evento={evento} />
      </div>
    </div>
  );
}
