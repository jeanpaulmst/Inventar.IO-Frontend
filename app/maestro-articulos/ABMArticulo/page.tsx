"use client"
import { useState, useEffect } from "react"
import { Plus, Edit, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Link from "next/link"
import { useRouter } from "next/navigation"

// Tipo para el artículo
interface Articulo {
  id: number
  costoAlmacenamiento: number
  descripcionArt: string
  fhBajaArticulo: string | null
  inventarioMaxArticulo: number
  nombre: string
  precioUnitario: number
  stock: number
  proveedorPredeterminado?: number // ID del proveedor predeterminado
}

// Tipo para el proveedor
interface Proveedor {
  idProveedor: number
  nombreProveedor: string
  fhBajaProveedor: string | null
}

export default function ABMArticuloPage() {
  const [articulos, setArticulos] = useState<Articulo[]>([])
  const [todosLosArticulos, setTodosLosArticulos] = useState<Articulo[]>([])
  const [proveedores, setProveedores] = useState<Proveedor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedArticulo, setSelectedArticulo] = useState<Articulo | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const API_URL = process.env.NEXT_PUBLIC_API_URL

  // Función para obtener artículos del backend
  const fetchArticulos = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/ABMArticulo/getAll?soloVigentes=false`)

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const data: Articulo[] = await response.json()
      setArticulos(data)
      setTodosLosArticulos(data)
      setError(null)
    } catch (err) {
      console.error("Error al obtener artículos:", err)
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setLoading(false)
    }
  }

  // Función para obtener proveedores del backend
  const fetchProveedores = async () => {
    try {
      const response = await fetch(`${API_URL}/ABMProveedor/getProveedores?soloVigentes=true`)

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const data: Proveedor[] = await response.json()
      setProveedores(data)
    } catch (err) {
      console.error("Error al obtener proveedores:", err)
    }
  }

  // Cargar artículos y proveedores al montar el componente
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchArticulos(), fetchProveedores()])
    }
    loadData()
  }, [])

  const handleEliminar = (articulo: Articulo) => {
    setSelectedArticulo(articulo)
    setShowDeleteModal(true)
  }

  const handleProveedor = (articuloId: number) => {
    router.push(`/maestro-articulos/ABMArticulo/AsignarProveedor/${articuloId}`)
  }

  const handleConfirmDelete = async () => {
    if (!selectedArticulo) return

    setIsDeleting(true)
    try {
      const response = await fetch(`${API_URL}/baja/${selectedArticulo.id}`, {
        method: "PUT",
      })

      if (response.ok) {
        alert(`Artículo "${selectedArticulo.nombre}" dado de baja exitosamente`)
        // Recargar la lista de artículos
        await fetchArticulos()
      } else {
        // Si la respuesta no es ok, mostrar mensaje de error específico
        alert(
          `No se puede dar de baja el artículo "${selectedArticulo.nombre}".\n\n` +
            `Motivos posibles:\n` +
            `• El stock es mayor a 0\n` +
            `• El artículo forma parte de una orden de compra\n\n` +
            `Por favor, verifique estos aspectos antes de intentar nuevamente.`,
        )
      }
    } catch (error) {
      console.error("Error al dar de baja artículo:", error)
      alert(`Error al dar de baja el artículo: ${error instanceof Error ? error.message : "Error desconocido"}`)
    } finally {
      setIsDeleting(false)
      setShowDeleteModal(false)
      setSelectedArticulo(null)
    }
  }

  const handleModificar = (id: number) => {
    router.push(`/maestro-articulos/ABMArticulo/ModificarArticulo/${id}`)
  }

  // Calcular estadísticas
  const totalArticulos = articulos.length
  const articulosActivos = articulos.filter((art) => art.fhBajaArticulo === null).length
  const articulosDadosBaja = articulos.filter((art) => art.fhBajaArticulo !== null).length
  const valorTotalInventario = articulos.reduce((total, art) => total + art.precioUnitario * art.stock, 0)

  // Función para formatear la fecha de baja
  const formatFechaBaja = (fechaBaja: string | null) => {
    if (!fechaBaja) return "Activo";
    
    try {
      // Si es un timestamp numérico, convertirlo a Date
      const fecha = typeof fechaBaja === 'number' 
        ? new Date(fechaBaja) 
        : new Date(fechaBaja);
      
      return fecha.toLocaleString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch (error) {
      console.error('Error formateando fecha:', error);
      return fechaBaja; // Devolver el valor original si hay error
    }
  }

  if (loading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-400">Cargando artículos...</p>
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
            <h3 className="text-xl font-semibold text-slate-300 mb-2">Error al cargar artículos</h3>
            <p className="text-slate-400 mb-4">{error}</p>
            <Button onClick={fetchArticulos} className="bg-blue-600 hover:bg-blue-700">
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">ABM Artículo</h1>
          <p className="text-slate-400">Administrar artículos del inventario</p>
        </div>

        <Link href="/maestro-articulos/ABMArticulo/AltaArticulo">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Agregar Artículo
          </Button>
        </Link>
      </div>

      {/* Tabla de artículos */}
      <Card className="bg-slate-800 border-slate-700 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-blue-900 to-slate-800 rounded-t-lg">
          <CardTitle className="text-2xl text-blue-100 flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            Lista de Artículos
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="rounded-lg overflow-hidden border border-slate-700 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-700 hover:bg-slate-700 border-slate-600">
                  <TableHead className="text-blue-200 font-semibold">ID</TableHead>
                  <TableHead className="text-blue-200 font-semibold">Costo Almacenamiento</TableHead>
                  <TableHead className="text-blue-200 font-semibold">Descripción</TableHead>
                  <TableHead className="text-blue-200 font-semibold">Fecha Baja</TableHead>
                  <TableHead className="text-blue-200 font-semibold">Inventario Máximo</TableHead>
                  <TableHead className="text-blue-200 font-semibold">Nombre</TableHead>
                  <TableHead className="text-blue-200 font-semibold">Precio Unitario</TableHead>
                  <TableHead className="text-blue-200 font-semibold">Stock</TableHead>
                  <TableHead className="text-blue-200 font-semibold">Proveedor</TableHead>
                  <TableHead className="text-blue-200 font-semibold text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {articulos.length > 0 ? (
                  articulos.map((articulo, index) => (
                    <TableRow
                      key={articulo.id}
                      className={`
                          ${index % 2 === 0 ? "bg-slate-800" : "bg-slate-750"} 
                          hover:bg-slate-700 border-slate-600 transition-colors
                        `}
                    >
                      <TableCell className="text-slate-300 font-mono">{articulo.id}</TableCell>
                      <TableCell className="text-orange-400 font-semibold">
                        ${articulo.costoAlmacenamiento.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-slate-300 max-w-xs truncate" title={articulo.descripcionArt}>
                        {articulo.descripcionArt}
                      </TableCell>
                      <TableCell className={`${articulo.fhBajaArticulo ? "text-red-400" : "text-green-400"}`}>
                        {formatFechaBaja(articulo.fhBajaArticulo)}
                      </TableCell>
                      <TableCell className="text-purple-400 font-semibold">{articulo.inventarioMaxArticulo}</TableCell>
                      <TableCell className="text-slate-100 font-medium">{articulo.nombre}</TableCell>
                      <TableCell className="text-green-400 font-semibold">
                        ${articulo.precioUnitario.toFixed(2)}
                      </TableCell>
                      <TableCell
                        className={`font-semibold ${
                          articulo.stock === 0
                            ? "text-red-400"
                            : articulo.stock < 20
                              ? "text-yellow-400"
                              : "text-green-400"
                        }`}
                      >
                        {articulo.stock}
                      </TableCell>
                      <TableCell>
                        {articulo.proveedorPredeterminado ? (
                          <span className="text-slate-300">{proveedores.find(p => p.idProveedor === articulo.proveedorPredeterminado)?.nombreProveedor}</span>
                        ) : (
                          <Button
                            onClick={articulo.fhBajaArticulo ? undefined : () => handleProveedor(articulo.id)}
                            size="sm"
                            variant="outline"
                            className={`${
                              articulo.fhBajaArticulo !== null 
                                ? "bg-slate-600 text-slate-400 border-slate-600 cursor-not-allowed" 
                                : "bg-blue-600 hover:bg-blue-700 text-white border-blue-600 hover:border-blue-700"
                            } flex items-center gap-1`}
                            title={articulo.fhBajaArticulo !== null ? "No se puede asignar proveedor a un artículo dado de baja" : ""}
                          >
                            <Edit className="w-3 h-3" />
                            Asignar Proveedor
                          </Button>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            onClick={articulo.fhBajaArticulo ? undefined : () => handleModificar(articulo.id)}
                            size="sm"
                            variant="outline"
                            className={`${
                              articulo.fhBajaArticulo !== null 
                                ? "bg-slate-600 text-slate-400 border-slate-600 cursor-not-allowed" 
                                : "bg-blue-600 hover:bg-blue-700 text-white border-blue-600 hover:border-blue-700"
                            } flex items-center gap-1`}
                            title={articulo.fhBajaArticulo !== null ? "No se puede modificar un artículo dado de baja" : ""}
                          >
                            <Edit className="w-3 h-3" />
                            Modificar
                          </Button>
                          <Button
                            onClick={articulo.fhBajaArticulo ? undefined : () => handleEliminar(articulo)}
                            size="sm"
                            variant="outline"
                            className={`${
                              articulo.fhBajaArticulo !== null 
                                ? "bg-slate-600 text-slate-400 border-slate-600 cursor-not-allowed" 
                                : "bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700"
                            } flex items-center gap-1`}
                            title={articulo.fhBajaArticulo !== null ? "Este artículo ya está dado de baja" : ""}
                          >
                            <Trash2 className="w-3 h-3" />
                            Eliminar
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center text-slate-400 py-8">
                      No hay artículos registrados
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Resumen */}
          <div className="mt-6 p-4 bg-slate-700 rounded-lg border border-slate-600">
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                <span className="text-slate-300">Total en sistema: </span>
                <span className="text-blue-400 font-semibold">{totalArticulos}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-slate-300">Artículos activos: </span>
                <span className="text-green-400 font-semibold">{articulosActivos}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <span className="text-slate-300">Artículos dados de baja: </span>
                <span className="text-red-400 font-semibold">{articulosDadosBaja}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <span className="text-slate-300">Valor total del inventario: </span>
                <span className="text-yellow-400 font-semibold">${valorTotalInventario.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal de confirmación de eliminación */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="bg-slate-800 border-slate-700 text-slate-100">
          <DialogHeader>
            <DialogTitle className="text-red-400 flex items-center gap-2">
              <Trash2 className="w-5 h-5" />
              Confirmar Baja de Artículo
            </DialogTitle>
            <DialogDescription className="text-slate-300">
              ¿Está seguro que desea dar de baja el siguiente artículo?
            </DialogDescription>
          </DialogHeader>

          {selectedArticulo && (
            <div className="py-4">
              <div className="bg-slate-700 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">ID:</span>
                  <span className="text-slate-100 font-mono">{selectedArticulo.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Nombre:</span>
                  <span className="text-slate-100 font-medium">{selectedArticulo.nombre}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Stock actual:</span>
                  <span
                    className={`font-semibold ${selectedArticulo.stock > 0 ? "text-yellow-400" : "text-green-400"}`}
                  >
                    {selectedArticulo.stock}
                  </span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-600/30 rounded-lg">
                <p className="text-yellow-200 text-sm">
                  <strong>Nota:</strong> No se podrá dar de baja si:
                </p>
                <ul className="text-yellow-200 text-sm mt-1 ml-4 list-disc">
                  <li>El stock es mayor a 0</li>
                  <li>El artículo forma parte de una orden de compra</li>
                </ul>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
              disabled={isDeleting}
              className="bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Eliminando...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Confirmar Baja
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
