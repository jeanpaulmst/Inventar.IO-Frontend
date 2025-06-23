import { Package } from "lucide-react"

export default function MaestroArticulosPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      {/* Welcome Section */}
      <div className="text-center py-8">
        <h1 className="text-3xl font-bold text-slate-100 mb-2">Maestro de Artículos</h1>
        <p className="text-slate-400 text-lg">Gestión completa del inventario de artículos</p>
      </div>

      {/* Main Content Area */}
      <div className="min-h-[400px] flex-1 rounded-xl bg-slate-800 border border-slate-700 p-6">
        <div className="flex flex-col items-center justify-center h-full text-center">
          <Package className="h-16 w-16 text-slate-600 mb-4" />
          <h3 className="text-xl font-semibold text-slate-300 mb-2">Bienvenido al Maestro de Artículos</h3>
          <p className="text-slate-400 max-w-md">
            Seleccione una funcionalidad del menú lateral para comenzar a gestionar su inventario de artículos.
          </p>
        </div>
      </div>
    </div>
  )
}
