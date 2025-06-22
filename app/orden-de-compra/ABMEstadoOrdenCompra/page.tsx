"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Plus, Edit, Trash2 } from "lucide-react"
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
import { DTOABMEstadoOrdenCompra } from "@/types"

// Tipo para el estado de orden de compra
interface EstadoOrdenCompra {
  id: number
  nombreEstado: string
  fechaHoraBaja: string | null
}

// Datos de ejemplo (temporal hasta conectar con backend)
const estadosEjemplo: EstadoOrdenCompra[] = [
  {
    id: 1,
    nombreEstado: "Pendiente",
    fechaHoraBaja: null,
  },
  {
    id: 2,
    nombreEstado: "Aprobada",
    fechaHoraBaja: null,
  },
  {
    id: 3,
    nombreEstado: "Rechazada",
    fechaHoraBaja: null,
  },
  {
    id: 4,
    nombreEstado: "En proceso",
    fechaHoraBaja: null,
  },
  {
    id: 5,
    nombreEstado: "Completada",
    fechaHoraBaja: null,
  },
  {
    id: 6,
    nombreEstado: "Cancelada",
    fechaHoraBaja: null,
  },
  {
    id: 7,
    nombreEstado: "En revisión",
    fechaHoraBaja: null,
  },
  {
    id: 8,
    nombreEstado: "Pendiente de pago",
    fechaHoraBaja: null,
  },
  {
    id: 9,
    nombreEstado: "Pago pendiente",
    fechaHoraBaja: "2024-03-05 09:15:00",
  },
]

