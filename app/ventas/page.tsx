import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Plus, List, Users, BarChart3, FileText, DollarSign } from "lucide-react"

export default function VentasPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <div className="container mx-auto py-8 px-4">
        {/* Header with back button */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Volver al menú principal
          </Link>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-slate-100 mb-4">Ventas</h1>
            <p className="text-slate-400 text-lg">Módulo de ventas y gestión comercial</p>
          </div>
        </div>

        {/* Functionality Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Generar Venta - Funcionalidad principal disponible */}
          <Card className="bg-slate-800 border-slate-700 shadow-xl opacity-60">
            <CardHeader className="bg-gradient-to-r from-slate-700 to-slate-800 rounded-t-lg">
              <CardTitle className="text-xl text-slate-300 flex items-center gap-3">
                <Plus className="w-6 h-6 text-slate-400" />
                Generar Venta
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-slate-400">Registra nuevas ventas con productos, cantidades y clientes.</p>
              <div className="mt-4 flex items-center text-slate-500 text-sm">Próximamente...</div>
            </CardContent>
          </Card>

          {/* Historial de Ventas */}
          <Card className="bg-slate-800 border-slate-700 shadow-xl opacity-60">
            <CardHeader className="bg-gradient-to-r from-slate-700 to-slate-800 rounded-t-lg">
              <CardTitle className="text-xl text-slate-300 flex items-center gap-3">
                <List className="w-6 h-6 text-slate-400" />
                Historial de Ventas
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-slate-400">Consulta el historial completo de todas las ventas realizadas.</p>
              <div className="mt-4 flex items-center text-slate-500 text-sm">Próximamente...</div>
            </CardContent>
          </Card>

          {/* Gestión de Clientes */}
          <Card className="bg-slate-800 border-slate-700 shadow-xl opacity-60">
            <CardHeader className="bg-gradient-to-r from-slate-700 to-slate-800 rounded-t-lg">
              <CardTitle className="text-xl text-slate-300 flex items-center gap-3">
                <Users className="w-6 h-6 text-slate-400" />
                Gestión de Clientes
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-slate-400">Administra la información de clientes y sus datos de contacto.</p>
              <div className="mt-4 flex items-center text-slate-500 text-sm">Próximamente...</div>
            </CardContent>
          </Card>

          {/* Reportes de Ventas */}
          <Card className="bg-slate-800 border-slate-700 shadow-xl opacity-60">
            <CardHeader className="bg-gradient-to-r from-slate-700 to-slate-800 rounded-t-lg">
              <CardTitle className="text-xl text-slate-300 flex items-center gap-3">
                <BarChart3 className="w-6 h-6 text-slate-400" />
                Reportes de Ventas
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-slate-400">Genera reportes detallados de ventas por período y producto.</p>
              <div className="mt-4 flex items-center text-slate-500 text-sm">Próximamente...</div>
            </CardContent>
          </Card>

          {/* Facturación */}
          <Card className="bg-slate-800 border-slate-700 shadow-xl opacity-60">
            <CardHeader className="bg-gradient-to-r from-slate-700 to-slate-800 rounded-t-lg">
              <CardTitle className="text-xl text-slate-300 flex items-center gap-3">
                <FileText className="w-6 h-6 text-slate-400" />
                Facturación
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-slate-400">Genera facturas y comprobantes de venta automáticamente.</p>
              <div className="mt-4 flex items-center text-slate-500 text-sm">Próximamente...</div>
            </CardContent>
          </Card>

          {/* Control de Ingresos */}
          <Card className="bg-slate-800 border-slate-700 shadow-xl opacity-60">
            <CardHeader className="bg-gradient-to-r from-slate-700 to-slate-800 rounded-t-lg">
              <CardTitle className="text-xl text-slate-300 flex items-center gap-3">
                <DollarSign className="w-6 h-6 text-slate-400" />
                Control de Ingresos
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-slate-400">Monitorea los ingresos y análisis financiero de las ventas.</p>
              <div className="mt-4 flex items-center text-slate-500 text-sm">Próximamente...</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
