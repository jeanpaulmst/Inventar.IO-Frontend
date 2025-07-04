"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import Link from "next/link"
import { useRouter } from "next/navigation"

// Interfaz actualizada para el modelo de inventario
interface DTOABMModeloInventario {
  idMI: number
  nombreMI: string
  fhBajaMI: string | null
}

export default function ABMModeloInventarioPage() {
  const [modelos, setModelos] = useState<DTOABMModeloInventario[]>([])
  const [todosLosModelos, setTodosLosModelos] = useState<DTOABMModeloInventario[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showOnlyActive, setShowOnlyActive] = useState(true)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedModelo, setSelectedModelo] = useState<DTOABMModeloInventario | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Función para obtener modelos del backend
  const fetchModelos = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `http://localhost:8080/ABMModeloInventario/getModelos?soloVigentes=${showOnlyActive}`,
      )

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const data: DTOABMModeloInventario[] = await response.json()
      setModelos(data)
      
      // Si estamos mostrando solo vigentes, también obtener todos para las estadísticas
      if (showOnlyActive) {
        const responseTodos = await fetch(
          `http://localhost:8080/ABMModeloInventario/getModelos?soloVigentes=false`,
        )
        if (responseTodos.ok) {
          const todosLosData: DTOABMModeloInventario[] = await responseTodos.json()
          setTodosLosModelos(todosLosData)
        }
      } else {
        // Si estamos mostrando todos, usar los mismos datos para las estadísticas
        setTodosLosModelos(data)
      }
      
      setError(null)
    } catch (err) {
      console.error("Error al obtener modelos de inventario:", err)
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setLoading(false)
    }
  }

  // Cargar modelos al montar el componente y cuando cambie el filtro
  useEffect(() => {
    fetchModelos()
  }, [showOnlyActive])

  const handleEliminar = (modelo: DTOABMModeloInventario) => {
    setSelectedModelo(modelo)
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = async () => {
    if (!selectedModelo) return

    setIsDeleting(true)
    try {
      const response = await fetch(`http://localhost:8080/ABMModeloInventario/bajaModelo?idModeloInventario=${selectedModelo.idMI}`, {
        method: "POST",
      })

      if (response.ok) {
        alert(`Modelo de inventario "${selectedModelo.nombreMI}" dado de baja exitosamente`)
        // Recargar la lista de modelos
        await fetchModelos()
      } else {
        alert(
          `No se puede dar de baja el modelo de inventario "${selectedModelo.nombreMI}".\n\n` +
            `El modelo puede estar siendo utilizado por artículos existentes.`,
        )
      }
    } catch (error) {
      console.error("Error al dar de baja modelo:", error)
      alert(`Error al dar de baja el modelo: ${error instanceof Error ? error.message : "Error desconocido"}`)
    } finally {
      setIsDeleting(false)
      setShowDeleteModal(false)
      setSelectedModelo(null)
    }
  }

  const router = useRouter()

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

  const handleModificar = (idMI: number) => {
    // Buscar el modelo en todosLosModelos para verificar su estado
    const modelo = todosLosModelos.find(m => m.idMI === idMI)
    
    if (modelo && modelo.fhBajaMI !== null) {
      alert(`No se puede modificar el modelo "${modelo.nombreMI}" porque está dado de baja.`)
      return
    }
    
    router.push(`/maestro-articulos/ABMModeloInventario/ModificarModeloInventario/${idMI}`)
  }

  // Calcular estadísticas
  const totalModelos = todosLosModelos.length
  const modelosActivos = todosLosModelos.filter((modelo) => modelo.fhBajaMI === null).length
  const modelosDadosBaja = todosLosModelos.filter((modelo) => modelo.fhBajaMI !== null).length

  if (loading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-400">Cargando modelos de inventario...</p>
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
            <h3 className="text-xl font-semibold text-slate-300 mb-2">Error al cargar modelos</h3>
            <p className="text-slate-400 mb-4">{error}</p>
            <Button onClick={fetchModelos} className="bg-blue-600 hover:bg-blue-700">
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
          <h1 className="text-3xl font-bold text-slate-100">ABM Modelo de Inventario</h1>
          <p className="text-slate-400">Administrar modelos de inventario del sistema</p>
        </div>

        <Link href="/maestro-articulos/ABMModeloInventario/AltaModeloInventario">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Alta Modelo de Inventario
          </Button>
        </Link>
      </div>

      {/* Filtros */}
      <div className="flex items-center gap-3 mb-6">
        <Checkbox
          id="show-active"
          checked={showOnlyActive}
          onCheckedChange={(checked) => setShowOnlyActive(checked as boolean)}
          className="border-slate-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
        />
        <label htmlFor="show-active" className="text-slate-300 cursor-pointer select-none">
          Mostrar solo modelos vigentes
        </label>
      </div>

      {/* Tabla de modelos */}
      <Card className="bg-slate-800 border-slate-700 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-blue-900 to-slate-800 rounded-t-lg">
          <CardTitle className="text-2xl text-blue-100 flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            Lista de Modelos de Inventario
            {showOnlyActive && <span className="text-sm font-normal text-blue-200 ml-2">(Solo vigentes)</span>}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="rounded-lg overflow-hidden border border-slate-700">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-700 hover:bg-slate-700 border-slate-600">
                  <TableHead className="text-blue-200 font-semibold">ID</TableHead>
                  <TableHead className="text-blue-200 font-semibold">Nombre</TableHead>
                  <TableHead className="text-blue-200 font-semibold">Fecha Baja</TableHead>
                  <TableHead className="text-blue-200 font-semibold text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {modelos.length > 0 ? (
                  modelos.map((modelo, index) => (
                    <TableRow
                      key={modelo.idMI}
                      className={`
                          ${index % 2 === 0 ? "bg-slate-800" : "bg-slate-750"} 
                          hover:bg-slate-700 border-slate-600 transition-colors
                        `}
                    >
                      <TableCell className="text-slate-300 font-mono">{modelo.idMI}</TableCell>
                      <TableCell className="text-slate-100 font-medium">{modelo.nombreMI}</TableCell>
                      <TableCell className={`${modelo.fhBajaMI ? "text-red-400" : "text-green-400"}`}>
                        {formatFechaBaja(modelo.fhBajaMI)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            onClick={modelo.fhBajaMI ? undefined : () => handleModificar(modelo.idMI)}
                            size="sm"
                            variant="outline"
                            className={`${
                              modelo.fhBajaMI !== null 
                                ? "bg-slate-600 text-slate-400 border-slate-600 cursor-not-allowed" 
                                : "bg-blue-600 hover:bg-blue-700 text-white border-blue-600 hover:border-blue-700"
                            } flex items-center gap-1`}
                            title={modelo.fhBajaMI !== null ? "No se puede modificar un modelo dado de baja" : ""}
                          >
                            <Edit className="w-3 h-3" />
                            Modificar
                          </Button>
                          <Button
                            onClick={modelo.fhBajaMI ? undefined : () => handleEliminar(modelo)}
                            size="sm"
                            variant="outline"
                            className={`${
                              modelo.fhBajaMI !== null 
                                ? "bg-slate-600 text-slate-400 border-slate-600 cursor-not-allowed" 
                                : "bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700"
                            } flex items-center gap-1`}
                            title={modelo.fhBajaMI !== null ? "Este modelo ya está dado de baja" : ""}
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
                    <TableCell colSpan={4} className="text-center text-slate-400 py-8">
                      {showOnlyActive ? "No hay modelos vigentes" : "No hay modelos registrados"}
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
                <span className="text-blue-400 font-semibold">{totalModelos}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-slate-300">Modelos activos: </span>
                <span className="text-green-400 font-semibold">{modelosActivos}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <span className="text-slate-300">Modelos dados de baja: </span>
                <span className="text-red-400 font-semibold">{modelosDadosBaja}</span>
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
              Confirmar Baja de Modelo
            </DialogTitle>
            <DialogDescription className="text-slate-300">
              ¿Está seguro que desea dar de baja el siguiente modelo de inventario?
            </DialogDescription>
          </DialogHeader>

          {selectedModelo && (
            <div className="py-4">
              <div className="bg-slate-700 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">ID:</span>
                  <span className="text-slate-100 font-mono">{selectedModelo.idMI}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Nombre:</span>
                  <span className="text-slate-100 font-medium">{selectedModelo.nombreMI}</span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-600/30 rounded-lg">
                <p className="text-yellow-200 text-sm">
                  <strong>Nota:</strong> No se podrá dar de baja si el modelo está siendo utilizado por artículos
                  existentes.
                </p>
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
