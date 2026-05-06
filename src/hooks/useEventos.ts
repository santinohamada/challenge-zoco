"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";
import type { Evento, EventoInsert } from "@/types/database";

const EVENTOS_KEY = ["eventos"] as const;

async function fetchEventos(): Promise<Evento[]> {
  const { data, error } = await supabase
    .from("eventos")
    .select("*")
    .order("fecha_evento", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

async function fetchEvento(id: string): Promise<Evento> {
  const { data, error } = await supabase
    .from("eventos")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

async function createEvento(evento: EventoInsert): Promise<Evento> {
  // Verificar si ya existe
  if (evento.fingerprint) {
    const { data: existing } = await supabase
      .from("eventos")
      .select("id")
      .eq("fingerprint", evento.fingerprint)
      .maybeSingle();

    if (existing) {
      throw new Error("El evento ya existe.");
    }
  }

  const { data, error } = await supabase
    .from("eventos")
    .insert([evento])
    .select()
    .single();

  if (error) throw error;
  return data;
}

async function updateEvento({
  id,
  ...data
}: EventoInsert & { id: string }): Promise<Evento> {
  const { data: updated, error } = await supabase
    .from("eventos")
    .update(data)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return updated;
}

async function deleteEvento(id: string): Promise<void> {
  const { error } = await supabase.from("eventos").delete().eq("id", id);
  if (error) throw error;
}

// --- Hooks ---

export function useEventos() {
  return useQuery({
    queryKey: EVENTOS_KEY,
    queryFn: fetchEventos,
  });
}

export function useEvento(id: string) {
  return useQuery({
    queryKey: [...EVENTOS_KEY, id],
    queryFn: () => fetchEvento(id),
    enabled: !!id,
  });
}

export function useCreateEvento() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createEvento,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EVENTOS_KEY });
    },
  });
}

export function useUpdateEvento() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateEvento,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: EVENTOS_KEY });
      queryClient.invalidateQueries({
        queryKey: [...EVENTOS_KEY, variables.id],
      });
    },
  });
}

export function useDeleteEvento() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteEvento,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EVENTOS_KEY });
    },
  });
}
