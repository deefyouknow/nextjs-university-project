import { Sidebar, SidebarMobile } from "@/components/sidebar";
import { Header } from "@/components/header";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full w-full flex relative">
      {/*Sidbar Layout*/}
      <div className="shrink-0">
        <Sidebar />
        <SidebarMobile />
      </div>
      {/*Box Content*/}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto no-scrollbar px-4 pb-6">
          {children}
        </main>
      </div>
    </div>
  );
}
