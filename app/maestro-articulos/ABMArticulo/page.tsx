"use client"
import Link from "next/link"
import { ArrowLeft, Plus, Edit, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"

// Datos de ejemplo para artículos
const articulosData = [
  {
    id: 1,
    costoAlmacenamiento: 15.5,
    descripcionArt: "Shampoo de calidad premium para todo tipo de cabello",
    fhBajaArticulo: null,
    inventarioMaxArticulo: 500,
    nombre: "Shampoo Axion",
    precioUnitario: 2250.3,
    stock: 100,
  },
  {
    id: 2,
    costoAlmacenamiento: 25.0,
    descripcionArt: "Laptop HP 15.6 pulgadas con 8GB RAM y SSD 256GB",
    fhBajaArticulo: null,
    inventarioMaxArticulo: 50,
    nombre: "Laptop HP Pavilion",
    precioUnitario: 45999.99,
    stock: 15,
  },
  {
    id: 3,
    costoAlmacenamiento: 8.75,
    descripcionArt: "Monitor LED 24 pulgadas Full HD con conexión HDMI",
    fhBajaArticulo: null,
    inventarioMaxArticulo: 100,
    nombre: "Monitor LG 24ML44",
    precioUnitario: 12500.0,
    stock: 30,
  },
  {
    id: 4,
    costoAlmacenamiento: 2.5,
    descripcionArt: "Resma de papel bond A4 de 75gr, 500 hojas",
    fhBajaArticulo: null,
    inventarioMaxArticulo: 1000,
    nombre: "Resma Papel A4",
    precioUnitario: 450.0,
    stock: 200,
  },
  {
    id: 5,
    costoAlmacenamiento: 12.0,
    descripcionArt: "Silla ergonómica de oficina con soporte lumbar",
    fhBajaArticulo: "2024-02-15 14:30:00",
    inventarioMaxArticulo: 80,
    nombre: "Silla Ergonómica Pro",
    precioUnitario: 8750.5,
    stock: 0,
  },
  {
    id: 6,
    costoAlmacenamiento: 5.25,
    descripcionArt: "Pack de 10 bolígrafos azules de tinta gel",
    fhBajaArticulo: null,
    inventarioMaxArticulo: 500,
    nombre: "Bolígrafos Pack x10",
    precioUnitario: 280.0,
    stock: 150,
  },
  {
    id: 7,
    costoAlmacenamiento: 18.0,
    descripcionArt: "Escritorio de madera laminada 120x60cm con cajones",
    fhBajaArticulo: null,
    inventarioMaxArticulo: 40,
    nombre: "Escritorio Ejecutivo",
    precioUnitario: 15999.0,
    stock: 8,
  },
  {
    id: 8,
    costoAlmacenamiento: 3.75,
    descripcionArt: "Grapadora metálica de oficina para 20 hojas",
    fhBajaArticulo: "2024-01-20 09:15:00",
    inventarioMaxArticulo: 200,
    nombre: "Grapadora Metálica",
    precioUnitario: 650.0,
    stock: 0,
  },
]

export default function ABMArticuloPage() {
  const handleEliminar = (id: number, nombre: string) => {
    // Aquí iría la lógica para eliminar/dar de baja el artículo
    console.log(`Eliminar artículo ${id}: ${nombre}`)
    // Por ahora solo mostramos un alert
    alert(`Funcionalidad de eliminar artículo "${nombre}" será implementada`)
  }

  const handleModificar = (id: number, nombre: string) => {
    // Aquí iría la lógica para modificar el artículo
    console.log(`Modificar artículo ${id}: ${nombre}`)
    // Por ahora solo mostramos un alert
    alert(`Funcionalidad de modificar artículo "${nombre}" será implementada`)
  }

  const handleNuevoArticulo = () => {
    // Aquí iría la lógica para crear un nuevo artículo
    console.log("Crear nuevo artículo")
    alert("Funcionalidad de crear nuevo artículo será implementada")
  }

  // Calcular estadísticas
  const totalArticulos = articulosData.length
  const articulosActivos = articulosData.filter((art) => art.fhBajaArticulo === null).length
  const articulosDadosBaja = articulosData.filter((art) => art.fhBajaArticulo !== null).length
  const valorTotalInventario = articulosData.reduce((total, art) => total + art.precioUnitario * art.stock, 0)

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <div className="container mx-auto py-8 px-4">
        {/* Header with back button */}
        <div className="mb-8">
          <Link
            href="/maestro-articulos"
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a Maestro de Artículos
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h1 className="text-4xl font-bold text-slate-100">ABM Artículo</h1>

            <Button
              onClick={handleNuevoArticulo}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Agregar Artículo
            </Button>
          </div>
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
                    <TableHead className="text-blue-200 font-semibold text-center">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {articulosData.length > 0 ? (
                    articulosData.map((articulo, index) => (
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
                          {articulo.fhBajaArticulo || "Activo"}
                        </TableCell>
                        <TableCell className="text-purple-400 font-semibold">
                          {articulo.inventarioMaxArticulo}
                        </TableCell>
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
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              onClick={() => handleModificar(articulo.id, articulo.nombre)}
                              size="sm"
                              variant="outline"
                              className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600 hover:border-blue-700 flex items-center gap-1"
                            >
                              <Edit className="w-3 h-3" />
                              Modificar
                            </Button>
                            <Button
                              onClick={() => handleEliminar(articulo.id, articulo.nombre)}
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
                      <TableCell colSpan={9} className="text-center text-slate-400 py-8">
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
                  <span className="text-slate-300">Total de artículos: </span>
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
      </div>
    </div>
  )
}
