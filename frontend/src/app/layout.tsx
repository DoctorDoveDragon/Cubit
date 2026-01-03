import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cubit — Code-first Designer Scaffold",
  description: "A code-first canvas for designers and developers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
