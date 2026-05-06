"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import EventForm from "@/components/eventos/EventForm";
import type { Evento, EventoInsert } from "@/types/database";
import { useToast } from "@/components/ui/Toaster";

interface EventEditClientProps {
  evento: Evento;
}

export default function EventEditClient({ evento }: EventEditClientProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: EventoInsert) => {
    setIsLoading(true);

    // En la edición, el ID ya lo tenemos, se lo agregamos a la data que viene del form
    const updateData = { ...data, id: evento.id };

    const { error } = await supabase
      .from("eventos")
      .update(updateData)
      .eq("id", evento.id)
      .select()
      .single();

    setIsLoading(false);

    if (error) {
      console.error("Error updating evento:", error);
      showToast("Error al actualizar el evento.", "error");
      return;
    }

    showToast("Evento actualizado correctamente!", "success");
    setTimeout(() => {
      router.push("/eventos");
      router.refresh();
    }, 1000);
  };

  return (
    <EventForm
      initialData={evento}
      onSubmit={handleSubmit}
      isLoading={isLoading}
    />
  );
}
