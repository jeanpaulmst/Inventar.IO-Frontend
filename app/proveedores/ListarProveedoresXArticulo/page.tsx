"use client"

import { useState } from "react"
import { Search, Package, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

// Datos de ejemplo para artículos
const articulosData = {
  1: { nombre: "Shampoo Axion" },
  2: { nombre: "Laptop HP Pavilion" },
  3: { nombre: "Monitor LG 24ML44" },
  4: { nombre: "Resma Papel A4" },
  5: { nombre: "Silla Ergonómica Pro" },
  6: { nombre: "Bolígrafos Pack x10" },
  7: { nombre: "Escritorio Ejecutivo" },
  8: { nombre: "Grapadora Metálica" },
  9: { nombre: "Teclado Logitech" },
  10: { nombre: "Mouse Óptico" },
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
  const [articuloId, setArticuloId] = useState("")
  const [proveedores, setProveedores] = useState<Array<{ id: number; nombre: string }>>([])
  const [articuloEncontrado, setArticuloEncontrado] = useState<{ nombre: string } | null>(null)
  const [busquedaRealizada, setBusquedaRealizada] = useState(false)

  const handleBuscar = () => {
    const id = Number(articuloId)

    if (!articuloId.trim() || isNaN(id)) {
      alert("Por favor, ingrese un ID de artículo válido")
      return
    }

    setBusquedaRealizada(true)

    // Buscar el artículo
    const articulo = articulosData[id as keyof typeof articulosData]

    if (articulo) {
      setArticuloEncontrado(articulo)
      // Buscar proveedores para este artículo
      const proveedoresDelArticulo = proveedoresPorArticulo[id as keyof typeof proveedoresPorArticulo] || []
      setProveedores(proveedoresDelArticulo)
    } else {
      setArticuloEncontrado(null)
      setProveedores([])
    }
  }

  const handleLimpiar = () => {
    setArticuloId("")
    setProveedores([])
    setArticuloEncontrado(null)
    setBusquedaRealizada(false)
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
              <Label htmlFor="articulo-id" className="text-slate-200 font-medium">
                ID del Artículo
              </Label>
              <Input
                id="articulo-id"
                type="number"
                value={articuloId}
                onChange={(e) => setArticuloId(e.target.value)}
                placeholder="Ingrese el ID del artículo"
                className="bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400 focus:border-green-500 focus:ring-green-500"
              />
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
                              key={proveedor.id}
                              className={`
                                ${index % 2 === 0 ? "bg-slate-800" : "bg-slate-750"} 
                                hover:bg-slate-700 border-slate-600 transition-colors
                              `}
                            >
                              <TableCell className="text-slate-300 font-mono">{proveedor.id}</TableCell>
                              <TableCell className="text-slate-100 font-medium">{proveedor.nombre}</TableCell>
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
                          <span className="text-blue-400 font-semibold">{articuloId}</span>
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
                  <p className="text-slate-400">No se encontró ningún artículo con el ID "{articuloId}".</p>
                  <p className="text-slate-500 text-sm mt-2">Verifique que el ID sea correcto e intente nuevamente.</p>
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
              <p>• Ingrese el ID numérico del artículo que desea consultar</p>
              <p>• Haga clic en "Buscar" para obtener la lista de proveedores</p>
              <p>• La tabla mostrará el ID y nombre de cada proveedor que suministra el artículo</p>
              <p>• Use "Limpiar" para realizar una nueva búsqueda</p>
            </div>

            <div className="mt-4 p-3 bg-slate-700 rounded-lg">
              <h4 className="text-slate-200 font-medium mb-2">IDs de ejemplo disponibles:</h4>
              <div className="text-xs text-slate-400 grid grid-cols-2 md:grid-cols-5 gap-1">
                {Object.entries(articulosData).map(([id, articulo]) => (
                  <div key={id} className="flex items-center gap-1">
                    <span className="text-green-400 font-mono">{id}:</span>
                    <span className="truncate">{articulo.nombre}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
