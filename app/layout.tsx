import "./globals.css";
import Link from "next/link";
import type { ReactNode } from "react";

export const metadata = { title: "Req Desk", description: "Recruiter requisitions, job descriptions and notes" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="bar">
          <Link href="/" className="brand">Req Desk</Link>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
