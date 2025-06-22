"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Plus, Trash2, Save, ShoppingCart, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

// Tipos
interface Articulo {
  id: number
  costoAlmacenamiento: number
  demanda: number
  descripcionArt: string
  inventarioMaxArticulo: number
  nombre: string
  precioUnitario: number
  stock: number
}

interface LineaVenta {
  id: string
  articuloId: number
  cantidad: number
  subtotal: number
}

interface DTODetalleGenerarVenta {
  articuloID: number
  cantidad: number
  subTotal: number
}

interface DTOGenerarVenta {
  detalles: DTODetalleGenerarVenta[]
  total: number
}

export default function NuevaVentaPage() {
  const [articulos, setArticulos] = useState<Articulo[]>([])
  const [lineasVenta, setLineasVenta] = useState<LineaVenta[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const API_URL = process.env.NEXT_PUBLIC_API_URL

  // Cargar artículos desde la API
  useEffect(() => {
    const fetchArticulos = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch(`${API_URL}/ABMArticulo/getAll?soloVigentes=true`)
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`)
        }

        const data: Articulo[] = await response.json()
        setArticulos(data || [])
      } catch (err) {
        console.error("Error al cargar artículos:", err)
        setError(err instanceof Error ? err.message : "Error desconocido")
      } finally {
        setLoading(false)
      }
    }

    fetchArticulos()
  }, [API_URL])

  const agregarLinea = () => {
    const nuevaLinea: LineaVenta = {
      id: Date.now().toString(),
      articuloId: 0,
      cantidad: 1,
      subtotal: 0,
    }
    setLineasVenta([...lineasVenta, nuevaLinea])
  }

  const eliminarLinea = (id: string) => {
    setLineasVenta(lineasVenta.filter((linea) => linea.id !== id))
  }

  const actualizarLinea = (id: string, campo: keyof LineaVenta, valor: any) => {
    setLineasVenta(
      lineasVenta.map((linea) => {
        if (linea.id === id) {
          const lineaActualizada = { ...linea, [campo]: valor }

          // Calcular subtotal automáticamente si cambia artículo o cantidad
          if (campo === "articuloId" || campo === "cantidad") {
            const articulo = articulos.find((art) => art.id === lineaActualizada.articuloId)
            if (articulo && lineaActualizada.cantidad > 0) {
              lineaActualizada.subtotal = articulo.precioUnitario * lineaActualizada.cantidad
            }
          }

          return lineaActualizada
        }
        return linea
      }),
    )
  }

  const calcularTotal = () => {
    return lineasVenta.reduce((total, linea) => total + linea.subtotal, 0)
  }

  const guardarVenta = async () => {
    if (lineasVenta.length === 0) {
      toast.error("Debe agregar al menos un artículo a la venta")
      return
    }

    // Validar que todas las líneas tengan artículo seleccionado
    const lineasIncompletas = lineasVenta.filter((linea) => linea.articuloId === 0)
    if (lineasIncompletas.length > 0) {
      toast.error("Todas las líneas deben tener un artículo seleccionado")
      return
    }

    // Validar stock disponible
    for (const linea of lineasVenta) {
      const articulo = articulos.find((art) => art.id === linea.articuloId)
      if (articulo && linea.cantidad > articulo.stock) {
        toast.error(`Stock insuficiente para ${articulo.nombre}. Stock disponible: ${articulo.stock}`)
        return
      }
    }

    try {
      setSaving(true)

      // Preparar datos para enviar al backend
      const detalles: DTODetalleGenerarVenta[] = lineasVenta.map(linea => ({
        articuloID: linea.articuloId,
        cantidad: linea.cantidad,
        subTotal: linea.subtotal
      }))

      const ventaData: DTOGenerarVenta = {
        detalles: detalles,
        total: calcularTotal()
      }

      console.log(JSON.stringify(ventaData))

      // Enviar venta al backend
      const response = await fetch(`${API_URL}/generarVenta/nueva`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ventaData),
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      toast.success(`Venta registrada exitosamente! Total: $${calcularTotal().toLocaleString()}`)
      
      // Limpiar formulario y redirigir
      setLineasVenta([])
      router.push('/ventas/GenerarVenta')
      
    } catch (err) {
      console.error("Error al guardar venta:", err)
      toast.error(err instanceof Error ? err.message : "Error al guardar la venta")
    } finally {
      setSaving(false)
    }
  }

  const obtenerArticulo = (articuloId: number) => {
    return articulos.find((art) => art.id === articuloId)
  }

  if (loading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 bg-slate-900 min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-orange-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-400">Cargando artículos...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 bg-slate-900 min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-400 text-2xl">⚠</span>
            </div>
            <h3 className="text-xl font-semibold text-slate-300 mb-2">Error al cargar artículos</h3>
            <p className="text-slate-400 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} className="bg-orange-600 hover:bg-orange-700">
              Reintentar
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 bg-slate-900 min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/ventas/GenerarVenta"
          className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a Generar Venta
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Nueva Venta</h1>
          <p className="text-slate-400">Registrar una nueva venta con múltiples artículos</p>
        </div>
      </div>

      {/* Botón agregar línea */}
      <div className="flex justify-start mb-6">
        <Button onClick={agregarLinea} className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Agregar Artículo
        </Button>
      </div>

      {/* Tabla de líneas de venta */}
      <Card className="bg-slate-800 border-slate-700 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-orange-900 to-slate-800 rounded-t-lg">
          <CardTitle className="text-2xl text-orange-100 flex items-center gap-2">
            <ShoppingCart className="w-6 h-6" />
            Artículos de la Venta
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 bg-slate-800">
          {lineasVenta.length > 0 ? (
            <div className="rounded-lg overflow-hidden border border-slate-700 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-700 hover:bg-slate-700 border-slate-600">
                    <TableHead className="text-orange-200 font-semibold">Artículo</TableHead>
                    <TableHead className="text-orange-200 font-semibold">Precio Unitario</TableHead>
                    <TableHead className="text-orange-200 font-semibold">Cantidad</TableHead>
                    <TableHead className="text-orange-200 font-semibold">Subtotal</TableHead>
                    <TableHead className="text-orange-200 font-semibold text-center">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lineasVenta.map((linea, index) => {
                    const articulo = obtenerArticulo(linea.articuloId)
                    return (
                      <TableRow
                        key={linea.id}
                        className={`
                          ${index % 2 === 0 ? "bg-slate-800" : "bg-slate-750"} 
                          hover:bg-slate-700 border-slate-600 transition-colors
                        `}
                      >
                        <TableCell className="min-w-[250px]">
                          <Select
                            value={linea.articuloId.toString()}
                            onValueChange={(value) => actualizarLinea(linea.id, "articuloId", Number(value))}
                          >
                            <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-100">
                              <SelectValue placeholder="Seleccionar artículo" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-700 border-slate-600">
                              {articulos.map((articulo) => (
                                <SelectItem
                                  key={articulo.id}
                                  value={articulo.id.toString()}
                                  className="text-slate-100 focus:bg-orange-600 focus:text-white"
                                >
                                  {articulo.nombre} (Stock: {articulo.stock})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-green-400 font-semibold">
                          {articulo ? `$${articulo.precioUnitario.toLocaleString()}` : "-"}
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="1"
                            max={articulo?.stock || 999}
                            value={linea.cantidad}
                            onChange={(e) => actualizarLinea(linea.id, "cantidad", Number(e.target.value))}
                            className="bg-slate-700 border-slate-600 text-slate-100 w-20"
                          />
                        </TableCell>
                        <TableCell className="text-blue-400 font-semibold text-lg">
                          ${linea.subtotal.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-center">
                            <Button
                              onClick={() => eliminarLinea(linea.id)}
                              size="sm"
                              variant="destructive"
                              className="bg-red-600 hover:bg-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8">
              <ShoppingCart className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-300 mb-2">No hay artículos en la venta</h3>
              <p className="text-slate-400 mb-4">Agregue artículos usando el botón "Agregar Artículo"</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Card de total */}
      {lineasVenta.length > 0 && (
        <Card className="bg-slate-800 border-slate-700 shadow-xl">
          <CardContent className="p-6 bg-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-4 text-sm text-slate-400">
                  <span>Artículos: {lineasVenta.length}</span>
                  <span>•</span>
                  <span>Cantidad total: {lineasVenta.reduce((total, linea) => total + linea.cantidad, 0)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-medium text-slate-200">Total de la Venta:</span>
                  <span className="text-3xl font-bold text-green-400">${calcularTotal().toLocaleString()}</span>
                </div>
              </div>
              <Button
                onClick={guardarVenta}
                disabled={saving}
                className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 px-6 py-3 text-lg"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Guardar Venta
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
