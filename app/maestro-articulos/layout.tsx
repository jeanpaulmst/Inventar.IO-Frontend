"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  ArrowLeft,
  Settings,
  List,
  AlertTriangle,
  Plus,
  Edit,
  BarChart3,
  Tags,
  Search,
  Calculator,
  Package,
  Link as LinkIcon,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

const menuItems = [
  {
    title: "ABM Artículo",
    url: "/maestro-articulos/ABMArticulo",
    icon: Settings,
    description: "Administrar artículos del inventario",
    available: true,
  },
  {
    title: "ABM Modelo de Inventario",
    url: "/maestro-articulos/ABMModeloInventario",
    icon: Package,
    description: "Administrar modelos de inventario",
    available: true,
  },
  {
    title: "Artículos Proveedores",
    url: "/maestro-articulos/ListarArticuloProveedor",
    icon: LinkIcon,
    description: "Ver asignaciones de artículos a proveedores",
    available: true,
  },
  {
    title: "Listar por Proveedor",
    url: "/maestro-articulos/ListarArticulosXProveedor",
    icon: List,
    description: "Consultar artículos por proveedor",
    available: true,
  },
  {
    title: "Artículos a Reponer-Faltantes",
    url: "/maestro-articulos/ListarArticulosAReponer-Faltantes",
    icon: AlertTriangle,
    description: "Ver artículos que necesitan reposición",
    available: true,
  },
  {
    title: "Calcular CGI",
    url: "/maestro-articulos/CalcularCGI",
    icon: Calculator,
    description: "Calcular CGI de artículos",
    available: true,
  }
]

export default function MaestroArticulosLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-slate-900">
      <SidebarProvider>
        <Sidebar className="bg-slate-800 border-slate-700">
          <SidebarHeader className="border-b border-slate-700 p-4 bg-slate-800">
            <div className="flex items-center gap-3">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                <Settings className="size-4" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-semibold text-slate-100">Maestro de Artículos</span>
                <span className="text-xs text-slate-400">Gestión de inventario</span>
              </div>
            </div>
            <Link href="/" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm mt-3">
              <ArrowLeft className="w-3 h-3" />
              Volver al menú principal
            </Link>
          </SidebarHeader>

          <SidebarContent className="bg-slate-800">
            <SidebarGroup>
              <SidebarGroupLabel className="text-slate-400">Funcionalidades</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === item.url}
                        className={`${
                          !item.available
                            ? "opacity-50 cursor-not-allowed text-slate-500"
                            : "text-slate-300 hover:bg-slate-700 hover:text-slate-100 data-[active=true]:bg-blue-600 data-[active=true]:text-white"
                        }`}
                        tooltip={!item.available ? "Próximamente..." : item.description}
                      >
                        {item.available ? (
                          <Link href={item.url}>
                            <item.icon className="size-4" />
                            <span>{item.title}</span>
                          </Link>
                        ) : (
                          <div>
                            <item.icon className="size-4" />
                            <span>{item.title}</span>
                          </div>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <SidebarInset className="bg-slate-900">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b border-slate-700 px-4 bg-slate-900">
            <SidebarTrigger className="-ml-1 text-slate-400 hover:text-slate-100" />
            <Separator orientation="vertical" className="mr-2 h-4 bg-slate-600" />
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-sm">Maestro de Artículos</span>
              {pathname !== "/maestro-articulos" && (
                <>
                  <span className="text-slate-600">/</span>
                  <span className="text-slate-100 text-sm font-medium">
                    {menuItems.find((item) => item.url === pathname)?.title || "Página"}
                  </span>
                </>
              )}
            </div>
          </header>
          <div className="flex-1 bg-slate-900 text-slate-100">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}

