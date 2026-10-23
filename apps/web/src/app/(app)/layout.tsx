import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app/app-sidebar";
import { TopBar } from "@/components/app/top-bar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getSession } from "@/lib/auth";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar user={{ nome: session?.nome || "Usuário", email: session?.email || "", perfil: (session?.perfil as string) || "CONSULTA" }} />
        <SidebarInset>
          <TopBar />
          <main className="flex-1 p-4 sm:p-6 overflow-x-auto min-w-0">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
