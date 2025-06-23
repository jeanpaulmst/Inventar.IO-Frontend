"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Send, Package, DollarSign, Truck } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Interfaces para los datos
interface DTODetallesOCEnviar {
  cantidad: number
  subTotal: number
  costoUnitario: number
  costoPedido: number
  isProveedorPredeterminado: boolean
  nombreArt: string
  costoAlmacenamientoArt: number
  nombreProveedor: string
}

interface DTOEnviarOrdenCompra {
  idOC: number
  fhAltaOC: string
  nombreEstado: string
  detallesOC: DTODetallesOCEnviar[]
}

export default function EnviarOrdenCompraPage() {
  const params = useParams()
  const router = useRouter()
  const ordenId = params.id as string

  const [orden, setOrden] = useState<DTOEnviarOrdenCompra | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // URLs base para los endpoints
  const API_URL_ENVIAR = "http://localhost:8080/EnviarOrdenCompra"

  // Cargar datos de la orden al montar el componente
  useEffect(() => {
    const fetchOrdenData = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(
          `${API_URL_ENVIAR}/getDatosOC?idOC=${ordenId}`,
        )

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`)
        }

        const data: DTOEnviarOrdenCompra = await response.json()
        setOrden(data)
        setError(null)
      } catch (err) {
        console.error("Error al obtener datos de la orden:", err)
        setError(err instanceof Error ? err.message : "Error desconocido")
      } finally {
        setIsLoading(false)
      }
    }

    if (ordenId) {
      fetchOrdenData()
    }
  }, [ordenId])

  const handleEnviar = async () => {
    if (!orden) return

    setIsSending(true)

    try {
      const response = await fetch(`${API_URL_ENVIAR}/confirmar?idOC=${orden.idOC}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      alert(`Orden de compra #${orden.idOC} enviada exitosamente`)
      router.push("/orden-de-compra/OrdenesCompra")
    } catch (error) {
      console.error("Error al enviar orden de compra:", error)
      alert(`Error al enviar la orden: ${error instanceof Error ? error.message : "Error desconocido"}`)
    } finally {
      setIsSending(false)
    }
  }

  // Formatear fecha para mostrar
  const formatearFecha = (fechaString: string) => {
    const fecha = new Date(fechaString)
    return fecha.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Calcular totales
  const totalOrden = orden?.detallesOC.reduce((total, detalle) => total + detalle.subTotal, 0) || 0
  const totalCostoPedido = orden?.detallesOC.reduce((total, detalle) => total + detalle.costoPedido, 0) || 0
  const totalCostoAlmacenamiento = orden?.detallesOC.reduce((total, detalle) => total + detalle.costoAlmacenamientoArt, 0) || 0

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-green-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-400">Cargando orden de compra...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !orden) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-400 text-2xl">⚠</span>
            </div>
            <h3 className="text-xl font-semibold text-slate-300 mb-2">Error al cargar orden</h3>
            <p className="text-slate-400 mb-4">{error || "Orden no encontrada"}</p>
            <Link href="/orden-de-compra/OrdenesCompra">
              <Button className="bg-green-600 hover:bg-green-700">Volver a Órdenes de Compra</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      {/* Header con botón de volver */}
      <div className="mb-8">
        <Link
          href="/orden-de-compra/OrdenesCompra"
          className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a Órdenes de Compra
        </Link>

        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-100 mb-4">Enviar Orden de Compra</h1>
          <p className="text-slate-400 text-lg">
            Revisando: <span className="text-green-400 font-medium">Orden #{orden.idOC}</span>
          </p>
        </div>
      </div>

      {/* Información de la orden */}
      <div className="max-w-4xl mx-auto">
        <Card className="bg-slate-800 border-slate-700 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-green-900 to-slate-800 rounded-t-lg">
            <CardTitle className="text-2xl text-green-100 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              Detalles de la Orden de Compra
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {/* Información general */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-slate-700 rounded-lg border border-slate-600">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="w-4 h-4 text-blue-400" />
                  <span className="text-slate-300 text-sm">ID de Orden:</span>
                </div>
                <span className="text-slate-100 font-bold text-lg">#{orden.idOC}</span>
              </div>
              <div className="p-4 bg-slate-700 rounded-lg border border-slate-600">
                <div className="flex items-center gap-2 mb-2">
                  <Truck className="w-4 h-4 text-orange-400" />
                  <span className="text-slate-300 text-sm">Estado:</span>
                </div>
                <Badge className="bg-yellow-600 text-slate-900 font-semibold">
                  {orden.nombreEstado}
                </Badge>
              </div>
              <div className="p-4 bg-slate-700 rounded-lg border border-slate-600">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-green-400" />
                  <span className="text-slate-300 text-sm">Fecha de Alta:</span>
                </div>
                <span className="text-slate-100 font-medium">{formatearFecha(orden.fhAltaOC)}</span>
              </div>
            </div>

            {/* Tabla de artículos */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-slate-200 mb-4">Artículos de la Orden</h3>
              <div className="rounded-lg overflow-hidden border border-slate-700">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-700 hover:bg-slate-700 border-slate-600">
                      <TableHead className="text-green-200 font-semibold">Artículo</TableHead>
                      <TableHead className="text-green-200 font-semibold">Proveedor</TableHead>
                      <TableHead className="text-green-200 font-semibold">Cantidad</TableHead>
                      <TableHead className="text-green-200 font-semibold">Costo Unitario</TableHead>
                      <TableHead className="text-green-200 font-semibold">Subtotal</TableHead>
                      <TableHead className="text-green-200 font-semibold">Costo Pedido</TableHead>
                      <TableHead className="text-green-200 font-semibold">Predeterminado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orden.detallesOC.map((detalle, index) => (
                      <TableRow
                        key={index}
                        className={`
                          ${index % 2 === 0 ? "bg-slate-800" : "bg-slate-750"} 
                          hover:bg-slate-700 border-slate-600 transition-colors
                        `}
                      >
                        <TableCell className="text-slate-100 font-medium">{detalle.nombreArt}</TableCell>
                        <TableCell className="text-slate-300">{detalle.nombreProveedor}</TableCell>
                        <TableCell className="text-slate-300 font-mono">{detalle.cantidad}</TableCell>
                        <TableCell className="text-green-400 font-semibold">
                          ${detalle.costoUnitario.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-blue-400 font-semibold">
                          ${detalle.subTotal.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-orange-400 font-semibold">
                          ${detalle.costoPedido.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`${
                              detalle.isProveedorPredeterminado
                                ? "bg-green-600 text-white"
                                : "bg-slate-600 text-slate-300"
                            }`}
                          >
                            {detalle.isProveedorPredeterminado ? "Sí" : "No"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Resumen de costos */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-slate-700 rounded-lg border border-slate-600">
                <h4 className="text-slate-200 font-medium mb-2">Total de la Orden</h4>
                <span className="text-green-400 font-bold text-xl">${totalOrden.toFixed(2)}</span>
              </div>
              <div className="p-4 bg-slate-700 rounded-lg border border-slate-600">
                <h4 className="text-slate-200 font-medium mb-2">Total Costo Pedido</h4>
                <span className="text-orange-400 font-bold text-xl">${totalCostoPedido.toFixed(2)}</span>
              </div>
              <div className="p-4 bg-slate-700 rounded-lg border border-slate-600">
                <h4 className="text-slate-200 font-medium mb-2">Total Costo Almacenamiento</h4>
                <span className="text-blue-400 font-bold text-xl">${totalCostoAlmacenamiento.toFixed(2)}</span>
              </div>
            </div>

            {/* Información adicional */}
            <div className="p-4 bg-slate-700 rounded-lg border border-slate-600 mb-6">
              <h3 className="text-slate-200 font-medium mb-2">Información</h3>
              <ul className="text-sm text-slate-400 space-y-1">
                <li>• Al enviar la orden, su estado cambiará a "Enviada"</li>
                <li>• Los proveedores recibirán la notificación de la orden</li>
                <li>• La orden quedará registrada en el sistema</li>
                <li>• Podrá hacer seguimiento del estado de la orden</li>
              </ul>
            </div>

            {/* Botón de envío */}
            <div className="flex justify-end pt-4">
              <Button
                onClick={handleEnviar}
                disabled={isSending}
                className="bg-green-600 hover:bg-green-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white flex items-center gap-2 px-6 py-2"
              >
                {isSending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Enviar Orden de Compra
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 