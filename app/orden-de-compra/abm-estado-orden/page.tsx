"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Plus, Edit, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DTOABMEstadoOrdenCompra } from "@/types"

// Datos de ejemplo para estados de orden de compra
const estadosData = [
  {
    id: 1,
    nombreEstado: "Pendiente",
    fechaHoraBaja: null,
  },
  {
    id: 2,
    nombreEstado: "En proceso",
    fechaHoraBaja: null,
  },
  {
    id: 3,
    nombreEstado: "Enviada",
    fechaHoraBaja: null,
  },
  {
    id: 4,
    nombreEstado: "Recibida",
    fechaHoraBaja: null,
  },
  {
    id: 5,
    nombreEstado: "Cancelada",
    fechaHoraBaja: null,
  },
  {
    id: 6,
    nombreEstado: "En revisión",
    fechaHoraBaja: "2024-02-15 10:30:00",
  },
  {
    id: 7,
    nombreEstado: "Aprobación pendiente",
    fechaHoraBaja: "2024-01-20 14:45:00",
  },
  {
    id: 8,
    nombreEstado: "Rechazada",
    fechaHoraBaja: null,
  },
  {
    id: 9,
    nombreEstado: "Pago pendiente",
    fechaHoraBaja: "2024-03-05 09:15:00",
  },
]

export default function ABMEstadoOrdenPage() {

  const [showOnlyActive, setShowOnlyActive] = useState(false)
  const [estadosOrdenCompra, setEstadosOrdenCompra] = useState<DTOABMEstadoOrdenCompra[] | null>(null)

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // Filtrar estados según el checkbox
  const filteredEstados = showOnlyActive ? estadosOrdenCompra?.filter((estado) => estado.fhBajaEOC === null) : estadosOrdenCompra


    //fetch estados
    useEffect(() => {
        const fetchEstados = async () => {
            const vigentes = showOnlyActive ? 1 : 0;
            const response = await fetch(`${API_URL}/ABMEstadoOrdenCompra/getEstados?soloVigentes=${vigentes}`)

            if (!response.ok) {
                console.error("Error al obtener los estados de orden de compra");
                return;
            }
            const data: DTOABMEstadoOrdenCompra[] = await response.json();
            setEstadosOrdenCompra(data);
            console.log("Estados de orden de compra obtenidos:", data);
        }

        fetchEstados();

    },[])

  const handleEliminar = (id: number, nombreEstado: string) => {
    // Aquí iría la lógica para eliminar/dar de baja el estado
    console.log(`Eliminar estado ${id}: ${nombreEstado}`)
    // Por ahora solo mostramos un alert
    alert(`Funcionalidad de eliminar estado "${nombreEstado}" será implementada`)
  }

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
                  {(filteredEstados ?? []).length > 0 ? (
                    (filteredEstados ?? []).map((estado, index) => (
                      <TableRow
                        key={estado.idEOC}
                        className={`
                          ${index % 2 === 0 ? "bg-slate-800" : "bg-slate-750"} 
                          hover:bg-slate-700 border-slate-600 transition-colors
                        `}
                      >
                        <TableCell className="text-slate-300 font-mono">{estado.idEOC}</TableCell>
                        <TableCell className="text-slate-100 font-medium">{estado.nombreEstado}</TableCell>
                        <TableCell className={`${estado.fhBajaEOC ? "text-red-400" : "text-green-400"}`}>
                          {estado.fhBajaEOC || "Activo"}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              onClick={() => handleModificar(estado.idEOC, estado.nombreEstado)}
                              size="sm"
                              variant="outline"
                              className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600 hover:border-blue-700 flex items-center gap-1"
                            >
                              <Edit className="w-3 h-3" />
                              Modificar
                            </Button>
                            <Button
                              onClick={() => handleEliminar(estado.idEOC, estado.nombreEstado)}
                              size="sm"
                              variant="outline"
                              className="bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700 flex items-center gap-1"
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
                        {showOnlyActive ? "No hay estados vigentes" : "No hay estados registrados"}
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
                  <span className="text-slate-300">Total mostrado: </span>
                  <span className="text-purple-400 font-semibold">{filteredEstados?.length ?? 0}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                  <span className="text-slate-300">Estados activos: </span>
                  <span className="text-blue-400 font-semibold">
                    {estadosData.filter((p) => p.fechaHoraBaja === null).length}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <span className="text-slate-300">Estados dados de baja: </span>
                  <span className="text-red-400 font-semibold">
                    {estadosData.filter((p) => p.fechaHoraBaja !== null).length}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
