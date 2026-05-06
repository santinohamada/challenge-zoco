# Zoco Tucumán

Plataforma para descubrir y gestionar eventos y bares en Tucumán, Argentina.

## Stack

- **Framework**: Next.js 16 (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS v4 + PostCSS
- **Backend**: Supabase (PostgreSQL + RLS + API automática)
- **Data Fetching**: TanStack React Query (cliente) + Server Components (servidor)
- **Runtime**: Node.js

## Estructura

```
src/
├── app/
│   ├── (dashboard)/eventos/   # CRUD de eventos (dashboard)
│   │   ├── page.tsx            # Lista con filtros
│   │   ├── new/page.tsx        # Crear evento
│   │   └── [id]/page.tsx       # Editar evento
│   ├── page.tsx                # Home (ISR, lista pública)
│   ├── layout.tsx              # Root layout + metadatos
│   ├── providers.tsx           # React Query + Toast provider
│   └── globals.css
├── components/
│   ├── eventos/                # EventForm, EventTable
│   └── ui/                     # ConfirmDialog, Toaster
├── lib/
│   └── supabase/
│       ├── client.ts           # Supabase browser client
│       └── server.ts           # Supabase server client
└── types/
    └── database.ts             # Tipos TypeScript (Evento, EventoInsert, EventoUpdate)
```

## Características

- **Home Pública**: Lista próximos eventos con ISR (revalidación cada 60s)
- **Dashboard**: Gestión completa de eventos (CRUD) con filtros por categoría y fecha
- **Supabase**: Tabla `eventos` con RLS habilitado y políticas permisivas (demo)
- **Fingerprint**: Campo único para evitar duplicados (integrable con n8n)
- **Categorías**: Música, Feria, Gastronomía, Arte, Deportes

## Supabase Setup

Ejecutá el script `supabase-setup.sql` en el SQL Editor de tu proyecto Supabase. Crea la tabla, habilita RLS y define las políticas de acceso.

## Variables de Entorno

Crear `.env.local` con:

```
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
```

## Scripts

```bash
npm run dev      # Servidor de desarrollo (localhost:3000)
npm run build    # Build de producción
npm run start    # Servidor de producción
npm run lint     # ESLint
```

## Convenciones

- Conventional Commits para los mensajes de commit
- Server Components por defecto, `'use client'` solo donde se requiere interactividad
- Tipos centralizados en `src/types/database.ts`

## Criterio Técnico (Parte 5)

### ¿Cómo evitás duplicados?
Utilizamos una estrategia de **doble verificación**:
1. **Fingerprint**: En el flujo de n8n, se genera un hash único combinando `nombre-lugar-fecha`. Este valor se guarda en el campo `fingerprint` de la tabla `eventos`.
2. **Upsert en Supabase**: El nodo HTTP Request usa el header `Prefer: resolution=merge-duplicates` con `on_conflict: "fingerprint"`. Si el evento ya existe (mismo fingerprint), Supabase lo **actualiza** automáticamente en lugar de crear un duplicado.

### ¿Cómo escalarías este sistema?
- **Múltiples fuentes**: Separar el scraping en diferentes nodos de HTTP Request (ej. La Gaceta, Instagram, Facebook Events) y unificar los datos usando el mismo esquema de IA.
- **Colas de procesamiento**: Para no saturar la IA, implementar una cola (Redis/Bull) donde se acumulan los eventos scrappeados y se procesan de a poco.
- **Particionamiento de BD**: En Supabase, particionar la tabla `eventos` por fecha para mantener rendimiento de consultas a largo plazo.

### ¿Qué problemas puede tener este flujo?
- **Cambios en el DOM**: Si `agenda.eltucumano.com` cambia su estructura HTML, el nodo `extractHtmlContent` fallará. *Solución*: Implementar un nodo de "Error Trigger" que notifique vía Slack/Telegram ante fallos.
- **Rate Limiting**: Hacer demasiadas peticiones puede bloquear la IP. *Solución*: El Schedule Trigger está configurado para ejecutar en horarios de baja carga, y se pueden agregar delays entre peticiones.
- **Consistencia de la IA**: La IA podría clasificar distinto el mismo evento en diferentes ejecuciones. *Solución*: Usar `temperature: 0` en Groq y validar la salida con un esquema estricto (JSON Schema).

### ¿Cómo mejorarías la calidad de los datos?
- **Validación de coordenadas**: Usar una API de Geocoding (Google Maps/Mapbox) para convertir el campo `lugar` en coordenadas `lat/lng` y validar que exista.
- **Normalización de datos**: El paso de "Post-procesamiento" en n8n normaliza las fechas a ISO 8601, pero se podría agregar validación de emails/teléfonos si se agregan en el futuro.
- **Sistema de aprobación**: Implementar un flujo donde eventos con `confidence_score < 0.8` requieran revisión manual antes de publicarse en el frontend.

## Flujo de Automatización (n8n)

1. **Schedule Trigger**: Ejecución programada (cumple Parte 3 - Automatización).
2. **HTTP Request**: Scraping a `agenda.eltucumano.com` (Parte 1 - Obtención de datos).
3. **HTML Extraction**: Selectores CSS (`h1.entry-title`) para extraer campos específicos.
4. **Code (JavaScript)**: Generación de `fingerprint` único por evento.
5. **Basic LLM Chain + Groq**: Enriquecimiento con IA usando Llama 3 (Parte 4 - Uso de IA):
   - Clasificación de eventos (`CULTURA`, `NOCTURNO`, etc.)
   - Generación de descripciones que el sitio original no provee
6. **Post-procesamiento**: Normalización de fechas a formato ISO.
7. **HTTP Request (POST to Supabase)**: Persistencia con **Upsert** usando `fingerprint` como llave de conflicto (Parte 2 - CRUD).
