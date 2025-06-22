"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Plus, Edit, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DTOProveedor } from "@/types"

// Datos de ejemplo para proveedores
const providersData = [
  {
    id: 1,
    nombre: "Electrónica Moderna",
    fechaHoraBaja: null,
  },
  {
    id: 2,
    nombre: "Suministros Oficina Plus",
    fechaHoraBaja: null,
  },
  {
    id: 3,
    nombre: "Muebles Confort",
    fechaHoraBaja: null,
  },
  {
    id: 4,
    nombre: "Tecnología Avanzada S.A.",
    fechaHoraBaja: "2024-01-15 14:30:00",
  },
  {
    id: 5,
    nombre: "Distribuidora Central",
    fechaHoraBaja: null,
  },
  {
    id: 6,
    nombre: "Importaciones del Sur",
    fechaHoraBaja: "2024-02-20 09:15:00",
  },
  {
    id: 7,
    nombre: "Comercial Norte",
    fechaHoraBaja: null,
  },
  {
    id: 8,
    nombre: "Proveedores Unidos",
    fechaHoraBaja: "2024-03-10 16:45:00",
  },
]

export default function ABMProveedorPage() {
  const [showOnlyActive, setShowOnlyActive] = useState(false)
  const [proveedores, setProveedores] = useState<DTOProveedor[] | null>(null)

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchProveedores = async () => {
      const response = await fetch(`${API_URL}/ABMProveedor/getProveedores?soloVigentes=0`)
      if (!response.ok) {
        console.error("Error fetching proveedores:", response.statusText)
        return
      }

      const data: DTOProveedor[] = await response.json()
      setProveedores(data)
      console.log("Proveedores fetched:", data)
    }
    fetchProveedores()
  }, [])


  // Filtrar proveedores según el checkbox
  const filteredProviders = showOnlyActive
    ? proveedores?.filter((provider) => provider.fhBajaProveedor === null)
    : proveedores

  const handleEliminar = async (id: number, nombre: string) => {
    try {
      const response = await fetch(`${API_URL}/ABMProveedor/darBaja?idProveedor=${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error al eliminar proveedor: ${response.statusText}`);
      }

      // Actualizar la lista de proveedores después de eliminar
      const updatedProveedores = proveedores?.map(proveedor => 
        proveedor.idProveedor === id 
          ? { ...proveedor, fhBajaProveedor: new Date().toISOString() }
          : proveedor
      );
      setProveedores(updatedProveedores || null);

      console.log(`Proveedor ${id}: ${nombre} eliminado exitosamente`);
      alert(`Proveedor "${nombre}" eliminado exitosamente`);
    } catch (error) {
      console.error('Error al eliminar proveedor:', error);
      alert(`Error al eliminar proveedor "${nombre}": ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

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

  const handleModificar = (id: number, nombre: string) => {
    // Aquí iría la lógica para modificar el proveedor
    console.log(`Modificar proveedor ${id}: ${nombre}`)
    // Por ahora solo mostramos un alert
    alert(`Funcionalidad de modificar proveedor "${nombre}" será implementada`)
  }

  const handleNuevoProveedor = () => {
    // Aquí iría la lógica para crear un nuevo proveedor
    console.log("Crear nuevo proveedor")
    alert("Funcionalidad de crear nuevo proveedor será implementada")
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <div className="container mx-auto py-8 px-4">
        {/* Header with back button */}
        <div className="mb-8">
          <Link href="/proveedores" className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 mb-6">
            <ArrowLeft className="w-4 h-4" />
            Volver a Proveedores
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h1 className="text-4xl font-bold text-slate-100">ABM Proveedor</h1>

            <Link href="/proveedores/ABMProveedor/AltaProveedor">
              <Button className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Nuevo Proveedor
              </Button>
            </Link>
          </div>

          {/* Filtros */}
          <div className="flex items-center gap-3 mb-6">
            <Checkbox
              id="show-active"
              checked={showOnlyActive}
              onCheckedChange={() => setShowOnlyActive(!showOnlyActive)}
              className="border-slate-600 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
            />
            <label htmlFor="show-active" className="text-slate-300 cursor-pointer select-none">
              Mostrar solo proveedores vigentes
            </label>
          </div>
        </div>

        {/* Tabla de proveedores */}
        <Card className="bg-slate-800 border-slate-700 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-green-900 to-slate-800 rounded-t-lg">
            <CardTitle className="text-2xl text-green-100 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              Lista de Proveedores
              {showOnlyActive && <span className="text-sm font-normal text-green-200 ml-2">(Solo vigentes)</span>}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="rounded-lg overflow-hidden border border-slate-700">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-700 hover:bg-slate-700 border-slate-600">
                    <TableHead className="text-green-200 font-semibold">ID</TableHead>
                    <TableHead className="text-green-200 font-semibold">Nombre</TableHead>
                    <TableHead className="text-green-200 font-semibold">Fecha Hora Baja</TableHead>
                    <TableHead className="text-green-200 font-semibold text-center">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(filteredProviders ?? []).length > 0 ? (
                    filteredProviders?.map((provider, index) => (
                      <TableRow
                        key={provider.idProveedor}
                        className={`
                          ${index % 2 === 0 ? "bg-slate-800" : "bg-slate-750"} 
                          hover:bg-slate-700 border-slate-600 transition-colors
                        `}
                      >
                        <TableCell className="text-slate-300 font-mono">{provider.idProveedor}</TableCell>
                        <TableCell className="text-slate-100 font-medium">{provider.nombreProveedor}</TableCell>
                        <TableCell className={`${provider.fhBajaProveedor ? "text-red-400" : "text-green-400"}`}>
                          {formatFechaBaja(provider.fhBajaProveedor)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              onClick={() => handleModificar(provider.idProveedor, provider.nombreProveedor)}
                              size="sm"
                              variant="outline"
                              className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600 hover:border-blue-700 flex items-center gap-1"
                            >
                              <Edit className="w-3 h-3" />
                              Modificar
                            </Button>
                            <Button
                              onClick={provider.fhBajaProveedor ? undefined : () => handleEliminar(provider.idProveedor, provider.nombreProveedor)}
                              size="sm"
                              variant="outline"
                              className={`bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700 flex items-center gap-1 ${provider.fhBajaProveedor ? "bg-slate-600 cursor-not-allowed" : ""}`}
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
                        {showOnlyActive ? "No hay proveedores vigentes" : "No hay proveedores registrados"}
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
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="text-slate-300">Total mostrado: </span>
                  <span className="text-green-400 font-semibold">{(filteredProviders ?? []).length}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                  <span className="text-slate-300">Proveedores activos: </span>
                  <span className="text-blue-400 font-semibold">
                    {proveedores?.filter((p) => p.fhBajaProveedor === null).length}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <span className="text-slate-300">Proveedores dados de baja: </span>
                  <span className="text-red-400 font-semibold">
                    {proveedores?.filter((p) => p.fhBajaProveedor !== null).length}
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
