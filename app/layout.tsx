import type { Metadata } from 'next';

import './globals.css';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  metadataBase: new URL('https://alexmoorephysics.com'),
  title: 'Alex Moore Physics · Simulations',
  description: 'Interactive physics simulations for teachers and students, by Alex Moore.',
  icons: {
    icon: [{ url: '/favicon-a.svg', type: 'image/svg+xml' }],
    shortcut: '/favicon-a.svg',
  },
  openGraph: {
    title: 'Alex Moore Physics',
    description: 'Interactive physics simulations for teachers and students.',
    type: 'website',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'Alex Moore Physics — interactive physics simulations.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Alex Moore Physics',
    description: 'Interactive physics simulations for teachers and students.',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
