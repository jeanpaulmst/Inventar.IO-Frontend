"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, RefreshCw, Package, Users, Settings, Edit, Trash2, X, Save } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"

// Tipos
interface Articulo {
  id: number
  costoAlmacenamiento: number
  demanda: number
  descripcionArt: string
  fhBajaArticulo: Date | null
  inventarioMaxArticulo: number
  nombre: string
  precioUnitario: number
  proximaRevision: Date | null
  puntoPedido: number
  stock: number
  tiempoFijo: number
}

interface Proveedor {
  id: number
  nombreProveedor: string
  fhBajaProveedor: string | null
}

interface ModeloInventario {
  id: number
  nombreModelo: string
  fhBajaModeloInventario: Date | null
}

interface ArticuloProveedor {
  id: number
  costoPedido: number
  fhAsignacion: string
  fechaBaja: string | null
  demoraEntrega: number
  isPredeterminado: boolean
  costoUnitario: number
  nivelServicio: number
  stockSeguridad: number | null
  loteOptimo: number | null
  articulo: Articulo
  proveedor: Proveedor
  modeloInventario: ModeloInventario
}

interface DTOAsignarProveedor {
  id?: number
  articuloId: number
  proveedorId: number
  modeloInventarioId: number
  costoPedido: number
  costoUnitario: number
  demoraEntrega: number
  isPredeterminado: boolean
  stockSeguridad: number
  nivelServicio: number
  proximaRevision?: Date
  tiempoFijo?: number
}

