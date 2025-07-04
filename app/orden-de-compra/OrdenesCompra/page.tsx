"use client"

import { useEffect, useState } from "react"
import { ArrowLeft, ClipboardList, PackageCheck, DollarSign } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { OrdenDeCompra } from "@/types"

export default function OrdenesCompra() {
  const router = useRouter()
  const [ordenes, setOrdenes] = useState<OrdenDeCompra[]>([])
  const BASE_URL = "http://localhost:8080/GenerarOrdenCompra"

  useEffect(() => {
    const fetchOrdenes = async () => {
      const response = await fetch(`${BASE_URL}/traerOrdenesVigentes`)
      if (!response.ok) {
        console.error("Error al obtener órdenes")
        return
      }
      const data : OrdenDeCompra[] = await response.json()
      setOrdenes(data)
    }

    fetchOrdenes()
  }, [])

  const handleModificar = (id: number) => {
    router.push(`/orden-de-compra/OrdenesCompra/${id}`)
  }

  const handleEnviar = (id: number) => {
    router.push(`/orden-de-compra/EnviarOrdenCompra/${id}`)
  }

  const handleCancelar = (id: number) => {
    router.push(`/orden-de-compra/CancelarOrdenCompra/${id}`)
  }

  const handleFinalizar = (id: number) => {
    router.push(`/orden-de-compra/FinalizarOrdenCompra/${id}`)
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      {/* Header */}
      <div className="mb-8">
        <Link href="/orden-de-compra" className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 mb-6">
          <ArrowLeft className="w-4 h-4" />
          Volver a Orden de Compra
        </Link>

        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-100">Órdenes de Compra</h1>
            <p className="text-slate-400">Listado de órdenes generadas</p>
          </div>
          <Button
            onClick={() => router.push("/orden-de-compra/GenerarOrdenDeCompra")}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Generar Orden de Compra
          </Button>
        </div>
      </div>

      {/* Grid de Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {ordenes.map((orden) => (
          <Card
            key={orden.idOrdenDeCompra}
            className="bg-slate-800 border-slate-700 transition-all duration-300 hover:shadow-lg"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-slate-100 flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-blue-400" />
                  Orden #{orden.idOrdenDeCompra}
                </CardTitle>
                <Badge
                  className={`${
                    orden.estado === "Pendiente"
                      ? "bg-green-500 text-white"
                      : orden.estado === "Enviada"
                      ? "bg-orange-500 text-white"
                      : orden.estado === "Finalizada"
                      ? "bg-blue-500 text-white"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {orden.estado}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Artículos */}
              <div className="p-3 bg-slate-700 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <PackageCheck className="w-4 h-4 text-purple-400" />
                  <span className="text-slate-300 text-sm">Artículos:</span>
                </div>
                <ul className="list-disc list-inside text-slate-100 text-sm pl-2">
                  {orden.articulos.map((nombre, idx) => (
                    <li key={idx}>{nombre}</li>
                  ))}
                </ul>
              </div>

              {/* Total */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-slate-700 border border-slate-600">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-400" />
                  <span className="text-slate-200 font-medium">Total:</span>
                </div>
                <span className="text-green-400 font-bold">${orden.total.toFixed(2)}</span>
              </div>

              {/* Acciones */}
              <div className="flex gap-2 justify-end pt-2">
                {orden.estado === "Pendiente" && (
                  <>
                    <Button 
                      size="sm"
                      onClick={() => handleEnviar(orden.idOrdenDeCompra)}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Enviar
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => handleCancelar(orden.idOrdenDeCompra)}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={() => handleModificar(orden.idOrdenDeCompra)}
                      size="sm"
                      className="bg-yellow-600 hover:bg-yellow-700 text-slate-900 font-semibold"
                    >
                      Modificar
                    </Button>
                  </>
                )}
                {orden.estado === "Enviada" && (
                  <Button 
                    size="sm"
                    onClick={() => handleFinalizar(orden.idOrdenDeCompra)}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Finalizar
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {ordenes.length === 0 && (
        <div className="text-center text-slate-400 text-lg mt-10">
          No hay órdenes de compra registradas.
        </div>
      )}
    </div>
  )
}