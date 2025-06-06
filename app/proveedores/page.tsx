import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, UserPlus, Users, Edit, BarChart3, Phone, FileText, Settings } from "lucide-react"

export default function ProveedoresPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <div className="container mx-auto py-8 px-4">
        {/* Header with back button */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Volver al menú principal
          </Link>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-slate-100 mb-4">Proveedores</h1>
            <p className="text-slate-400 text-lg">Administración de proveedores y relaciones comerciales</p>
          </div>
        </div>

        {/* Functionality Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* ABM Proveedor */}
          <Link href="/proveedores/ABMProveedor" className="group">
            <Card className="bg-slate-800 border-slate-700 shadow-xl hover:shadow-2xl transition-all duration-300 group-hover:scale-105 cursor-pointer">
              <CardHeader className="bg-gradient-to-r from-green-900 to-slate-800 rounded-t-lg">
                <CardTitle className="text-xl text-green-100 flex items-center gap-3">
                  <Settings className="w-6 h-6 text-green-400" />
                  ABM Proveedor
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-slate-300">
                  Administra proveedores: crear, modificar, eliminar y consultar el estado de todos los proveedores.
                </p>
                <div className="mt-4 flex items-center text-green-400 text-sm font-medium">Acceder →</div>
              </CardContent>
            </Card>
          </Link>

          {/* Registrar Proveedor */}
          <Card className="bg-slate-800 border-slate-700 shadow-xl opacity-60">
            <CardHeader className="bg-gradient-to-r from-slate-700 to-slate-800 rounded-t-lg">
              <CardTitle className="text-xl text-slate-300 flex items-center gap-3">
                <UserPlus className="w-6 h-6 text-slate-400" />
                Registrar Proveedor
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-slate-400">Registra nuevos proveedores con toda su información comercial.</p>
              <div className="mt-4 flex items-center text-slate-500 text-sm">Próximamente...</div>
            </CardContent>
          </Card>

          {/* Listar Proveedores */}
          <Card className="bg-slate-800 border-slate-700 shadow-xl opacity-60">
            <CardHeader className="bg-gradient-to-r from-slate-700 to-slate-800 rounded-t-lg">
              <CardTitle className="text-xl text-slate-300 flex items-center gap-3">
                <Users className="w-6 h-6 text-slate-400" />
                Listar Proveedores
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-slate-400">Consulta la lista completa de proveedores registrados.</p>
              <div className="mt-4 flex items-center text-slate-500 text-sm">Próximamente...</div>
            </CardContent>
          </Card>

          {/* Editar Proveedor */}
          <Card className="bg-slate-800 border-slate-700 shadow-xl opacity-60">
            <CardHeader className="bg-gradient-to-r from-slate-700 to-slate-800 rounded-t-lg">
              <CardTitle className="text-xl text-slate-300 flex items-center gap-3">
                <Edit className="w-6 h-6 text-slate-400" />
                Editar Proveedor
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-slate-400">Modifica la información de proveedores existentes.</p>
              <div className="mt-4 flex items-center text-slate-500 text-sm">Próximamente...</div>
            </CardContent>
          </Card>

          {/* Gestión de Contactos */}
          <Card className="bg-slate-800 border-slate-700 shadow-xl opacity-60">
            <CardHeader className="bg-gradient-to-r from-slate-700 to-slate-800 rounded-t-lg">
              <CardTitle className="text-xl text-slate-300 flex items-center gap-3">
                <Phone className="w-6 h-6 text-slate-400" />
                Gestión de Contactos
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-slate-400">Administra los contactos y representantes de cada proveedor.</p>
              <div className="mt-4 flex items-center text-slate-500 text-sm">Próximamente...</div>
            </CardContent>
          </Card>

          {/* Historial de Compras */}
          <Card className="bg-slate-800 border-slate-700 shadow-xl opacity-60">
            <CardHeader className="bg-gradient-to-r from-slate-700 to-slate-800 rounded-t-lg">
              <CardTitle className="text-xl text-slate-300 flex items-center gap-3">
                <FileText className="w-6 h-6 text-slate-400" />
                Historial de Compras
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-slate-400">Consulta el historial completo de compras por proveedor.</p>
              <div className="mt-4 flex items-center text-slate-500 text-sm">Próximamente...</div>
            </CardContent>
          </Card>

          {/* Evaluación de Proveedores */}
          <Card className="bg-slate-800 border-slate-700 shadow-xl opacity-60">
            <CardHeader className="bg-gradient-to-r from-slate-700 to-slate-800 rounded-t-lg">
              <CardTitle className="text-xl text-slate-300 flex items-center gap-3">
                <BarChart3 className="w-6 h-6 text-slate-400" />
                Evaluación
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-slate-400">Evalúa el desempeño y calidad de los proveedores.</p>
              <div className="mt-4 flex items-center text-slate-500 text-sm">Próximamente...</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
