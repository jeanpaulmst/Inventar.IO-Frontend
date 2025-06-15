"use client"

import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Star, Package, DollarSign, Clock, Warehouse } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { DTOCalcularCGI } from "@/types"

export default function CalcularCGIDetallesPage() {
  const params = useParams()
  const router = useRouter()
  const articuloId = Number(params.id)
  const BASE_URL = "http://localhost:8080/CalcularCGI";
  const [dtoCalcularCGI, setDTOCalcularCGI] = useState<DTOCalcularCGI | null>(null)

  useEffect(() => {
    const realizarCalculo = async () => {
      const response = await fetch(`${BASE_URL}/calculo?idArticulo=${articuloId}`)
      if (!response.ok) {
        console.error("Error al hacer el cálculo:", response.statusText)
        return
      }

      const data: DTOCalcularCGI = await response.json()
      setDTOCalcularCGI(data)
    }
    realizarCalculo()
  }, [])

  if (!dtoCalcularCGI) {
    return (
      <div className="flex justify-center items-center h-96 text-slate-300 text-lg">
        Cargando cálculo CGI...
      </div>
    )
  }

  const cgiMinimo = Math.min(...dtoCalcularCGI.datosCGI.map((p) => p.cgi))

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
          <h1 className="text-3xl font-bold text-slate-100">{dtoCalcularCGI.nombreArticulo}</h1>
          <p className="text-slate-400">Cálculo de CGI por proveedor</p>
        </div>
      </div>

      {/* Grid de cards de proveedores */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {dtoCalcularCGI.datosCGI.map((proveedor) => {
          const esCGIMasBajo = proveedor.cgi === cgiMinimo

          return (
            <Card
              key={proveedor.nombreProveedor}
              className={`${
                esCGIMasBajo
                  ? "bg-gradient-to-br from-yellow-900/100 to-slate-800 border-yellow-500/50 shadow-yellow-500/10 shadow-lg"
                  : "bg-slate-800 border-slate-700"
              } transition-all duration-300 hover:shadow-lg`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-slate-100 flex items-center gap-2">
                    <Package className="w-5 h-5 text-blue-400" />
                    {proveedor.nombreProveedor}
                  </CardTitle>
                  {proveedor.predeterminado && (
                    <Badge className="bg-yellow-200 text-slate-900 hover:bg-yellow-200">
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
                  <span className="text-slate-100 font-medium">{proveedor.nombreTipoModelo}</span>
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
                    esCGIMasBajo ? "bg-yellow-900/20 border-yellow-500/50" : "bg-slate-700 border-slate-600"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-slate-200 font-medium">CGI Total:</span>
                    <span
                      className={`text-xl font-bold ${
                        esCGIMasBajo ? "text-yellow-400" : "text-slate-100"
                      }`}
                    >
                      ${(proveedor.cgi ?? 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Información adicional */}
      {dtoCalcularCGI.datosCGI.length > 0 ? (
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
                <span className="text-blue-400 font-semibold">{dtoCalcularCGI.datosCGI.length}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-slate-300">CGI más bajo: </span>
                <span className="text-green-400 font-semibold">
                  ${cgiMinimo.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <span className="text-slate-300">Proveedor predeterminado: </span>
                <span className="text-yellow-400 font-semibold">
                  {dtoCalcularCGI.datosCGI.find((p) => p.predeterminado)?.nombreProveedor || "Ninguno"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-slate-800 border-slate-700 mt-6">
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