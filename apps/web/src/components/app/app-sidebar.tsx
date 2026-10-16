"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Package,
  Tags,
  ArrowLeftRight,
  Users,
  FileBarChart,
  Settings,
  LogOut,
  Handshake,
  ClipboardCheck,
  ShieldCheck,
  MessageSquareWarning,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";

const menuItems = [
  {
    group: "Principal",
    items: [
      { label: "Painel", href: "/painel", icon: LayoutDashboard },
    ],
  },
  {
    group: "Patrimônio",
    items: [
      { label: "Unidades", href: "/unidades", icon: Building2 },
      { label: "Bens", href: "/bens", icon: Package },
      { label: "Categorias", href: "/categorias", icon: Tags },
      { label: "Movimentações", href: "/movimentacoes", icon: ArrowLeftRight },
      { label: "Parcerias", href: "/parcerias", icon: Handshake },
      { label: "Inventários", href: "/inventarios", icon: ClipboardCheck },
    ],
  },
  {
    group: "Administração",
    items: [
      { label: "Usuários", href: "/usuarios", icon: Users },
      { label: "Relatórios", href: "/relatorios", icon: FileBarChart },
      { label: "Auditoria", href: "/auditoria", icon: ShieldCheck },
      { label: "Configurações", href: "/configuracoes", icon: Settings },
      { label: "Chamados", href: "/chamados", icon: MessageSquareWarning },
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <Link href="/painel" className="flex items-center gap-3">
          <Image
            src="/logo_dalton.jpeg"
            alt="Instituto Dalton Salomão"
            width={40}
            height={40}
            className="rounded-lg"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-verde-escuro truncate">
              Instituto Dalton Salomão
            </p>
            <p className="text-xs text-cinza-medio">Gestão Patrimonial</p>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {menuItems.map((group) => (
          <SidebarGroup key={group.group}>
            <SidebarGroupLabel>{group.group}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = pathname.startsWith(item.href);
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        render={<Link href={item.href} />}
                        isActive={isActive}
                        tooltip={item.label}
                      >
                        <item.icon />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-verde-escuro flex items-center justify-center">
            <span className="text-xs font-bold text-white">AD</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Administrador</p>
            <p className="text-xs text-cinza-medio truncate">admin@institutodalton.org.br</p>
          </div>
          <form action="/api/logout" method="POST">
            <button
              type="submit"
              className="text-xs text-cinza-medio hover:text-vermelho transition-colors"
              title="Sair"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </form>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
