// src/app/layout.tsx
import { Chakra_Petch } from "next/font/google";
import "./globals.css";
import { GlobalProvider } from "@/components/globalvar/globalvariable";
import { ThemeProvider } from "@/components/theme-provider";

const chakra = Chakra_Petch({
  subsets: ["latin", "thai"],
  weight: ["300", "400", "500", "600", "700"],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${chakra.className} antialiased h-dvh w-dvw overflow-hidden`}>
        <GlobalProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </GlobalProvider>
      </body>
    </html>
  );
}
