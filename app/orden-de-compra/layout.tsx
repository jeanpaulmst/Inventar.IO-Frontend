"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ArrowLeft, ShoppingCart, Settings, Plus, List, Edit, X, CheckCircle, Clock, Cog } from "lucide-react"
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
    title: "ABM Estado Orden",
    url: "/orden-de-compra/ABMEstadoOrdenCompra",
    icon: Settings,
    description: "Administrar estados de órdenes",
    available: true,
  },
  {
    title: "Gestión de Ordenes",
    url: "/orden-de-compra/GestionDeOrdenes",
    icon: Cog,
    description: "Gestionar órdenes pendientes",
    available: true,
  },
  {
    title: "Listar Órdenes",
    url: "/orden-compra/listar",
    icon: List,
    description: "Ver todas las órdenes de compra",
    available: false,
  },
  {
    title: "Modificar Orden",
    url: "/orden-compra/modificar",
    icon: Edit,
    description: "Editar órdenes existentes",
    available: false,
  },
  {
    title: "Cancelar Orden",
    url: "/orden-compra/cancelar",
    icon: X,
    description: "Cancelar órdenes de compra",
    available: false,
  },
  {
    title: "Gestión de Estados",
    url: "/orden-compra/estados",
    icon: CheckCircle,
    description: "Administrar estados de órdenes",
    available: false,
  },
  {
    title: "Seguimiento",
    url: "/orden-compra/seguimiento",
    icon: Clock,
    description: "Seguimiento de órdenes",
    available: false,
  },
]

export default function OrdenCompraLayout({
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
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-purple-600 text-white">
                <ShoppingCart className="size-4" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-semibold text-slate-100">Orden de Compra</span>
                <span className="text-xs text-slate-400">Gestión de compras</span>
              </div>
            </div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 text-sm mt-3"
            >
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
                            : "text-slate-300 hover:bg-slate-700 hover:text-slate-100 data-[active=true]:bg-purple-600 data-[active=true]:text-white"
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
              <span className="text-slate-400 text-sm">Orden de Compra</span>
              {pathname !== "/orden-compra" && (
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
