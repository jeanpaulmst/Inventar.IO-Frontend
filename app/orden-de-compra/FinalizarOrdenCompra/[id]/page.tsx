"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, CheckCircle, Package, DollarSign, Truck, AlertTriangle, Plus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// Interfaces para los datos
interface DTODetallesOC {
  cantidad: number
  subTotal: number
  costoUnitario: number
  costoPedido: number
  isProveedorPredeterminado: boolean
  nombreArt: string
  costoAlmacenamientoArt: number
  nombreProveedor: string
  stock: number
  puntoPedido: number
}

interface DTODetalleAtencion {
  nombreArticulo: string
  stockActual: number
  puntoPedido: number
  costoUnitario: number
  costoPedido: number
  nombreProveedor: string
}


interface DTOFinalizarOrdenCompra {
  idOC: number
  fhAltaOC: string
  detallesOC: DTODetallesOC[]
}

interface DTORespuestaFinalizarOC {
  requiereAtencion: boolean
  detallesAtencion: DTODetalleAtencion[]
}

export default function FinalizarOrdenCompraPage() {
  const params = useParams()
  const router = useRouter()
  const ordenId = params.id as string

  const [orden, setOrden] = useState<DTOFinalizarOrdenCompra | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isFinalizing, setIsFinalizing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [respuestaFinalizacion, setRespuestaFinalizacion] = useState<DTORespuestaFinalizarOC | null>(null)

  // URLs base para los endpoints
  const API_URL_FINALIZAR = "http://localhost:8080/FinalizarOrdenCompra"

  // Cargar datos de la orden al montar el componente
  useEffect(() => {
    const fetchOrdenData = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`${API_URL_FINALIZAR}/getDatosOC?idOC=${ordenId}`)

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`)
        }

        const data: DTOFinalizarOrdenCompra = await response.json()
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

  const handleFinalizar = async () => {
    if (!orden) return

    setIsFinalizing(true)

    try {
      const response = await fetch(`${API_URL_FINALIZAR}/confirmar?idOC=${ordenId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const respuesta: DTORespuestaFinalizarOC = await response.json()
      setRespuestaFinalizacion(respuesta)

      if (respuesta.requiereAtencion) {
        setShowConfirmDialog(true)
      } else {
        alert(`Orden de compra #${ordenId} finalizada exitosamente`)
        router.push("/orden-de-compra/OrdenesCompra")
      }
    } catch (error) {
      console.error("Error al finalizar orden de compra:", error)
      alert(`Error al finalizar la orden: ${error instanceof Error ? error.message : "Error desconocido"}`)
    } finally {
      setIsFinalizing(false)
    }
  }

  const handleConfirmarAtencion = () => {
    setShowConfirmDialog(false)
    alert(`Orden de compra #${ordenId} finalizada exitosamente`)
    router.push("/orden-de-compra/OrdenesCompra")
  }

  const calcularTotal = () => {
    if (!orden) return 0
    return orden.detallesOC.reduce((total, detalle) => total + detalle.subTotal, 0)
  }

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-green-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-400">Cargando datos de la orden...</p>
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
          <h1 className="text-4xl font-bold text-slate-100 mb-4">Finalizar Orden de Compra</h1>
          <p className="text-slate-400 text-lg">
            Finalizando: <span className="text-green-400 font-medium">Orden #{orden.idOC}</span>
          </p>
          <p className="text-slate-500 text-sm">
            Fecha de alta: {new Date(orden.fhAltaOC).toLocaleDateString('es-ES')}
          </p>
        </div>
      </div>

      {/* Información de la orden */}
      <div className="max-w-4xl mx-auto">
        <Card className="bg-slate-800 border-slate-700 shadow-xl mb-6">
          <CardHeader className="bg-gradient-to-r from-green-900 to-slate-800 rounded-t-lg">
            <CardTitle className="text-2xl text-green-100 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              Resumen de la Orden
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-slate-700 rounded-lg border border-slate-600">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="w-5 h-5 text-blue-400" />
                  <span className="text-slate-300 font-medium">Artículos</span>
                </div>
                <span className="text-2xl font-bold text-blue-400">{orden.detallesOC.length}</span>
              </div>
              <div className="p-4 bg-slate-700 rounded-lg border border-slate-600">
                <div className="flex items-center gap-2 mb-2">
                  <Truck className="w-5 h-5 text-purple-400" />
                  <span className="text-slate-300 font-medium">Proveedores</span>
                </div>
                <span className="text-2xl font-bold text-purple-400">
                  {new Set(orden.detallesOC.map(d => d.nombreProveedor)).size}
                </span>
              </div>
              <div className="p-4 bg-slate-700 rounded-lg border border-slate-600">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-5 h-5 text-green-400" />
                  <span className="text-slate-300 font-medium">Total</span>
                </div>
                <span className="text-2xl font-bold text-green-400">${calcularTotal().toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detalles de la orden */}
        <div className="space-y-6 mb-8">
          <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Package className="w-6 h-6 text-blue-400" />
            Detalles de la Orden
          </h2>
          
          {orden.detallesOC.map((detalle, index) => {
            const nuevoStock = detalle.stock + detalle.cantidad
            
            return (
              <Card key={index} className="bg-slate-800 border-slate-700 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-slate-700 to-slate-800 rounded-t-lg">
                  <CardTitle className="text-xl text-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Package className="w-6 h-6 text-blue-400" />
                      {detalle.nombreArt}
                    </div>
                    {detalle.isProveedorPredeterminado && (
                      <Badge className="bg-yellow-600 text-slate-900 font-semibold">
                        Predeterminado
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Información del artículo */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-slate-200 mb-3">Información del Artículo</h3>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-slate-700 rounded-lg">
                          <span className="text-slate-400 text-sm">Cantidad a Recibir</span>
                          <p className="text-slate-200 font-medium">{detalle.cantidad}</p>
                        </div>
                        <div className="p-3 bg-slate-700 rounded-lg">
                          <span className="text-slate-400 text-sm">Stock Actual</span>
                          <p className="text-slate-200 font-medium">{detalle.stock}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-slate-700 rounded-lg">
                          <span className="text-slate-400 text-sm">Punto de Pedido</span>
                          <p className="text-slate-200 font-medium">{detalle.puntoPedido}</p>
                        </div>
                        <div className="p-3 bg-slate-700 rounded-lg">
                          <span className="text-slate-400 text-sm">Costo Almacenamiento</span>
                          <p className="text-slate-200 font-medium">${detalle.costoAlmacenamientoArt.toFixed(2)}</p>
                        </div>
                      </div>

                      <div className="p-3 bg-green-900/20 border border-green-600/30 rounded-lg">
                        <span className="text-green-400 text-sm font-medium">📦 Nuevo Stock</span>
                        <p className="text-green-200 font-medium">{nuevoStock} unidades</p>
                        <p className="text-green-300 text-xs mt-1">
                          {detalle.stock} + {detalle.cantidad} = {nuevoStock}
                        </p>
                        {nuevoStock <= detalle.puntoPedido && (
                          <p className="text-yellow-400 text-xs mt-2">
                            ⚠️ El nuevo stock ({nuevoStock}) no supera el punto de pedido ({detalle.puntoPedido})
                          </p>
                        )}
                      </div>

                      <div className="p-3 bg-slate-700 rounded-lg">
                        <span className="text-slate-400 text-sm">Proveedor</span>
                        <p className="text-slate-200 font-medium">{detalle.nombreProveedor}</p>
                      </div>
                    </div>

                    {/* Información de costos */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-slate-200 mb-3">Información de Costos</h3>
                      
                      <div className="space-y-3">
                        <div className="p-3 bg-slate-700 rounded-lg">
                          <span className="text-slate-400 text-sm">Costo Unitario</span>
                          <p className="text-slate-200 font-medium">${detalle.costoUnitario.toFixed(2)}</p>
                        </div>
                        <div className="p-3 bg-slate-700 rounded-lg">
                          <span className="text-slate-400 text-sm">Costo de Pedido</span>
                          <p className="text-slate-200 font-medium">${detalle.costoPedido.toFixed(2)}</p>
                        </div>
                      </div>

                      <div className="p-4 bg-slate-700 rounded-lg border border-slate-600">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-5 h-5 text-green-400" />
                            <span className="text-slate-300 font-medium">Subtotal:</span>
                          </div>
                          <span className="text-green-400 font-bold text-lg">${detalle.subTotal.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end gap-4 pt-6">
          <Link href="/orden-de-compra/OrdenesCompra">
            <Button variant="outline" className="bg-slate-600 hover:bg-slate-700 border-slate-500 text-slate-200">
              Cancelar
            </Button>
          </Link>
          <Button
            onClick={handleFinalizar}
            disabled={isFinalizing}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold flex items-center gap-2 px-6 py-2"
          >
            {isFinalizing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Finalizando...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                Finalizar Orden
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Diálogo de atención requerida */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent className="bg-slate-800 border-slate-700 text-slate-100">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-yellow-400 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Atención Requerida
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-300">
              La orden ha sido finalizada exitosamente, pero algunos artículos requieren atención.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <div className="p-3 bg-yellow-900/20 border border-yellow-600/30 rounded-lg mb-4">
              <p className="text-yellow-200 text-sm">
                <strong>Nota:</strong> Los siguientes artículos no superan su punto de pedido después de la finalización.
              </p>
            </div>
            
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {respuestaFinalizacion?.detallesAtencion.map((detalle, index) => (
                <div key={index} className="p-3 bg-slate-700 rounded-lg border border-slate-600">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-200 font-medium">{detalle.nombreArticulo}</span>
                    <Badge className="bg-red-600 text-white text-xs">
                      Requiere Atención
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-slate-400">Stock actual:</span>
                      <span className="text-slate-200 ml-1">{detalle.stockActual}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Punto de pedido:</span>
                      <span className="text-slate-200 ml-1">{detalle.puntoPedido}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Proveedor:</span>
                      <span className="text-slate-200 ml-1">{detalle.nombreProveedor}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Costo unitario:</span>
                      <span className="text-slate-200 ml-1">${detalle.costoUnitario.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={handleConfirmarAtencion}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Entendido
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 