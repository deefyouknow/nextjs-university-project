import "@/app/globals.css";
import { GlobalProvider } from "@/components/globalvar/globalvariable";
import { Sidebar, SidebarMobile } from "@/components/sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <GlobalProvider>
      <ThemeProvider>
        <div className="h-dvh w-dvw flex relative">
          <div>
            <Sidebar />
            <SidebarMobile />
          </div>
          <div className="md:pl-10 flex flex-col h-full w-full overflow-y-scroll overscroll-none">
            <Header />
            <div className="px-4 h-full w-full">
              {children}
            </div>
          </div>
        </div>
      </ThemeProvider>
    </GlobalProvider>
  );
}
