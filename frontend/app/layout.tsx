import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Freight Rate Optimizer',
  description: 'Compare freight rates across ocean, air, and land transport',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
