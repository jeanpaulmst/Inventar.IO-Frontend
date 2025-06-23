import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Users, ShoppingCart, TrendingUp } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-slate-100 mb-4">Sistema de Inventarios</h1>
          <p className="text-slate-400 text-lg">Seleccione un módulo para continuar</p>
        </div>

        {/* Main Module Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Maestro de Artículos */}
          <Link href="/maestro-articulos" className="group">
            <Card className="bg-slate-800 border-slate-700 shadow-xl hover:shadow-2xl transition-all duration-300 group-hover:scale-105 cursor-pointer h-full">
              <CardHeader className="bg-gradient-to-r from-blue-900 to-slate-800 rounded-t-lg">
                <CardTitle className="text-2xl text-blue-100 flex items-center gap-3">
                  <Package className="w-8 h-8 text-blue-400" />
                  Maestro de Artículos
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-slate-300 mb-4">
                  Gestión completa del inventario de artículos de la empresa. Administra productos, stock, precios y
                  categorías.
                </p>
                <div className="space-y-2 text-sm text-slate-400">
                </div>
                <div className="mt-6 flex items-center text-blue-400 text-sm font-medium">Acceder al módulo →</div>
              </CardContent>
            </Card>
          </Link>

          {/* Proveedores */}
          <Link href="/proveedores" className="group">
            <Card className="bg-slate-800 border-slate-700 shadow-xl hover:shadow-2xl transition-all duration-300 group-hover:scale-105 cursor-pointer h-full">
              <CardHeader className="bg-gradient-to-r from-green-900 to-slate-800 rounded-t-lg">
                <CardTitle className="text-2xl text-green-100 flex items-center gap-3">
                  <Users className="w-8 h-8 text-green-400" />
                  Proveedores
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-slate-300 mb-4">
                  Administración completa de proveedores y sus relaciones comerciales con la empresa.
                </p>
                <div className="space-y-2 text-sm text-slate-400">
                </div>
                <div className="mt-6 flex items-center text-green-400 text-sm font-medium">Acceder al módulo →</div>
              </CardContent>
            </Card>
          </Link>

          {/* Orden de Compra */}
          <Link href="/orden-de-compra" className="group">
            <Card className="bg-slate-800 border-slate-700 shadow-xl hover:shadow-2xl transition-all duration-300 group-hover:scale-105 cursor-pointer h-full">
              <CardHeader className="bg-gradient-to-r from-purple-900 to-slate-800 rounded-t-lg">
                <CardTitle className="text-2xl text-purple-100 flex items-center gap-3">
                  <ShoppingCart className="w-8 h-8 text-purple-400" />
                  Orden de Compra
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-slate-300 mb-4">
                  Gestión completa del ciclo de órdenes de compra, desde la generación hasta el seguimiento.
                </p>
                <div className="space-y-2 text-sm text-slate-400">
                </div>
                <div className="mt-6 flex items-center text-purple-400 text-sm font-medium">Acceder al módulo →</div>
              </CardContent>
            </Card>
          </Link>

          {/* Ventas */}
          <Link href="/ventas" className="group">
            <Card className="bg-slate-800 border-slate-700 shadow-xl hover:shadow-2xl transition-all duration-300 group-hover:scale-105 cursor-pointer h-full">
              <CardHeader className="bg-gradient-to-r from-orange-900 to-slate-800 rounded-t-lg">
                <CardTitle className="text-2xl text-orange-100 flex items-center gap-3">
                  <TrendingUp className="w-8 h-8 text-orange-400" />
                  Ventas
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-slate-300 mb-4">
                  Módulo de ventas para la generación y gestión de transacciones comerciales.
                </p>
                <div className="space-y-2 text-sm text-slate-400">
                </div>
                <div className="mt-6 flex items-center text-orange-400 text-sm font-medium">Acceder al módulo →</div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Footer info */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-full border border-slate-700">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-slate-300 text-sm">Sistema activo - 4 módulos disponibles</span>
          </div>
        </div>
      </div>
    </div>
  )
}
