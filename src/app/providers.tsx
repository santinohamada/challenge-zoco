'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { ToastProvider } from "@/components/ui/Toaster"

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minuto
          },
        }
      })
  )

  return (
    <ToastProvider>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </ToastProvider>
  )
}
