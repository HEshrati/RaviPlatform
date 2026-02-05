import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Vazirmatn } from "next/font/google"; // <--- ایمپورت فونت وزیر
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import ClientShell from "@/components/ClientShell";

// تنظیمات فونت وزیرمتن (دانلود خودکار از گوگل)
const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazirmatn", // نام متغیر برای استفاده در CSS
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
        // اضافه کردن کلاس متغیر وزیرمتن به بادی
        className={`${geistSans.variable} ${geistMono.variable} ${vazirmatn.variable} antialiased bg-white text-slate-900 font-sans`}
      >
        <AppProvider>
          <ClientShell>{children}</ClientShell>
        </AppProvider>
      </body>
    </html>
  );
}
