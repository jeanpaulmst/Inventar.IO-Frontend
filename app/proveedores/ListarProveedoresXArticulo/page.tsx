"use client"

import { useState, useEffect } from "react"
import { Search, Package, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Tipo para el artículo basado en la entidad del backend
  interface Articulo {
    id: number
    costoAlmacenamiento: number
    demanda: number
    descripcionArt: string
    fhBajaArticulo: string | null
    inventarioMaxArticulo: number
    nombre: string
    precioUnitario: number
    proximaRevision: string | null
    puntoPedido: number | null
    stock: number
    tiempoFijo: number | null
  }

interface Proveedor {
  idProveedor: number
  nombreProveedor: string
}

// Datos de ejemplo para proveedores por artículo
const proveedoresPorArticulo = {
  1: [
    { id: 1, nombre: "Distribuidora Belleza S.A." },
    { id: 2, nombre: "Cosméticos del Norte" },
    { id: 3, nombre: "Importadora Premium" },
  ],
  2: [
    { id: 4, nombre: "Tecnología Avanzada" },
    { id: 5, nombre: "Computadoras del Sur" },
    { id: 6, nombre: "Electrónica Moderna" },
  ],
  3: [
    { id: 6, nombre: "Electrónica Moderna" },
    { id: 7, nombre: "Monitores Express" },
    { id: 8, nombre: "Pantallas HD" },
  ],
  4: [
    { id: 9, nombre: "Suministros Oficina Plus" },
    { id: 10, nombre: "Papelería Central" },
  ],
  5: [
    { id: 11, nombre: "Muebles Confort" },
    { id: 12, nombre: "Oficina Total" },
    { id: 13, nombre: "Ergonomía Pro" },
  ],
  6: [
    { id: 9, nombre: "Suministros Oficina Plus" },
    { id: 14, nombre: "Escritorio y Más" },
  ],
  7: [
    { id: 11, nombre: "Muebles Confort" },
    { id: 15, nombre: "Maderas Premium" },
  ],
  8: [
    { id: 9, nombre: "Suministros Oficina Plus" },
    { id: 16, nombre: "Herramientas de Oficina" },
  ],
  9: [
    { id: 4, nombre: "Tecnología Avanzada" },
    { id: 6, nombre: "Electrónica Moderna" },
    { id: 17, nombre: "Periféricos Tech" },
  ],
  10: [
    { id: 4, nombre: "Tecnología Avanzada" },
    { id: 6, nombre: "Electrónica Moderna" },
    { id: 17, nombre: "Periféricos Tech" },
    { id: 18, nombre: "Accesorios PC" },
  ],
}

export default function ListarProveedoresXArticuloPage() {
  const [articulos, setArticulos] = useState<Articulo[]>([])
  const [articuloSeleccionado, setArticuloSeleccionado] = useState<string>("")
  const [proveedores, setProveedores] = useState<Proveedor[]>([])
  const [articuloEncontrado, setArticuloEncontrado] = useState<Articulo | null>(null)
  const [busquedaRealizada, setBusquedaRealizada] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const API_URL = process.env.NEXT_PUBLIC_API_URL

  console.log(proveedores)

  // Cargar artículos desde la API
  useEffect(() => {
    const fetchArticulos = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${API_URL}/ABMArticulo/getAll?soloVigentes=true`)

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`)
        }

        const data: Articulo[] = await response.json()
        setArticulos(data)
        setError(null)
      } catch (err) {
        console.error("Error al obtener artículos:", err)
        setError(err instanceof Error ? err.message : "Error desconocido")
      } finally {
        setLoading(false)
      }
    }

    fetchArticulos()
  }, [API_URL])

  const handleBuscar = async () => {
    if (!articuloSeleccionado) {
      alert("Por favor, seleccione un artículo")
      return
    }

    setBusquedaRealizada(true)

    // Buscar el artículo seleccionado
    const articulo = articulos.find(art => art.id.toString() === articuloSeleccionado)

    if (articulo) {
      setArticuloEncontrado(articulo)

      // Buscar proveedores para este artículo
      try {
        setLoading(true)
        const response = await fetch(`${API_URL}/ListarProveedoresXArticulo/getProveedoresXArticulo?articuloId=${articuloSeleccionado}`)
        console.log("articuloSeleccionado: " + articuloSeleccionado)
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`)
        }

        const data: Proveedor[] = await response.json()
        setProveedores(data)
        setError(null)
      } catch (err) {
        console.error("Error al obtener proveedores:", err)
        setError(err instanceof Error ? err.message : "Error desconocido")
      } finally {
        setLoading(false)
      }
    } else {
      setArticuloEncontrado(null)
      setProveedores([])
    }
  }

  const handleLimpiar = () => {
    setArticuloSeleccionado("")
    setProveedores([])
    setArticuloEncontrado(null)
    setBusquedaRealizada(false)
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
            <Button onClick={() => window.location.reload()} className="bg-blue-600 hover:bg-blue-700">
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
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-100 mb-2">Listar Proveedores por Artículo</h1>
        <p className="text-slate-400">Buscar todos los proveedores que suministran un artículo específico</p>
      </div>

      {/* Card de búsqueda */}
      <Card className="bg-slate-800 border-slate-700 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-green-900 to-slate-800 rounded-t-lg">
          <CardTitle className="text-2xl text-green-100 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            Búsqueda de Proveedores
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1 space-y-2">
              <Label htmlFor="articulo-select" className="text-slate-200 font-medium">
                Seleccionar Artículo
              </Label>
              <Select value={articuloSeleccionado} onValueChange={setArticuloSeleccionado}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-100 focus:border-green-500 focus:ring-green-500">
                  <SelectValue placeholder="Seleccione un artículo" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  {articulos.map((articulo) => (
                    <SelectItem 
                      key={articulo.id} 
                      value={articulo.id.toString()}
                      className="text-slate-100 hover:bg-slate-600 focus:bg-slate-600"
                    >
                      {articulo.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleBuscar}
                className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                Buscar
              </Button>
              <Button
                onClick={handleLimpiar}
                variant="outline"
                className="bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600 hover:text-slate-100"
              >
                Limpiar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resultados */}
      {busquedaRealizada && (
        <>
          {articuloEncontrado ? (
            <Card className="bg-slate-800 border-slate-700 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-green-900 to-slate-800 rounded-t-lg">
                <CardTitle className="text-xl text-green-100 flex items-center gap-2">
                  <Package className="w-5 h-5 text-green-400" />
                  Proveedores para: {articuloEncontrado.nombre}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {proveedores.length > 0 ? (
                  <>
                    <div className="rounded-lg overflow-hidden border border-slate-700">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-slate-700 hover:bg-slate-700 border-slate-600">
                            <TableHead className="text-green-200 font-semibold">ID Proveedor</TableHead>
                            <TableHead className="text-green-200 font-semibold">Nombre del Proveedor</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {proveedores.map((proveedor, index) => (
                            <TableRow
                              key={proveedor.idProveedor}
                              className={`
                                ${index % 2 === 0 ? "bg-slate-800" : "bg-slate-750"} 
                                hover:bg-slate-700 border-slate-600 transition-colors
                              `}
                            >
                              <TableCell className="text-slate-300 font-mono">{proveedor.idProveedor}</TableCell>
                              <TableCell className="text-slate-100 font-medium">{proveedor.nombreProveedor}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Resumen */}
                    <div className="mt-6 p-4 bg-slate-700 rounded-lg border border-slate-600">
                      <div className="flex flex-wrap gap-6 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                          <span className="text-slate-300">Total de proveedores encontrados: </span>
                          <span className="text-green-400 font-semibold">{proveedores.length}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                          <span className="text-slate-300">Artículo ID: </span>
                          <span className="text-blue-400 font-semibold">{articuloEncontrado.id}</span>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <Users className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-slate-300 mb-2">No hay proveedores</h3>
                    <p className="text-slate-400">
                      No se encontraron proveedores para el artículo "{articuloEncontrado.nombre}".
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-slate-800 border-slate-700 shadow-xl">
              <CardContent className="py-8">
                <div className="text-center">
                  <Package className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-300 mb-2">Artículo no encontrado</h3>
                  <p className="text-slate-400">No se encontró el artículo seleccionado.</p>
                  <p className="text-slate-500 text-sm mt-2">Verifique la selección e intente nuevamente.</p>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Información de ayuda */}
      {!busquedaRealizada && (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-100 flex items-center gap-2">
              <Search className="w-5 h-5 text-green-400" />
              Cómo usar esta función
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-slate-400 space-y-2">
              <p>• Seleccione un artículo de la lista desplegable</p>
              <p>• Haga clic en "Buscar" para obtener la lista de proveedores</p>
              <p>• La tabla mostrará el ID y nombre de cada proveedor que suministra el artículo</p>
              <p>• Use "Limpiar" para realizar una nueva búsqueda</p>
            </div>

            <div className="mt-4 p-3 bg-slate-700 rounded-lg">
              <h4 className="text-slate-200 font-medium mb-2">Artículos disponibles: {articulos.length}</h4>
              <p className="text-xs text-slate-400">
                Se muestran todos los artículos vigentes del sistema.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
