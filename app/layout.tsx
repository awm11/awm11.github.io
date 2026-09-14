import type { Metadata } from 'next';

import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://awm11.github.io'),
  title: 'awm physics · Simulations',
  description: 'Nine interactive physics simulations by awm11.',
  openGraph: {
    title: 'awm physics',
    description: 'Nine interactive physics simulations.',
    type: 'website',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'awm physics — interactive physics simulations.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'awm physics',
    description: 'Nine interactive physics simulations.',
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
