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
  const BASE_URL = "http://localhost:8080/CalcularCGI"
  const [dtoCalcularCGI, setDTOCalcularCGI] = useState<DTOCalcularCGI | null>(null)

  useEffect(() => {
    const realizarCalculo = async () => {
      const response = await fetch(`${BASE_URL}/calculo?idArticulo=${articuloId}`)
      if (!response.ok) {
        const responseData = await response.json();
        console.error("Error:", responseData.mensaje)
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

  if (dtoCalcularCGI.datosCGI.length === 0) {
    return (
      <div className="flex justify-center items-center h-96 text-slate-300 text-lg">
        No hay datos de CGI para este artículo.
      </div>
    )
  }

  const proveedor = dtoCalcularCGI.datosCGI[0]

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
          <p className="text-slate-400">Cálculo de CGI para proveedor predeterminado</p>
        </div>
      </div>

      {/* Card del Proveedor Predeterminado */}
      <div className="grid gap-6">
        <Card className="bg-gradient-to-br from-yellow-900/100 to-slate-800 border-yellow-500/50 shadow-yellow-500/10 shadow-lg transition-all duration-300 hover:shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-slate-100 flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-400" />
                {proveedor.nombreProveedor}
              </CardTitle>
              <Badge className="bg-yellow-200 text-slate-900 hover:bg-yellow-200">
                <Star className="w-3 h-3 mr-1" />
                Predeterminado
              </Badge>
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
            <div className="p-4 rounded-lg border-2 bg-yellow-900/20 border-yellow-500/50">
              <div className="flex items-center justify-between">
                <span className="text-slate-200 font-medium">CGI Total:</span>
                <span className="text-xl font-bold text-yellow-400">${(proveedor.cgi ?? 0).toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}