import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Scientific Calculator",
  description: "A powerful scientific calculator with Golang backend and modern interface",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen">
        {children}
      </body>
    </html>
  );
}