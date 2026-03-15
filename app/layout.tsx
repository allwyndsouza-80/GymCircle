import type { Metadata } from 'next'
import './globals.css'
import { APP_NAME, APP_DESCRIPTION } from '@/lib/constants'
import { AppStoreHydrator } from '@/components/app-store-hydrator/app-store-hydrater'


export const metadata: Metadata = {
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body >
      <AppStoreHydrator />
        {children}
        </body>
    </html>
  )
}
