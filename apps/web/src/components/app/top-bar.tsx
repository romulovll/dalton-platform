"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";

const ROUTE_LABELS: Record<string, string> = {
  painel: "Painel",
  unidades: "Unidades",
  bens: "Bens",
  categorias: "Categorias",
  movimentacoes: "Movimentações",
  usuarios: "Usuários",
  relatorios: "Relatórios",
  configuracoes: "Configurações",
  nova: "Nova",
  novo: "Novo",
  editar: "Editar",
};

export function TopBar() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-background px-4">
      <SidebarTrigger />
      <Separator orientation="vertical" className="h-6" />

      <Breadcrumb>
        <BreadcrumbList>
          {segments.map((segment, index) => {
            const isLast = index === segments.length - 1;
            const label = ROUTE_LABELS[segment] || segment;
            const href = "/" + segments.slice(0, index + 1).join("/");

            return (
              <BreadcrumbItem key={href}>
                {index > 0 && <BreadcrumbSeparator />}
                {isLast ? (
                  <BreadcrumbPage>{label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={href}>{label}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  );
}
