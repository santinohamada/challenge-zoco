"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Evento, EventoInsert } from "@/types/database";
import EventForm from "@/components/eventos/EventForm";

interface EventModalProps {
  isOpen: boolean;
  mode: "create" | "edit";
  evento?: Evento;
  isLoading?: boolean;
  onSubmit: (data: EventoInsert) => void;
  onClose: () => void;
}

export default function EventModal({
  isOpen,
  mode,
  evento,
  isLoading = false,
  onSubmit,
  onClose,
}: EventModalProps) {
  const title = mode === "create" ? "Crear Evento" : "Editar Evento";
  const submitLabel = mode === "create" ? "Crear Evento" : "Guardar Cambios";

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isLoading, onClose]);

  // Prevent body scroll while open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => !isLoading && onClose()}
          />

          {/* Dialog */}
          <motion.div
            key="modal"
            className="relative z-50 w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4">
              <h2 className="text-lg font-bold text-zinc-900">{title}</h2>
              <button
                onClick={() => !isLoading && onClose()}
                disabled={isLoading}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 disabled:opacity-40"
                aria-label="Cerrar"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 max-h-[70vh] overflow-y-auto">
              <EventForm
                key={evento?.id ?? "new"}
                initialData={evento}
                onSubmit={onSubmit}
                isLoading={isLoading}
              />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-zinc-100 bg-zinc-50/50 px-6 py-4">
              <button
                type="button"
                onClick={() => !isLoading && onClose()}
                disabled={isLoading}
                className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-5 py-2.5 text-sm font-medium text-zinc-700 shadow-sm transition-all hover:bg-zinc-50 hover:border-zinc-300 active:scale-[0.98] disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={isLoading}
                onClick={() => {
                  // Trigger the hidden submit in EventForm
                  document.getElementById("event-form-submit")?.click();
                }}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-zinc-800 hover:shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Guardando...
                  </>
                ) : submitLabel}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
