"use client"

import { useRouter } from "next/navigation"
import { Calculator } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { DTOTablaArticulo } from "@/types"

export default function CalcularCGIPage() {
  const router = useRouter()
  const BASE_URL = "http://localhost:8080/ABMArticulo";
  const [articulos, setArticulos] = useState<DTOTablaArticulo[] | null>(null)

  useEffect(() => {
    const fetchArticulos = async () => {
      const response = await fetch(`${BASE_URL}/getAll?soloVigentes=true`)
      if (!response.ok) {
        console.error("Error al traer articulos:", response.statusText)
        return
      }

      const data: DTOTablaArticulo[] = await response.json()
      setArticulos(data)
      console.log("Artículos fetched:", data)
    }
    fetchArticulos()
  }, [])

  const handleCalcularCGI = (id: number) => {
    router.push(`/maestro-articulos/CalcularCGI/${id}`)
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-100 mb-2">Articulos</h1>
      </div>

      {/* Tabla de artículos */}
      <Card className="bg-slate-800 border-slate-700 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-blue-900 to-slate-800 rounded-t-lg">
          <CardTitle className="text-2xl text-blue-100 flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            Listado de articulos
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
                  <TableHead className="text-blue-200 font-semibold">Stock</TableHead>
                  <TableHead className="text-blue-200 font-semibold text-center">Acción</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {articulos && articulos.length > 0 ? (
                  articulos.map((articulo, index) => (
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
                      <TableCell className="text-slate-100 font-medium">{articulo.stock}</TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            onClick={() => handleCalcularCGI(articulo.id)}
                            size="sm"
                            className="bg-yellow-600 hover:bg-yellow-700 text-slate-900 font-semibold flex items-center gap-2 px-4 py-2"
                          >
                            <Calculator className="w-4 h-4" />
                            Calcular CGI
                          </Button>
                          <Button
                            onClick={() => router.push(`/maestro-articulos/AjustarInventario/${articulo.id}`)}
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2"
                          >
                            Ajustar inventario
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
                <span className="text-blue-400 font-semibold">{articulos?.length ?? 0}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
