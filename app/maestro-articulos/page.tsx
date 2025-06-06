import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, List, Plus, Edit, BarChart3, Tags, Search } from "lucide-react"

export default function MaestroArticulosPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <div className="container mx-auto py-8 px-4">
        {/* Header with back button */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Volver al menú principal
          </Link>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-slate-100 mb-4">Maestro de Artículos</h1>
            <p className="text-slate-400 text-lg">Gestión completa del inventario de artículos</p>
          </div>
        </div>

        {/* Functionality Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Listar Artículos por Proveedor */}
          <Link href="maestro-articulos/ListarArticulosXProveedor" className="group">
            <Card className="bg-slate-800 border-slate-700 shadow-xl hover:shadow-2xl transition-all duration-300 group-hover:scale-105 cursor-pointer">
              <CardHeader className="bg-gradient-to-r from-blue-900 to-slate-800 rounded-t-lg">
                <CardTitle className="text-xl text-blue-100 flex items-center gap-3">
                  <List className="w-6 h-6 text-blue-400" />
                  Listar por Proveedor
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-slate-300">
                  Consulta todos los artículos organizados por proveedor con información detallada.
                </p>
                <div className="mt-4 flex items-center text-blue-400 text-sm font-medium">Acceder →</div>
              </CardContent>
            </Card>
          </Link>

          {/* Agregar Nuevo Artículo */}
          <Card className="bg-slate-800 border-slate-700 shadow-xl opacity-60">
            <CardHeader className="bg-gradient-to-r from-slate-700 to-slate-800 rounded-t-lg">
              <CardTitle className="text-xl text-slate-300 flex items-center gap-3">
                <Plus className="w-6 h-6 text-slate-400" />
                Agregar Artículo
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-slate-400">Registra nuevos artículos en el sistema con toda su información.</p>
              <div className="mt-4 flex items-center text-slate-500 text-sm">Próximamente...</div>
            </CardContent>
          </Card>

          {/* Editar Artículos */}
          <Card className="bg-slate-800 border-slate-700 shadow-xl opacity-60">
            <CardHeader className="bg-gradient-to-r from-slate-700 to-slate-800 rounded-t-lg">
              <CardTitle className="text-xl text-slate-300 flex items-center gap-3">
                <Edit className="w-6 h-6 text-slate-400" />
                Editar Artículos
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-slate-400">Modifica la información de artículos existentes en el inventario.</p>
              <div className="mt-4 flex items-center text-slate-500 text-sm">Próximamente...</div>
            </CardContent>
          </Card>

          {/* Gestión de Stock */}
          <Card className="bg-slate-800 border-slate-700 shadow-xl opacity-60">
            <CardHeader className="bg-gradient-to-r from-slate-700 to-slate-800 rounded-t-lg">
              <CardTitle className="text-xl text-slate-300 flex items-center gap-3">
                <BarChart3 className="w-6 h-6 text-slate-400" />
                Gestión de Stock
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-slate-400">Controla y actualiza los niveles de stock de todos los artículos.</p>
              <div className="mt-4 flex items-center text-slate-500 text-sm">Próximamente...</div>
            </CardContent>
          </Card>

          {/* Categorías */}
          <Card className="bg-slate-800 border-slate-700 shadow-xl opacity-60">
            <CardHeader className="bg-gradient-to-r from-slate-700 to-slate-800 rounded-t-lg">
              <CardTitle className="text-xl text-slate-300 flex items-center gap-3">
                <Tags className="w-6 h-6 text-slate-400" />
                Categorías
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-slate-400">Administra las categorías y clasificaciones de los artículos.</p>
              <div className="mt-4 flex items-center text-slate-500 text-sm">Próximamente...</div>
            </CardContent>
          </Card>

          {/* Búsqueda Avanzada */}
          <Card className="bg-slate-800 border-slate-700 shadow-xl opacity-60">
            <CardHeader className="bg-gradient-to-r from-slate-700 to-slate-800 rounded-t-lg">
              <CardTitle className="text-xl text-slate-300 flex items-center gap-3">
                <Search className="w-6 h-6 text-slate-400" />
                Búsqueda Avanzada
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-slate-400">Busca artículos con filtros avanzados y criterios específicos.</p>
              <div className="mt-4 flex items-center text-slate-500 text-sm">Próximamente...</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