export default function ABMEstadoOrdenPage() {
  const [estados, setEstados] = useState<EstadoOrdenCompra[]>([]);
  const [todosLosEstados, setTodosLosEstados] = useState<EstadoOrdenCompra[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showOnlyActive, setShowOnlyActive] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEstado, setSelectedEstado] =
    useState<EstadoOrdenCompra | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  // Función para obtener estados del backend
  const fetchEstados = async () => {
    try {
      setLoading(true);
      // TODO: Reemplazar con el endpoint real del backend
      const response = await fetch(
        `http://localhost:8080/ABMEstadoOrdenCompra/getEstados?soloVigentes=${showOnlyActive}`
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const rawData = await response.json();
      const data: EstadoOrdenCompra[] = rawData.map((r: any) => ({
        id: r.idEOC,
        nombreEstado: r.nombreEstado,
        fechaHoraBaja: r.fhBajaEOC,
      }));
      
      setEstados(data);
      
      // Si estamos mostrando solo vigentes, también obtener todos para las estadísticas
      if (showOnlyActive) {
        const responseTodos = await fetch(
          `http://localhost:8080/ABMEstadoOrdenCompra/getEstados?soloVigentes=false`
        );
        if (responseTodos.ok) {
          const rawTodos = await responseTodos.json();
          const todosLosData: EstadoOrdenCompra[] = rawTodos.map((r: any) => ({
            id: r.idEOC,
            nombreEstado: r.nombreEstado,
            fechaHoraBaja: r.fhBajaEOC,
          }));
          setTodosLosEstados(todosLosData);
        }
      } else {
        // Si estamos mostrando todos, usar los mismos datos para las estadísticas
        setTodosLosEstados(data);
      }
      
      setError(null);
    } catch (err) {
      console.error("Error al obtener estados de orden de compra:", err);
      setError(err instanceof Error ? err.message : "Error desconocido");
      // Usar datos de ejemplo si hay error
      setEstados(estadosEjemplo);
      setTodosLosEstados(estadosEjemplo);
    } finally {
      setLoading(false);
    }
  };

  // Cargar estados al montar el componente y cuando cambie el filtro
  useEffect(() => {
    fetchEstados();
  }, [showOnlyActive]);

  // Calcular estadísticas
  const totalEstados = todosLosEstados.length;
  const estadosActivos = todosLosEstados.filter(
    (estado) => estado.fechaHoraBaja === null
  ).length;
  const estadosDadosBaja = todosLosEstados.filter(
    (estado) => estado.fechaHoraBaja !== null
  ).length;

  const handleEliminar = (estado: EstadoOrdenCompra) => {
    setSelectedEstado(estado);
    setShowDeleteModal(true);
  }

  const handleConfirmDelete = async () => {
    if (!selectedEstado) return;

    setIsDeleting(true);
    try {
      const response = await fetch(
        `http://localhost:8080/ABMEstadoOrdenCompra/baja/${selectedEstado.id}`,
        {
          method: "PUT",
        }
      );

      if (response.ok) {
        alert(`Estado "${selectedEstado.nombreEstado}" dado de baja exitosamente`);
        // Recargar la lista de estados
        await fetchEstados();
      } else {
        alert(
          `No se puede dar de baja el estado "${selectedEstado.nombreEstado}".\n\n` +
            `Motivos posibles:\n` +
            `• El estado está siendo utilizado por órdenes de compra\n\n` +
            `Por favor, verifique estos aspectos antes de intentar nuevamente.`
        );
      }
    } catch (error) {
      console.error("Error al dar de baja estado:", error);
      alert(`Error al dar de baja el estado: ${error instanceof Error ? error.message : "Error desconocido"}`);
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setSelectedEstado(null);
    }
  };

  const handleModificar = (id: number, nombreEstado: string) => {
    // Aquí iría la lógica para modificar el estado
    console.log(`Modificar estado ${id}: ${nombreEstado}`)
    // Por ahora solo mostramos un alert
    alert(`Funcionalidad de modificar estado "${nombreEstado}" será implementada`)
  }

  const handleNuevoEstado = () => {
    // Aquí iría la lógica para crear un nuevo estado
    console.log("Crear nuevo estado")
    alert("Funcionalidad de crear nuevo estado será implementada")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100">
        <div className="container mx-auto py-8 px-4">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-400">Cargando estados...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100">
        <div className="container mx-auto py-8 px-4">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-red-400 text-2xl">⚠</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-300 mb-2">Error al cargar estados</h3>
              <p className="text-slate-400 mb-4">{error}</p>
              <Button onClick={fetchEstados} className="bg-purple-600 hover:bg-purple-700">
                Reintentar
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

   return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <div className="container mx-auto py-8 px-4">
        {/* Header with back button */}
        <div className="mb-8">
          <Link
            href="/orden-de-compra"
            className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a Orden de Compra
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h1 className="text-4xl font-bold text-slate-100">ABM Estado Orden de Compra</h1>

            <Button
              onClick={handleNuevoEstado}
              className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Nuevo Estado
            </Button>
          </div>

          {/* Filtros */}
          <div className="flex items-center gap-3 mb-6">
            <Checkbox
              id="show-active"
              checked={showOnlyActive}
              onCheckedChange={() => setShowOnlyActive(!showOnlyActive)}
              className="border-slate-600 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
            />
            <label htmlFor="show-active" className="text-slate-300 cursor-pointer select-none">
              Mostrar solo estados vigentes
            </label>
          </div>
        </div>

        {/* Tabla de estados */}
        <Card className="bg-slate-800 border-slate-700 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-purple-900 to-slate-800 rounded-t-lg">
            <CardTitle className="text-2xl text-purple-100 flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              Lista de Estados de Orden de Compra
              {showOnlyActive && <span className="text-sm font-normal text-purple-200 ml-2">(Solo vigentes)</span>}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="rounded-lg overflow-hidden border border-slate-700">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-700 hover:bg-slate-700 border-slate-600">
                    <TableHead className="text-purple-200 font-semibold">ID</TableHead>
                    <TableHead className="text-purple-200 font-semibold">Nombre Estado</TableHead>
                    <TableHead className="text-purple-200 font-semibold">Fecha Hora Baja</TableHead>
                    <TableHead className="text-purple-200 font-semibold text-center">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {estados.length > 0 ? (
                    estados.map((estado, index) => (
                      <TableRow
                        key={estado.id}
                        className={`
                          ${index % 2 === 0 ? "bg-slate-800" : "bg-slate-750"} 
                          hover:bg-slate-700 border-slate-600 transition-colors
                        `}
                      >
                        <TableCell className="text-slate-300 font-mono">{estado.id}</TableCell>
                        <TableCell className="text-slate-100 font-medium">{estado.nombreEstado}</TableCell>
                        <TableCell className={`${estado.fechaHoraBaja ? "text-red-400" : "text-green-400"}`}>
                          {formatFechaBaja(estado.fechaHoraBaja)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              onClick={estado.fechaHoraBaja ? undefined : () => handleModificar(estado.id, estado.nombreEstado)}
                              size="sm"
                              variant="outline"
                              className={`${
                                estado.fechaHoraBaja !== null 
                                  ? "bg-slate-600 text-slate-400 border-slate-600 cursor-not-allowed" 
                                  : "bg-purple-600 hover:bg-purple-700 text-white border-purple-600 hover:border-purple-700"
                              } flex items-center gap-1`}
                              title={estado.fechaHoraBaja !== null ? "No se puede modificar un estado dado de baja" : ""}
                            >
                              <Edit className="w-3 h-3" />
                              Modificar
                            </Button>
                            <Button
                              onClick={estado.fechaHoraBaja ? undefined : () => handleEliminar(estado)}
                              size="sm"
                              variant="outline"
                              className={`${
                                estado.fechaHoraBaja !== null 
                                  ? "bg-slate-600 text-slate-400 border-slate-600 cursor-not-allowed" 
                                  : "bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700"
                              } flex items-center gap-1`}
                              title={estado.fechaHoraBaja !== null ? "Este estado ya está dado de baja" : ""}
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
                        No hay estados registrados
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
                  <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                  <span className="text-slate-300">Total en sistema: </span>
                  <span className="text-purple-400 font-semibold">{totalEstados}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="text-slate-300">Estados activos: </span>
                  <span className="text-green-400 font-semibold">{estadosActivos}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <span className="text-slate-300">Estados dados de baja: </span>
                  <span className="text-red-400 font-semibold">{estadosDadosBaja}</span>
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
                Confirmar Baja de Estado
              </DialogTitle>
              <DialogDescription className="text-slate-300">
                ¿Está seguro que desea dar de baja el siguiente estado?
              </DialogDescription>
            </DialogHeader>

            {selectedEstado && (
              <div className="py-4">
                <div className="bg-slate-700 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">ID:</span>
                    <span className="text-slate-100 font-mono">{selectedEstado.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Nombre:</span>
                    <span className="text-slate-100 font-medium">{selectedEstado.nombreEstado}</span>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-600/30 rounded-lg">
                  <p className="text-yellow-200 text-sm">
                    <strong>Nota:</strong> No se podrá dar de baja si:
                  </p>
                  <ul className="text-yellow-200 text-sm mt-1 ml-4 list-disc">
                    <li>El estado está siendo utilizado por órdenes de compra</li>
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
    </div>
  )
}
