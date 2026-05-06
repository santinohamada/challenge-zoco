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
