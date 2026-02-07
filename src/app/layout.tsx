import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import ClientShell from "@/components/ClientShell";

// تنظیمات فونت وزیرمتن (دانلود خودکار از گوگل)
const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazirmatn",
  display: "swap",
});

export const metadata: Metadata = {
  title: "راوی | پلتفرم هوشمند هم‌نشینی",
  description: "با هوش مصنوعی هم‌نشین خود را پیدا کنید",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body
        className={`${vazirmatn.variable} antialiased bg-white text-slate-900 font-sans`}
      >
        <AppProvider>
          <ClientShell>{children}</ClientShell>
        </AppProvider>
      </body>
    </html>
  );
}
