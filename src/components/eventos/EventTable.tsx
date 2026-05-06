"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Evento } from "@/types/database";

interface EventTableProps {
  eventos: Evento[];
  removingId: string | null;
  onDeleteRequest: (evento: Evento) => void;
  onEdit: (evento: Evento) => void;
}

export default function EventTable({ eventos, removingId, onDeleteRequest, onEdit }: EventTableProps) {
  if (eventos.length === 0) {
    return (
      <div className="text-center py-10 text-zinc-500 text-sm">
        No hay eventos para mostrar.
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-zinc-200 bg-zinc-50/50">
            <th className="h-12 px-6 text-left align-middle font-semibold text-zinc-600">Nombre</th>
            <th className="h-12 px-6 text-left align-middle font-semibold text-zinc-600">Lugar</th>
            <th className="h-12 px-6 text-left align-middle font-semibold text-zinc-600">Fecha</th>
            <th className="h-12 px-6 text-left align-middle font-semibold text-zinc-600">Categoría</th>
            <th className="h-12 px-6 text-right align-middle font-semibold text-zinc-600">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence initial={false}>
            {eventos.map((evento, index) => {
              const isRemoving = removingId === evento.id;
              return (
                <motion.tr
                  key={evento.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={
                    isRemoving
                      ? { opacity: 0, x: -60, backgroundColor: "#fef2f2" }
                      : { opacity: 1, y: 0 }
                  }
                  exit={{ opacity: 0, x: -60, height: 0 }}
                  transition={
                    isRemoving
                      ? { duration: 0.3, ease: "easeInOut" }
                      : { duration: 0.25, delay: index * 0.04 }
                  }
                  className={`border-b border-zinc-100 transition-colors ${
                    isRemoving
                      ? "bg-red-50"
                      : index % 2 === 0
                      ? "bg-white hover:bg-zinc-50/80"
                      : "bg-zinc-50/30 hover:bg-zinc-100/50"
                  }`}
                >
                  {/* Nombre + descripción */}
                  <td className="p-4 px-6 align-middle">
                    <p className="font-medium text-zinc-900 leading-snug">{evento.nombre}</p>
                    {evento.descripcion && (
                      <p className="mt-0.5 text-xs text-zinc-400 leading-snug line-clamp-2 max-w-xs">
                        {evento.descripcion}
                      </p>
                    )}
                  </td>
                  <td className="p-4 px-6 align-middle text-zinc-600">{evento.lugar}</td>
                  <td className="p-4 px-6 align-middle text-zinc-600 whitespace-nowrap">
                    {new Date(evento.fecha_evento).toLocaleDateString("es-AR", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="p-4 px-6 align-middle">
                    {evento.categoria ? (
                      <CategoryBadge categoria={evento.categoria} />
                    ) : (
                      <span className="text-zinc-400">—</span>
                    )}
                  </td>
                  <td className="p-4 px-6 align-middle text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onEdit(evento)}
                        disabled={isRemoving}
                        className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-zinc-700 transition-all hover:bg-zinc-100 hover:text-zinc-900 disabled:opacity-40"
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                        </svg>
                        Editar
                      </button>
                      <button
                        onClick={() => onDeleteRequest(evento)}
                        disabled={isRemoving}
                        className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-red-500 transition-all hover:bg-red-50 hover:text-red-700 disabled:opacity-40"
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                        </svg>
                        {isRemoving ? "Eliminando..." : "Eliminar"}
                      </button>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
}

function CategoryBadge({ categoria }: { categoria: string }) {
  const styles: Record<string, string> = {
    CULTURA: "bg-violet-100 text-violet-700",
    NOCTURNO: "bg-indigo-100 text-indigo-700",
    GASTRONOMÍA: "bg-amber-100 text-amber-700",
  };
  const cls = styles[categoria] ?? "bg-zinc-100 text-zinc-700";
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${cls}`}>
      {categoria}
    </span>
  );
}