export default function ListarArticuloProveedorPage() {
  const [articuloProveedores, setArticuloProveedores] = useState<ArticuloProveedor[]>([])
  const [articulos, setArticulos] = useState<Articulo[]>([])
  const [proveedores, setProveedores] = useState<Proveedor[]>([])
  const [modelosInventario, setModelosInventario] = useState<ModeloInventario[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  
  // Estados para modificar
  const [editingArticuloProveedor, setEditingArticuloProveedor] = useState<ArticuloProveedor | null>(null)
  const [editForm, setEditForm] = useState<DTOAsignarProveedor>({
    articuloId: 0,
    proveedorId: 0,
    modeloInventarioId: 0,
    costoPedido: 0,
    costoUnitario: 0,
    demoraEntrega: 0,
    isPredeterminado: false,
    stockSeguridad: 0,
    nivelServicio: 0,
    tiempoFijo: 0,
  })
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const API_URL = process.env.NEXT_PUBLIC_API_URL

  // Cargar datos desde la API
  const fetchArticuloProveedores = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`${API_URL}/asignarProveedor/getAll`)
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const data: ArticuloProveedor[] = await response.json()
      setArticuloProveedores(data || [])
    } catch (err) {
      console.error("Error al cargar artículos proveedores:", err)
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setLoading(false)
    }
  }

  // Cargar artículos
  const fetchArticulos = async () => {
    try {
      const response = await fetch(`${API_URL}/ABMArticulo/getAll`)
      if (response.ok) {
        const data = await response.json()
        setArticulos(data || [])
      }
    } catch (err) {
      console.error("Error al cargar artículos:", err)
    }
  }

  // Cargar proveedores
  const fetchProveedores = async () => {
    try {
      const response = await fetch(`${API_URL}/ABMProveedor/getProveedores?soloVigentes=0`)
      if (response.ok) {
        const data = await response.json()
        setProveedores(data || [])
      }
    } catch (err) {
      console.error("Error al cargar proveedores:", err)
    }
  }

  // Cargar modelos de inventario
  const fetchModelosInventario = async () => {
    try {
      const response = await fetch(`${API_URL}/ABMModeloInventario/getModelos`)
      if (response.ok) {
        const data = await response.json()
        setModelosInventario(data || [])
      }
    } catch (err) {
      console.error("Error al cargar modelos de inventario:", err)
    }
  }

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchArticuloProveedores()
    fetchArticulos()
    fetchProveedores()
    fetchModelosInventario()
  }, [API_URL])

  // Función para refrescar datos
  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchArticuloProveedores()
    setRefreshing(false)
  }

  // Función para abrir modal de edición
  const handleEdit = (articuloProveedor: ArticuloProveedor) => {
    setEditingArticuloProveedor(articuloProveedor)
    const dto = {
        id: articuloProveedor.id,
        articuloId: articuloProveedor.articulo.id,
        proveedorId: articuloProveedor.proveedor.id,
        modeloInventarioId: articuloProveedor.modeloInventario.id,
        costoPedido: articuloProveedor.costoPedido,
        costoUnitario: articuloProveedor.costoUnitario,
        demoraEntrega: articuloProveedor.demoraEntrega,
        isPredeterminado: articuloProveedor.isPredeterminado,
        stockSeguridad: articuloProveedor.stockSeguridad || 0,
        nivelServicio: articuloProveedor.nivelServicio,
        proximaRevision: articuloProveedor.articulo.proximaRevision || undefined,
        tiempoFijo: articuloProveedor.articulo.tiempoFijo || 0,
      }
    setEditForm(dto)
    setIsEditModalOpen(true)
  }

  // Función para guardar cambios
  const handleSaveEdit = async () => {
    try {
      const response = await fetch(`${API_URL}/asignarProveedor/modificar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      toast.success("Asignación modificada exitosamente")
      setIsEditModalOpen(false)
      setEditingArticuloProveedor(null)
      await fetchArticuloProveedores() // Recargar datos
    } catch (err) {
      console.error("Error al modificar:", err)
      toast.error(err instanceof Error ? err.message : "Error al modificar")
    }
  }

  // Función para eliminar
  const handleDelete = async (id: number) => {
    if (!confirm("¿Está seguro de que desea eliminar esta asignación?")) {
      return
    }

    try {
      setIsDeleting(true)
      const response = await fetch(`${API_URL}/asignarProveedor/eliminar/${id}`, {
        method: 'PUT',
      })

      if (!response.ok) {
        // Intentar obtener el mensaje de error del backend
        let errorMessage = `Error ${response.status}: ${response.statusText}`
        
        // Intentar leer el cuerpo de la respuesta como texto primero
        const responseText = await response.text()
        console.log('Response text:', responseText)
        
        if (responseText) {
          try {
            // Intentar parsear como JSON
            const errorData = JSON.parse(responseText)
            if (errorData.message) {
              errorMessage = errorData.message
            } else if (errorData.mensaje) {
              errorMessage = errorData.mensaje
            } else if (errorData.error) {
              errorMessage = errorData.error
            } else if (errorData.detail) {
              errorMessage = errorData.detail
            }
          } catch (e) {
            // Si no es JSON, usar el texto directamente
            errorMessage = responseText
          }
        }
        
        alert(errorMessage)
      }

      toast.success("Asignación eliminada exitosamente")
      await fetchArticuloProveedores() // Recargar datos
    } catch (err) {
      console.error("Error al eliminar:", err)
      toast.error(err instanceof Error ? err.message : "Error al eliminar")
    } finally {
      setIsDeleting(false)
    }
  }

  // Formatear fecha para mostrar
  const formatearFecha = (fechaString: string | null) => {
    if (!fechaString) return "-"
    const fecha = new Date(fechaString)
    return fecha.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-400">Cargando asignaciones...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-400 text-2xl">⚠</span>
            </div>
            <h3 className="text-xl font-semibold text-slate-300 mb-2">Error al cargar asignaciones</h3>
            <p className="text-slate-400 mb-4">{error}</p>
            <Button onClick={handleRefresh} className="bg-blue-600 hover:bg-blue-700">
              <RefreshCw className="w-4 h-4 mr-2" />
              Reintentar
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/maestro-articulos"
          className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a Maestro Artículos
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Artículos Proveedores</h1>
          <p className="text-slate-400">Gestión de asignaciones de artículos a proveedores</p>
        </div>
      </div>

      {/* Botón de acción */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2">
          <Button 
            onClick={handleRefresh} 
            disabled={refreshing}
            variant="outline" 
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Actualizando...' : 'Actualizar'}
          </Button>
        </div>
      </div>

      {/* Tabla de asignaciones */}
      <Card className="bg-slate-800 border-slate-700 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-blue-900 to-slate-800 rounded-t-lg">
          <CardTitle className="text-2xl text-blue-100 flex items-center gap-2">
            <Package className="w-5 h-5" />
            Asignaciones de Artículos a Proveedores
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {articuloProveedores.length > 0 ? (
            <div className="rounded-lg overflow-hidden border border-slate-700 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-700 hover:bg-slate-700 border-slate-600">
                    <TableHead className="text-blue-200 font-semibold">Artículo</TableHead>
                    <TableHead className="text-blue-200 font-semibold">Proveedor</TableHead>
                    <TableHead className="text-blue-200 font-semibold">Modelo</TableHead>
                    <TableHead className="text-blue-200 font-semibold">Costo Unitario</TableHead>
                    <TableHead className="text-blue-200 font-semibold">Costo Pedido</TableHead>
                    <TableHead className="text-blue-200 font-semibold">Demora (días)</TableHead>
                    <TableHead className="text-blue-200 font-semibold">Nivel Servicio</TableHead>
                    <TableHead className="text-blue-200 font-semibold">Stock Seguridad</TableHead>
                    <TableHead className="text-blue-200 font-semibold">Lote Óptimo</TableHead>
                    <TableHead className="text-blue-200 font-semibold">Estado</TableHead>
                    <TableHead className="text-blue-200 font-semibold">Predeterminado</TableHead>
                    <TableHead className="text-blue-200 font-semibold">Fecha Asignación</TableHead>
                    <TableHead className="text-blue-200 font-semibold">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {articuloProveedores.map((ap, index) => (
                    <TableRow
                      key={ap.id}
                      className={`
                        ${index % 2 === 0 ? "bg-slate-800" : "bg-slate-750"} 
                        hover:bg-slate-700 border-slate-600 transition-colors
                      `}
                    >
                      <TableCell className="min-w-[200px]">
                        <div>
                          <p className="text-slate-100 font-medium">{ap.articulo.nombre}</p>
                          <p className="text-slate-400 text-sm">ID: {ap.articulo.id}</p>
                        </div>
                      </TableCell>
                      <TableCell className="min-w-[180px]">
                        <div>
                          <p className="text-slate-100 font-medium">{ap.proveedor.nombreProveedor}</p>
                          <p className="text-slate-400 text-sm">ID: {ap.proveedor.id}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-purple-600 text-white hover:bg-purple-700">
                          {ap.modeloInventario.nombreModelo}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-green-400 font-semibold">
                        ${ap.costoUnitario.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-blue-400 font-semibold">
                        ${ap.costoPedido.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-orange-400 font-semibold">
                        {ap.demoraEntrega} días
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-blue-600 text-white hover:bg-blue-700">
                          {ap.nivelServicio}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {ap.stockSeguridad !== null ? (
                          <span className="text-slate-300">{ap.stockSeguridad}</span>
                        ) : (
                          <span className="text-slate-500">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {ap.loteOptimo !== null ? (
                          <span className="text-slate-300">{ap.loteOptimo}</span>
                        ) : (
                          <span className="text-slate-500">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={ap.fechaBaja 
                            ? "bg-red-600 text-white hover:bg-red-700" 
                            : "bg-green-600 text-white hover:bg-green-700"
                          }
                        >
                          {ap.fechaBaja ? 'Inactivo' : 'Activo'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={ap.isPredeterminado 
                            ? "bg-yellow-600 text-slate-900 hover:bg-yellow-700" 
                            : "bg-slate-600 text-white hover:bg-slate-700"
                          }
                        >
                          {ap.isPredeterminado ? 'Sí' : 'No'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-300 text-sm">
                        {formatearFecha(ap.fhAsignacion)}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(ap)}
                            className="border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white"
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(ap.id)}
                            disabled={isDeleting}
                            className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8">
              <Package className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-300 mb-2">No hay asignaciones registradas</h3>
              <p className="text-slate-400 mb-4">
                Comience creando su primera asignación de artículo a proveedor.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Edición */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="bg-slate-800 border-slate-700 max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl text-slate-100 flex items-center gap-2">
              <Edit className="w-5 h-5" />
              Modificar Asignación
            </DialogTitle>
          </DialogHeader>
          
          {editingArticuloProveedor && (
            <div className="space-y-6">
              {/* Información del artículo */}
              <div className="bg-slate-750 p-4 rounded-lg">
                <h4 className="text-slate-200 font-semibold mb-2">Artículo: {editingArticuloProveedor.articulo.nombre}</h4>
                <p className="text-slate-400 text-sm">ID: {editingArticuloProveedor.articulo.id}</p>
              </div>

              {/* Campos editables */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="costoPedido" className="text-slate-300">Costo de Pedido</Label>
                  <Input
                    id="costoPedido"
                    type="number"
                    step="0.01"
                    value={editForm.costoPedido}
                    onChange={(e) => setEditForm({...editForm, costoPedido: parseFloat(e.target.value) || 0})}
                    className="bg-slate-700 border-slate-600 text-slate-100"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="costoUnitario" className="text-slate-300">Costo Unitario</Label>
                  <Input
                    id="costoUnitario"
                    type="number"
                    step="0.01"
                    value={editForm.costoUnitario}
                    onChange={(e) => setEditForm({...editForm, costoUnitario: parseFloat(e.target.value) || 0})}
                    className="bg-slate-700 border-slate-600 text-slate-100"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="demoraEntrega" className="text-slate-300">Demora de Entrega (días)</Label>
                  <Input
                    id="demoraEntrega"
                    type="number"
                    value={editForm.demoraEntrega}
                    onChange={(e) => setEditForm({...editForm, demoraEntrega: parseInt(e.target.value) || 0})}
                    className="bg-slate-700 border-slate-600 text-slate-100"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nivelServicio" className="text-slate-300">Nivel de Servicio (%)</Label>
                  <Input
                    id="nivelServicio"
                    type="number"
                    step="0.1"
                    value={editForm.nivelServicio}
                    onChange={(e) => setEditForm({...editForm, nivelServicio: parseFloat(e.target.value) || 0})}
                    className="bg-slate-700 border-slate-600 text-slate-100"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stockSeguridad" className="text-slate-300">Stock de Seguridad</Label>
                  <Input
                    id="stockSeguridad"
                    type="number"
                    value={editForm.stockSeguridad}
                    onChange={(e) => setEditForm({...editForm, stockSeguridad: parseInt(e.target.value) || 0})}
                    className="bg-slate-700 border-slate-600 text-slate-100"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="isPredeterminado" className="text-slate-300">Predeterminado</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isPredeterminado"
                      checked={editForm.isPredeterminado}
                      onCheckedChange={(checked) => setEditForm({...editForm, isPredeterminado: checked})}
                    />
                    <span className="text-slate-300 text-sm">
                      {editForm.isPredeterminado ? 'Sí' : 'No'}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tiempoFijo" className="text-slate-300">Tiempo Fijo</Label>
                  <Input
                    id="tiempoFijo"
                    type="number"
                    value={editForm.tiempoFijo || 0}
                    onChange={(e) => setEditForm({...editForm, tiempoFijo: parseInt(e.target.value) || 0})}
                    className="bg-slate-700 border-slate-600 text-slate-100"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="proximaRevision" className="text-slate-300">Próxima Revisión</Label>
                  <Input
                    id="proximaRevision"
                    type="datetime-local"
                    value={editForm.proximaRevision ? new Date(editForm.proximaRevision).toISOString().slice(0, 16) : ''}
                    onChange={(e) => {
                      const value = e.target.value
                      setEditForm({
                        ...editForm, 
                        proximaRevision: value ? new Date(value) : undefined
                      })
                    }}
                    className="bg-slate-700 border-slate-600 text-slate-100"
                  />
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-600">
                <Button
                  variant="outline"
                  onClick={() => setIsEditModalOpen(false)}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancelar
                </Button>
                <Button
                  onClick={handleSaveEdit}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Guardar Cambios
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
} 