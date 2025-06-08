import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Plus, List, Edit, X, CheckCircle, Clock, Settings } from "lucide-react"

export default function OrdenCompraPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <div className="container mx-auto py-8 px-4">
        {/* Header with back button */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Volver al menú principal
          </Link>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-slate-100 mb-4">Orden de Compra</h1>
            <p className="text-slate-400 text-lg">Gestión completa del ciclo de órdenes de compra</p>
          </div>
        </div>

        {/* Functionality Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* ABM Estado Orden de Compra */}
          <Link href="/orden-de-compra/ABMEstadoOrdenCompra" className="group">
            <Card className="bg-slate-800 border-slate-700 shadow-xl hover:shadow-2xl transition-all duration-300 group-hover:scale-105 cursor-pointer">
              <CardHeader className="bg-gradient-to-r from-purple-900 to-slate-800 rounded-t-lg">
                <CardTitle className="text-xl text-purple-100 flex items-center gap-3">
                  <Settings className="w-6 h-6 text-purple-400" />
                  ABM Estado Orden
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-slate-300">
                  Administra los estados posibles para las órdenes de compra en el sistema.
                </p>
                <div className="mt-4 flex items-center text-purple-400 text-sm font-medium">Acceder →</div>
              </CardContent>
            </Card>
          </Link>

          {/* Generar Orden de Compra */}
          <Card className="bg-slate-800 border-slate-700 shadow-xl opacity-60">
            <CardHeader className="bg-gradient-to-r from-slate-700 to-slate-800 rounded-t-lg">
              <CardTitle className="text-xl text-slate-300 flex items-center gap-3">
                <Plus className="w-6 h-6 text-slate-400" />
                Generar Orden
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-slate-400">Crea nuevas órdenes de compra con productos y proveedores.</p>
              <div className="mt-4 flex items-center text-slate-500 text-sm">Próximamente...</div>
            </CardContent>
          </Card>

          {/* Listar Órdenes */}
          <Card className="bg-slate-800 border-slate-700 shadow-xl opacity-60">
            <CardHeader className="bg-gradient-to-r from-slate-700 to-slate-800 rounded-t-lg">
              <CardTitle className="text-xl text-slate-300 flex items-center gap-3">
                <List className="w-6 h-6 text-slate-400" />
                Listar Órdenes
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-slate-400">Consulta todas las órdenes de compra con sus estados actuales.</p>
              <div className="mt-4 flex items-center text-slate-500 text-sm">Próximamente...</div>
            </CardContent>
          </Card>

          {/* Modificar Orden */}
          <Card className="bg-slate-800 border-slate-700 shadow-xl opacity-60">
            <CardHeader className="bg-gradient-to-r from-slate-700 to-slate-800 rounded-t-lg">
              <CardTitle className="text-xl text-slate-300 flex items-center gap-3">
                <Edit className="w-6 h-6 text-slate-400" />
                Modificar Orden
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-slate-400">Edita órdenes de compra existentes antes de su confirmación.</p>
              <div className="mt-4 flex items-center text-slate-500 text-sm">Próximamente...</div>
            </CardContent>
          </Card>

          {/* Cancelar Orden */}
          <Card className="bg-slate-800 border-slate-700 shadow-xl opacity-60">
            <CardHeader className="bg-gradient-to-r from-slate-700 to-slate-800 rounded-t-lg">
              <CardTitle className="text-xl text-slate-300 flex items-center gap-3">
                <X className="w-6 h-6 text-slate-400" />
                Cancelar Orden
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-slate-400">Cancela órdenes de compra y actualiza su estado.</p>
              <div className="mt-4 flex items-center text-slate-500 text-sm">Próximamente...</div>
            </CardContent>
          </Card>

          {/* Gestión de Estados */}
          <Card className="bg-slate-800 border-slate-700 shadow-xl opacity-60">
            <CardHeader className="bg-gradient-to-r from-slate-700 to-slate-800 rounded-t-lg">
              <CardTitle className="text-xl text-slate-300 flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-slate-400" />
                Gestión de Estados
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-slate-400">Administra los estados de las órdenes (pendiente, confirmada, recibida).</p>
              <div className="mt-4 flex items-center text-slate-500 text-sm">Próximamente...</div>
            </CardContent>
          </Card>

          {/* Seguimiento */}
          <Card className="bg-slate-800 border-slate-700 shadow-xl opacity-60">
            <CardHeader className="bg-gradient-to-r from-slate-700 to-slate-800 rounded-t-lg">
              <CardTitle className="text-xl text-slate-300 flex items-center gap-3">
                <Clock className="w-6 h-6 text-slate-400" />
                Seguimiento
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-slate-400">Realiza seguimiento detallado del progreso de las órdenes.</p>
              <div className="mt-4 flex items-center text-slate-500 text-sm">Próximamente...</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
