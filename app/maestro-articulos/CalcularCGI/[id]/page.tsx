"use client"

import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Star, Package, DollarSign, Clock, Warehouse } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

// Datos de ejemplo para artículos
const articulosData = {
  1: { nombre: "Shampoo Axion" },
  2: { nombre: "Laptop HP Pavilion" },
  3: { nombre: "Monitor LG 24ML44" },
  4: { nombre: "Resma Papel A4" },
  5: { nombre: "Silla Ergonómica Pro" },
  6: { nombre: "Bolígrafos Pack x10" },
  7: { nombre: "Escritorio Ejecutivo" },
  8: { nombre: "Grapadora Metálica" },
  9: { nombre: "Teclado Logitech" },
  10: { nombre: "Mouse Óptico" },
}

// Datos de ejemplo para ArticuloProveedor
const articuloProveedorData = {
  1: [
    {
      id: 1,
      nombreProveedor: "Distribuidora Belleza S.A.",
      modeloInventario: "Tiempo Fijo",
      costoCompra: 1850.25,
      costoPedido: 125.5,
      costoAlmacenamiento: 15.75,
      cgi: 245.8,
      esPredeterminado: true,
    },
    {
      id: 2,
      nombreProveedor: "Cosméticos del Norte",
      modeloInventario: "Lote Fijo",
      costoCompra: 1920.0,
      costoPedido: 150.0,
      costoAlmacenamiento: 18.5,
      cgi: 268.9,
      esPredeterminado: false,
    },
    {
      id: 3,
      nombreProveedor: "Importadora Premium",
      modeloInventario: "Tiempo Fijo",
      costoCompra: 1780.75,
      costoPedido: 110.25,
      costoAlmacenamiento: 14.2,
      cgi: 228.45,
      esPredeterminado: false,
    },
  ],
  2: [
    {
      id: 4,
      nombreProveedor: "Tecnología Avanzada",
      modeloInventario: "Lote Fijo",
      costoCompra: 42500.0,
      costoPedido: 350.0,
      costoAlmacenamiento: 125.0,
      cgi: 1850.75,
      esPredeterminado: true,
    },
    {
      id: 5,
      nombreProveedor: "Computadoras del Sur",
      modeloInventario: "Tiempo Fijo",
      costoCompra: 43200.5,
      costoPedido: 400.0,
      costoAlmacenamiento: 140.25,
      cgi: 1920.3,
      esPredeterminado: false,
    },
  ],
  3: [
    {
      id: 6,
      nombreProveedor: "Electrónica Moderna",
      modeloInventario: "Tiempo Fijo",
      costoCompra: 11800.0,
      costoPedido: 200.0,
      costoAlmacenamiento: 45.5,
      cgi: 520.75,
      esPredeterminado: true,
    },
    {
      id: 7,
      nombreProveedor: "Monitores Express",
      modeloInventario: "Lote Fijo",
      costoCompra: 12100.25,
      costoPedido: 180.0,
      costoAlmacenamiento: 48.75,
      cgi: 545.2,
      esPredeterminado: false,
    },
    {
      id: 8,
      nombreProveedor: "Pantallas HD",
      modeloInventario: "Tiempo Fijo",
      costoCompra: 11650.0,
      costoPedido: 220.5,
      costoAlmacenamiento: 42.3,
      cgi: 498.9,
      esPredeterminado: false,
    },
  ],
}

export default function CalcularCGIDetallesPage() {
  const params = useParams()
  const router = useRouter()
  const articuloId = Number(params.id)

  // Obtener datos del artículo
  const articulo = articulosData[articuloId as keyof typeof articulosData]
  const proveedores = articuloProveedorData[articuloId as keyof typeof articuloProveedorData] || []

  if (!articulo) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="text-center py-8">
          <h1 className="text-2xl font-bold text-slate-100 mb-4">Artículo no encontrado</h1>
          <Button onClick={() => router.back()} className="bg-blue-600 hover:bg-blue-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      {/* Header con botón de volver */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          onClick={() => router.back()}
          variant="outline"
          className="bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600 hover:text-slate-100"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-slate-100">{articulo.nombre}</h1>
          <p className="text-slate-400">Cálculo de CGI por proveedor</p>
        </div>
      </div>

      {/* Grid de cards de proveedores */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {proveedores.map((proveedor) => (
          <Card
            key={proveedor.id}
            className={`${
              proveedor.esPredeterminado
                ? "bg-gradient-to-br from-yellow-900/20 to-slate-800 border-yellow-500/50 shadow-yellow-500/10 shadow-lg"
                : "bg-slate-800 border-slate-700"
            } transition-all duration-300 hover:shadow-lg`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-slate-100 flex items-center gap-2">
                  <Package className="w-5 h-5 text-blue-400" />
                  {proveedor.nombreProveedor}
                </CardTitle>
                {proveedor.esPredeterminado && (
                  <Badge className="bg-yellow-600 text-slate-900 hover:bg-yellow-700">
                    <Star className="w-3 h-3 mr-1" />
                    Predeterminado
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Modelo de Inventario */}
              <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-purple-400" />
                  <span className="text-slate-300 text-sm">Modelo:</span>
                </div>
                <span className="text-slate-100 font-medium">{proveedor.modeloInventario}</span>
              </div>

              {/* Costos */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-400" />
                    <span className="text-slate-300 text-sm">Costo Compra:</span>
                  </div>
                  <span className="text-green-400 font-semibold">${proveedor.costoCompra.toFixed(2)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-blue-400" />
                    <span className="text-slate-300 text-sm">Costo Pedido:</span>
                  </div>
                  <span className="text-blue-400 font-semibold">${proveedor.costoPedido.toFixed(2)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Warehouse className="w-4 h-4 text-orange-400" />
                    <span className="text-slate-300 text-sm">Costo Almacenamiento:</span>
                  </div>
                  <span className="text-orange-400 font-semibold">${proveedor.costoAlmacenamiento.toFixed(2)}</span>
                </div>
              </div>

              {/* CGI destacado */}
              <div
                className={`p-4 rounded-lg border-2 ${
                  proveedor.esPredeterminado ? "bg-yellow-900/20 border-yellow-500/50" : "bg-slate-700 border-slate-600"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-slate-200 font-medium">CGI Total:</span>
                  <span
                    className={`text-xl font-bold ${proveedor.esPredeterminado ? "text-yellow-400" : "text-slate-100"}`}
                  >
                    ${proveedor.cgi.toFixed(2)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Información adicional */}
      {proveedores.length > 0 && (
        <Card className="bg-slate-800 border-slate-700 mt-6">
          <CardHeader>
            <CardTitle className="text-slate-100 flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-400" />
              Resumen de Proveedores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                <span className="text-slate-300">Total proveedores: </span>
                <span className="text-blue-400 font-semibold">{proveedores.length}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-slate-300">CGI más bajo: </span>
                <span className="text-green-400 font-semibold">
                  ${Math.min(...proveedores.map((p) => p.cgi)).toFixed(2)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <span className="text-slate-300">Proveedor predeterminado: </span>
                <span className="text-yellow-400 font-semibold">
                  {proveedores.find((p) => p.esPredeterminado)?.nombreProveedor || "Ninguno"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {proveedores.length === 0 && (
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="py-8">
            <div className="text-center">
              <Package className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-300 mb-2">No hay proveedores disponibles</h3>
              <p className="text-slate-400">Este artículo no tiene proveedores asociados para calcular el CGI.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
