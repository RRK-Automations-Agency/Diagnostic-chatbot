import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Asha Jyothi Diagnostic Centre | Reliable Diagnostics in Toopran",
  description:
    "Asha Jyothi Diagnostic Centre in Toopran, Telangana offers reliable diagnostic testing services including blood tests, pathology, health checkups, and home sample collection.",
  openGraph: {
    title: "Asha Jyothi Diagnostic Centre | Reliable Diagnostics in Toopran",
    description:
      "Reliable diagnostic testing services in Toopran, Telangana. Blood tests, pathology, health checkups, and home sample collection.",
    type: "website",
    locale: "en_IN",
    siteName: "Asha Jyothi Diagnostic Centre",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="font-sans" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
