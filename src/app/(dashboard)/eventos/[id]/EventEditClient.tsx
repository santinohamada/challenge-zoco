"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import EventForm from "@/components/eventos/EventForm";
import type { Evento, EventoUpdate } from "@/types/database";
import { useToast } from "@/components/ui/Toaster";

interface EventEditClientProps {
  evento: Evento;
}

export default function EventEditClient({ evento }: EventEditClientProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: EventoUpdate) => {
    setIsLoading(true);

    const { error } = await supabase
      .from("eventos")
      .update(data)
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
      router.push("/dashboard/eventos");
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
