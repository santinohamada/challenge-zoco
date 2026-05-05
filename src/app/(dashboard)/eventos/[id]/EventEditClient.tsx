"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import EventForm from "@/components/eventos/EventForm";
import type { Evento, EventoUpdate } from "@/types/database";

interface EventEditClientProps {
  evento: Evento;
}

export default function EventEditClient({ evento }: EventEditClientProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: EventoUpdate) => {
    setIsLoading(true);
    setError(null);

    const { error } = await supabase
      .from("eventos")
      .update(data)
      .eq("id", evento.id)
      .select()
      .single();

    setIsLoading(false);

    if (error) {
      console.error("Error updating evento:", error);
      setError("Error al actualizar el evento. Intentalo de nuevo.");
      return;
    }

    router.push("/dashboard/eventos");
    router.refresh();
  };

  return (
    <>
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-4">
          {error}
        </div>
      )}
      <EventForm
        initialData={evento}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </>
  );
}
