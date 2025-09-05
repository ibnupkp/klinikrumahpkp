import './globals.css';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'Konsultasi Desain Rumah',
  description: 'Monorepo web',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
