import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import ClientLayout from "./ClientLayout";

const vazirmatn = localFont({
  src: "./fonts/Vazirmatn-Regular.woff2",
  variable: "--font-vazirmatn",
  display: "swap",
});

export const metadata: Metadata = {
  title: "راوی - پلتفرم هوشمند یافتن دوست",
  description: "با راوی به جامعه‌ای از افراد می‌پیوندید که به دنبال روابط معنادار هستند",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" className={vazirmatn.variable}>
      <body className="font-sans antialiased" style={{ background: "#fff", minHeight: "100vh" }}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
