import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar"

export const metadata: Metadata = {
  title: "Your App Name",
  description: "Your App Description",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body suppressHydrationWarning={true}>
      <Navbar />
      <main className="pt-16">{children}</main>
      </body>
    </html>
  );
}