"use client"

import { useRouter } from "next/navigation"
import { Calculator } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"

// Datos de ejemplo para artículos (usando los mismos datos pero solo las columnas necesarias)
const articulosData = [
  {
    id: 1,
    nombre: "Shampoo Axion",
    descripcionArt: "Shampoo de calidad premium para todo tipo de cabello",
  },
  {
    id: 2,
    nombre: "Laptop HP Pavilion",
    descripcionArt: "Laptop HP 15.6 pulgadas con 8GB RAM y SSD 256GB",
  },
  {
    id: 3,
    nombre: "Monitor LG 24ML44",
    descripcionArt: "Monitor LED 24 pulgadas Full HD con conexión HDMI",
  },
  {
    id: 4,
    nombre: "Resma Papel A4",
    descripcionArt: "Resma de papel bond A4 de 75gr, 500 hojas",
  },
  {
    id: 5,
    nombre: "Silla Ergonómica Pro",
    descripcionArt: "Silla ergonómica de oficina con soporte lumbar",
  },
  {
    id: 6,
    nombre: "Bolígrafos Pack x10",
    descripcionArt: "Pack de 10 bolígrafos azules de tinta gel",
  },
  {
    id: 7,
    nombre: "Escritorio Ejecutivo",
    descripcionArt: "Escritorio de madera laminada 120x60cm con cajones",
  },
  {
    id: 8,
    nombre: "Grapadora Metálica",
    descripcionArt: "Grapadora metálica de oficina para 20 hojas",
  },
  {
    id: 9,
    nombre: "Teclado Logitech",
    descripcionArt: "Teclado inalámbrico Logitech con retroiluminación",
  },
  {
    id: 10,
    nombre: "Mouse Óptico",
    descripcionArt: "Mouse óptico inalámbrico con sensor de alta precisión",
  },
]

export default function CalcularCGIPage() {
  const router = useRouter()

  const handleCalcularCGI = (id: number, nombre: string) => {
    // Navegar a la página de detalles del CGI
    router.push(`/maestro-articulos/CalcularCGI/${id}`)
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-100 mb-2">Calcular CGI</h1>
        <p className="text-slate-400">Calcular el Costo de Gestión de Inventario para cada artículo</p>
      </div>

      {/* Tabla de artículos */}
      <Card className="bg-slate-800 border-slate-700 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-blue-900 to-slate-800 rounded-t-lg">
          <CardTitle className="text-2xl text-blue-100 flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            Artículos para Cálculo de CGI
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="rounded-lg overflow-hidden border border-slate-700 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-700 hover:bg-slate-700 border-slate-600">
                  <TableHead className="text-blue-200 font-semibold">ID</TableHead>
                  <TableHead className="text-blue-200 font-semibold">Nombre</TableHead>
                  <TableHead className="text-blue-200 font-semibold">Descripción</TableHead>
                  <TableHead className="text-blue-200 font-semibold text-center">Acción</TableHead>
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
                      <TableCell className="text-slate-100 font-medium">{articulo.nombre}</TableCell>
                      <TableCell className="text-slate-300 max-w-md" title={articulo.descripcionArt}>
                        {articulo.descripcionArt}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center">
                          <Button
                            onClick={() => handleCalcularCGI(articulo.id, articulo.nombre)}
                            size="sm"
                            className="bg-yellow-600 hover:bg-yellow-700 text-slate-900 font-semibold flex items-center gap-2 px-4 py-2"
                          >
                            <Calculator className="w-4 h-4" />
                            Calcular CGI
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-slate-400 py-8">
                      No hay artículos disponibles para calcular CGI
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Información adicional */}
          <div className="mt-6 p-4 bg-slate-700 rounded-lg border border-slate-600">
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                <span className="text-slate-300">Total de artículos: </span>
                <span className="text-blue-400 font-semibold">{articulosData.length}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <span className="text-slate-300">Disponibles para cálculo CGI: </span>
                <span className="text-yellow-400 font-semibold">{articulosData.length}</span>
              </div>
            </div>
          </div>

          {/* Información sobre CGI */}
          <div className="mt-4 p-4 bg-slate-800 rounded-lg border border-slate-600">
            <h4 className="text-slate-200 font-medium mb-2 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-yellow-400" />
              ¿Qué es el CGI?
            </h4>
            <div className="text-sm text-slate-400 space-y-1">
              <p>
                • <strong>CGI (Costo de Gestión de Inventario):</strong> Representa el costo total de mantener un
                artículo en inventario
              </p>
              <p>• Incluye costos de almacenamiento, manejo, seguros, obsolescencia y capital inmovilizado</p>
              <p>• Es fundamental para la toma de decisiones sobre niveles óptimos de stock</p>
              <p>• Ayuda a determinar la rentabilidad real de cada artículo en el inventario</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
