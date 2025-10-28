import './globals.css'
import { Inter } from 'next/font/google'
import { TRPCProvider } from '@/components/providers/TRPCProvider'
import AuthProvider from '@/components/providers/AuthProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'TriClub Argentina - Plataforma de Triatlón',
  description: 'Plataforma gamificada para clubes de triatlón en Argentina',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AuthProvider>
          <TRPCProvider>
            {children}
          </TRPCProvider>
        </AuthProvider>
      </body>
    </html>
  )
}