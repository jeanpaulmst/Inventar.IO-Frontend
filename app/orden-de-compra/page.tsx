import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingCart, Clock, CheckCircle, AlertCircle } from "lucide-react"

export default function OrdenCompraPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      {/* Welcome Section */}
      <div className="text-center py-8">
        <h1 className="text-3xl font-bold text-slate-100 mb-2">Orden de Compra</h1>
        <p className="text-slate-400 text-lg">Gestión completa del ciclo de órdenes de compra</p>
      </div>

      {/* Stats Cards */}
      <div className="grid auto-rows-min gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Órdenes Totales</CardTitle>
            <ShoppingCart className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-100">156</div>
            <p className="text-xs text-slate-400">+8 esta semana</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Pendientes</CardTitle>
            <Clock className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-100">23</div>
            <p className="text-xs text-slate-400">Requieren atención</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Completadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-100">128</div>
            <p className="text-xs text-slate-400">82% del total</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Canceladas</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-100">5</div>
            <p className="text-xs text-slate-400">3% del total</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Area */}
      <div className="min-h-[400px] flex-1 rounded-xl bg-slate-800 border border-slate-700 p-6">
        <div className="flex flex-col items-center justify-center h-full text-center">
          <ShoppingCart className="h-16 w-16 text-slate-600 mb-4" />
          <h3 className="text-xl font-semibold text-slate-300 mb-2">Bienvenido a Orden de Compra</h3>
          <p className="text-slate-400 max-w-md">
            Seleccione una funcionalidad del menú lateral para comenzar a gestionar sus órdenes de compra.
          </p>
        </div>
      </div>
    </div>
  )
}
