"use client";

import { useToast } from "@/components/ui/Toaster";

interface N8nValidationResult {
  isDuplicate: boolean;
  matchScore: number;
  reason: string;
}

interface ValidationInput {
  nombre: string;
  lugar: string;
  fecha: string;
  id?: string;
}

export function useN8nValidation() {
  const { showToast } = useToast();

  async function validate(input: ValidationInput): Promise<boolean> {
    const { nombre, lugar, fecha, id } = input;

    try {
      const webhookUrl =
        process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || "TU_URL_DE_WEBHOOK_AQUÍ";

      const body: Record<string, string> = {
        nombre,
        lugar,
        fecha,
      };
      if (id) body.id = id;

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        showToast(
          "No se pudo validar el evento con n8n (Error en la respuesta).",
          "error"
        );
        return false;
      }

      const responseData = await response.json();
      const result: N8nValidationResult = Array.isArray(responseData)
        ? responseData[0]
        : responseData;

      console.log(result);

      if (result?.isDuplicate) {
        if (result.matchScore > 85) {
          showToast(
            `Evento duplicado (${result.matchScore}%): ${result.reason}`,
            "error"
          );
          return false;
        } else if (result.matchScore >= 50 && result.matchScore <= 85) {
          showToast(
            `Aviso de posible duplicado: ${result.reason}`,
            "warning"
          );
        }
      }

      return true;
    } catch (err) {
      console.error("Error validando con n8n:", err);
      showToast("Fallo al validar con n8n. No se guardará el evento.", "error");
      return false;
    }
  }

  return { validate };
}
