"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Evento } from "@/types/database";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

interface EventTableProps {
  eventos: Evento[];
  onDelete: (id: string) => Promise<void>;
  onEdit: (evento: Evento) => void;
}

export default function EventTable({ eventos, onDelete, onEdit }: EventTableProps) {
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => setConfirmId(id);

  const handleConfirmDelete = async () => {
    if (!confirmId) return;
    const id = confirmId;
    setConfirmId(null);
    setRemovingId(id);
    // Wait for exit animation before triggering cache invalidation
    await new Promise((r) => setTimeout(r, 350));
    await onDelete(id);
    setRemovingId(null);
  };

  if (eventos.length === 0) {
    return (
      <div className="text-center py-10 text-zinc-500 text-sm">
        No hay eventos para mostrar.
      </div>
    );
  }

  return (
    <>
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
                    <td className="p-4 px-6 align-middle font-medium text-zinc-900">
                      {evento.nombre}
                    </td>
                    <td className="p-4 px-6 align-middle text-zinc-600">{evento.lugar}</td>
                    <td className="p-4 px-6 align-middle text-zinc-600">
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
                          onClick={() => handleDeleteClick(evento.id)}
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

      <ConfirmDialog
        isOpen={!!confirmId}
        title="Eliminar evento"
        message={`¿Eliminás "${eventos.find((e) => e.id === confirmId)?.nombre}"? Esta acción no se puede deshacer.`}
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        isDestructive
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmId(null)}
      />
    </>
  );
}

// Badge con color según categoría
function CategoryBadge({ categoria }: { categoria: string }) {
  const styles: Record<string, string> = {
    Cultura: "bg-violet-100 text-violet-700",
    Nocturno: "bg-indigo-100 text-indigo-700",
    Gastronomía: "bg-amber-100 text-amber-700",
  };
  const cls = styles[categoria] ?? "bg-zinc-100 text-zinc-700";
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${cls}`}>
      {categoria}
    </span>
  );
}
