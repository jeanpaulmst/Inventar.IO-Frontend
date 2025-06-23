"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, X, Package, DollarSign, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"


// Interfaces para los datos
interface DTODetallesOC {
  idOCDetalle: number
  cantidad: number
  subTotal: number
  costoUnitario: number
  costoPedido: number
  nombreArt: string
  costoAlmacenamientoArt: number
  nombreProveedor: string
  isPredeterminado: boolean
  puntoPedido: number
  stock: number // Stock actual del artículo
}

interface DTOProveedor {
  idProveedor: number
  idArticuloProveedor: number 
  nombreProveedor: string
  costoPedido: number
  costoUnitario: number
}

interface DTOModificarOrdenCompra {
  idOC: number
  fhAltaOC: string
  detallesOC: DTODetallesOC[]
  proveedores: DTOProveedor[]
}

interface DTODetallesDatosMod {
  idOCDetalle: number
  cantidad: number
  idProveedor: number
}

interface DTODatosModificacion {
  idOC: number
  detallesMod: DTODetallesDatosMod[]
  confirmadoPorUsuario: boolean
}

interface DTODetalleOrdenNueva {
  cantidad: number
  articuloProveedorId: number
  subTotal: number
}

export default function ModificarOrdenCompraPage() {
  const params = useParams()
  const router = useRouter()
  const ordenId = params.id as string

  const [orden, setOrden] = useState<DTOModificarOrdenCompra | null>(null)
  const [cantidades, setCantidades] = useState<number[]>([])
  const [proveedoresSeleccionados, setProveedoresSeleccionados] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [puntoPedidoError, setPuntoPedidoError] = useState<string | null>(null)

  // URLs base para los endpoints
  const API_URL_MODIFICAR = "http://localhost:8080/ModificarOrdenCompra"
  const API_URL_NUEVA_ORDEN = "http://localhost:8080/GenerarOrdenCompra/nuevaOrden"

  // Cargar datos de la orden al montar el componente
  useEffect(() => {
    const fetchOrdenData = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`${API_URL_MODIFICAR}/getDatosOC?idOC=${ordenId}`)

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`)
        }

        const data: DTOModificarOrdenCompra = await response.json()
        setOrden(data)
        
        // Inicializar cantidades y proveedores seleccionados
        setCantidades(data.detallesOC.map(d => d.cantidad))
        const seleccionados = data.detallesOC.map(detalle => {
          const proveedorActual = data.proveedores.find(
            p => p.nombreProveedor === detalle.nombreProveedor
          )
          return proveedorActual?.idProveedor ?? 0
        })
        setProveedoresSeleccionados(seleccionados)
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

  const handleConfirmar = async () => {
    if (!orden) return
    setIsSaving(true)

    try {
      // 1. Preparar arrays para detalles que NO cambian proveedor y detalles NUEVOS para nuevas órdenes
      const detallesModificados: DTODetallesDatosMod[] = []
      const detallesNuevos: DTODetalleOrdenNueva[] = []

      orden.detallesOC.forEach((detalle, idx) => {
        const cantidad = cantidades[idx]
        const proveedorSeleccionadoId = proveedoresSeleccionados[idx]

        // Buscar proveedor original por nombre
        const proveedorOriginal = orden.proveedores.find(p => p.nombreProveedor === detalle.nombreProveedor)
        const idProveedorOriginal = proveedorOriginal?.idProveedor ?? 0

        if (idProveedorOriginal === proveedorSeleccionadoId) {
          // Mismo proveedor, actualizar cantidad
          detallesModificados.push({
            idOCDetalle: detalle.idOCDetalle,
            cantidad,
            idProveedor: idProveedorOriginal
          })
        } else {
          // Proveedor cambiado => Detalle nuevo para orden nueva
          // Buscar datos del proveedor nuevo para calcular subtotal
          const proveedorNuevo = orden.proveedores.find(p => p.idProveedor === proveedorSeleccionadoId)
          if (!proveedorNuevo) throw new Error("Proveedor seleccionado no válido")

          detallesNuevos.push({
            cantidad,
            articuloProveedorId: proveedorSeleccionadoId,
            subTotal: cantidad * proveedorNuevo.costoUnitario
          })

          // Para la orden original, seteamos cantidad en 0 para ese detalle
          detallesModificados.push({
            idOCDetalle: detalle.idOCDetalle,
            cantidad: 0,
            idProveedor: idProveedorOriginal
          })
        }
      })

      // 2. Enviar modificación a la orden original con detalles que quedan (los que no cambiaron proveedor o que se ponen en 0)
      const datosModificacion: DTODatosModificacion = {
        idOC: orden.idOC,
        detallesMod: detallesModificados,
        confirmadoPorUsuario: true
      }

      const resModificar = await fetch(`${API_URL_MODIFICAR}/confirmar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosModificacion)
      })

      if (!resModificar.ok) {
        const errorText = await resModificar.text()
        throw new Error(`Error modificando orden: ${errorText}`)
      }

      // 3. Si hay detalles con proveedor cambiado, crear nuevas órdenes
      if (detallesNuevos.length > 0) {
        // Agrupar detalles por proveedor (aunque acá ya vienen todos con el proveedor correcto)
        // Para tu caso, todos son del mismo proveedor porque vienen separados, pero si cambias por detalles múltiples, agrupa por articuloProveedorId si quieres.
        const nuevaOrdenPayload = {
          detalles: detallesNuevos,
          confirmacion: true
        }

        const resNuevaOrden = await fetch(API_URL_NUEVA_ORDEN, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(nuevaOrdenPayload)
        })

        if (!resNuevaOrden.ok) {
          const errorText = await resNuevaOrden.text()
          throw new Error(`Error creando nueva orden: ${errorText}`)
        }
      }

      alert("Orden modificada correctamente.")
      router.push("/orden-de-compra/OrdenesCompra")

    } catch (error) {
      alert(`Error al guardar cambios: ${error instanceof Error ? error.message : "Error desconocido"}`)
    } finally {
      setIsSaving(false)
    }
  }

  const calcularTotal = () => {
    if (!orden) return 0
    return orden.detallesOC.reduce((total, detalle, index) => {
      const cantidad = cantidades[index] || 0
      const proveedor = orden.proveedores.find(p => p.idProveedor === proveedoresSeleccionados[index])
      const costoUnitario = proveedor?.costoUnitario || detalle.costoUnitario
      return total + (cantidad * costoUnitario)
    }, 0)
  }

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
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
          <h1 className="text-4xl font-bold text-slate-100 mb-4">Modificar Orden de Compra</h1>
          <p className="text-slate-400 text-lg">
            Editando: <span className="text-yellow-400 font-medium">Orden #{orden.idOC}</span>
          </p>
          <p className="text-slate-500 text-sm">
            Fecha de alta: {new Date(orden.fhAltaOC).toLocaleDateString('es-ES')}
          </p>
        </div>
      </div>

      {/* Información de la orden */}
      <div className="max-w-4xl mx-auto">
        <Card className="bg-slate-800 border-slate-700 shadow-xl mb-6">
          <CardHeader className="bg-gradient-to-r from-yellow-900 to-slate-800 rounded-t-lg">
            <CardTitle className="text-2xl text-yellow-100 flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              Detalles de la Orden
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
                <span className="text-2xl font-bold text-purple-400">{orden.proveedores.length}</span>
              </div>
              <div className="p-4 bg-slate-700 rounded-lg border border-slate-600">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-5 h-5 text-green-400" />
                  <span className="text-slate-300 font-medium">Total Estimado</span>
                </div>
                <span className="text-2xl font-bold text-green-400">${calcularTotal().toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Formulario de modificación */}
        <div className="space-y-6">
          {orden.detallesOC.map((detalle, index) => {
            const proveedorActual = orden.proveedores.find(
              p => p.nombreProveedor === detalle.nombreProveedor
            )
            const proveedorSeleccionado = orden.proveedores.find(
              p => p.idProveedor === proveedoresSeleccionados[index]
            )
            const cantidadActual = cantidades[index] || 0
            const costoUnitarioActual = proveedorSeleccionado?.costoUnitario || detalle.costoUnitario
            const subtotalActual = cantidadActual * costoUnitarioActual

            return (
              <Card key={detalle.idOCDetalle} className="bg-slate-800 border-slate-700 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-slate-700 to-slate-800 rounded-t-lg">
                  <CardTitle className="text-xl text-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Package className="w-6 h-6 text-blue-400" />
                      {detalle.nombreArt}
                    </div>
                    {detalle.isPredeterminado && (
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
                          <span className="text-slate-400 text-sm">Punto de Pedido</span>
                          <p className="text-slate-200 font-medium">{detalle.puntoPedido}</p>
                        </div>
                        <div className="p-3 bg-slate-700 rounded-lg">
                          <span className="text-slate-400 text-sm">Costo Almacenamiento</span>
                          <p className="text-slate-200 font-medium">${detalle.costoAlmacenamientoArt.toFixed(2)}</p>
                        </div>
                      </div>

                      {detalle.stock !== undefined && (
                        <div className="p-3 bg-blue-900/20 border border-blue-600/30 rounded-lg">
                          <span className="text-blue-400 text-sm font-medium">📦 Stock Actual</span>
                          <p className="text-blue-200 font-medium">{detalle.stock} unidades</p>
                        </div>
                      )}

                      <div className="p-3 bg-slate-700 rounded-lg">
                        <span className="text-slate-400 text-sm">Proveedor Actual</span>
                        <p className="text-slate-200 font-medium">{detalle.nombreProveedor}</p>
                      </div>

                      {detalle.isPredeterminado && (
                        <div className="p-3 bg-yellow-900/20 border border-yellow-600/30 rounded-lg">
                          <span className="text-yellow-400 text-sm font-medium">★ Proveedor Predeterminado</span>
                          <p className="text-yellow-200 text-sm mt-1">Este es el proveedor recomendado para este artículo</p>
                        </div>
                      )}
                    </div>

                    {/* Controles de modificación */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-slate-200 mb-3">Modificar</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-slate-300 text-sm font-medium mb-2">
                            Cantidad
                          </label>
                          <Input
                            type="number"
                            min="1"
                            value={cantidadActual || ""}
                            onChange={(e) => {
                              const nuevasCantidades = [...cantidades]
                              const valor = e.target.value === "" ? 0 : parseInt(e.target.value)
                              nuevasCantidades[index] = valor
                              setCantidades(nuevasCantidades)
                            }}
                            className="bg-slate-700 border-slate-600 text-slate-200"
                          />
                          {(() => {
                            const stockActual = detalle.stock || 0
                            const cantidadSolicitada = cantidadActual
                            const stockTotal = stockActual + cantidadSolicitada
                            
                            if (stockTotal < detalle.puntoPedido) {
                              return (
                                <p className="text-yellow-400 text-sm mt-1">
                                  ⚠️ Stock total ({stockTotal}) menor al punto de pedido ({detalle.puntoPedido})
                                  <br />
                                  <span className="text-slate-400 text-xs">
                                    Stock actual: {stockActual} + Cantidad solicitada: {cantidadSolicitada}
                                  </span>
                                </p>
                              )
                            }
                            return null
                          })()}
                        </div>

                        <div>
                          <label className="block text-slate-300 text-sm font-medium mb-2">
                            Proveedor
                          </label>
                          <Select
                            value={proveedoresSeleccionados[index]?.toString()}
                            onValueChange={(value) => {
                              const nuevosSeleccionados = [...proveedoresSeleccionados]
                              nuevosSeleccionados[index] = parseInt(value)
                              setProveedoresSeleccionados(nuevosSeleccionados)
                            }}
                          >
                            <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-200">
                              <SelectValue placeholder="Seleccionar proveedor" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-700 border-slate-600">
                              {orden.proveedores.map((prov) => {
                                const esPredeterminado = prov.nombreProveedor === detalle.nombreProveedor && detalle.isPredeterminado
                                return (
                                  <SelectItem
                                    key={prov.idProveedor}
                                    value={prov.idProveedor.toString()}
                                    className="text-slate-200 hover:bg-slate-600"
                                  >
                                    <div className="flex flex-col">
                                      <span className={esPredeterminado ? "text-yellow-400 font-semibold" : ""}>
                                        {prov.nombreProveedor}
                                      </span>
                                      <span className="text-sm text-slate-400">
                                        Unitario: ${prov.costoUnitario.toFixed(2)} | Pedido: ${prov.costoPedido.toFixed(2)}
                                      </span>
                                    </div>
                                  </SelectItem>
                                )
                              })}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Resumen de costos */}
                  <div className="mt-6 p-4 bg-slate-700 rounded-lg border border-slate-600">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-green-400" />
                        <span className="text-slate-300 font-medium">Subtotal:</span>
                      </div>
                      <span className="text-green-400 font-bold text-lg">${subtotalActual.toFixed(2)}</span>
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
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
          </Link>
          <Button
            onClick={handleConfirmar}
            disabled={isSaving}
            className="bg-yellow-600 hover:bg-yellow-700 text-slate-900 font-semibold flex items-center gap-2 px-6 py-2"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                Guardando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Guardar Cambios
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}