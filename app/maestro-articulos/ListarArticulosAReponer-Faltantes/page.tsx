"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState, useEffect } from "react"
import { DTOArticulo } from "@/types"
import { Checkbox } from "@/components/ui/checkbox"

// Datos de ejemplo para artículos que necesitan reposición
const articulosAReponer = [
  { id: 101, nombre: "Laptop HP", precioUnitario: 599.99, stock: 5, puntoPedido: 10 },
  { id: 102, nombre: "Monitor LG", precioUnitario: 149.99, stock: 8, puntoPedido: 15 },
  { id: 201, nombre: "Resma Papel A4", precioUnitario: 5.99, stock: 25, puntoPedido: 50 },
  { id: 202, nombre: "Bolígrafos Pack", precioUnitario: 3.5, stock: 12, puntoPedido: 30 },
  { id: 301, nombre: "Silla Ergonómica", precioUnitario: 129.99, stock: 3, puntoPedido: 8 },
  { id: 302, nombre: "Escritorio", precioUnitario: 199.5, stock: 2, puntoPedido: 5 },
  { id: 105, nombre: "Auriculares Sony", precioUnitario: 89.99, stock: 7, puntoPedido: 15 },
  { id: 204, nombre: "Grapadora", precioUnitario: 8.75, stock: 4, puntoPedido: 10 },
  { id: 305, nombre: "Archivador", precioUnitario: 149.99, stock: 1, puntoPedido: 5 },
  { id: 304, nombre: "Lámpara de Escritorio", precioUnitario: 34.99, stock: 6, puntoPedido: 12 },
]

export default function ListarArticulosAReponerPage() {

    const [filtrarPorPuntoPedido, setFiltrarPorPuntoPedido] = useState(true)
    const [filtrarPorStockSeguridad, setFiltrarPorStockSeguridad] = useState(!filtrarPorPuntoPedido)
    const [articulos, setArticulos] = useState<DTOArticulo[] | null>(null);

    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        const fetchArticulosAReponer = async () => {
            const response = await fetch(`${API_URL}/ListarProductosAReponer/getArticulosAReponer`);

            if (!response.ok) {
                throw new Error("Error al obtener los artículos a reponer");
            }

            const data : DTOArticulo[] = await response.json();
            setArticulos(data);
            console.log("Artículos a reponer:", data);
        }

        const fetchArticulosFaltantes = async () => {
            const response = await fetch(`${API_URL}/ListarProductosFaltantes/getArticulosFaltantes`);

            if (!response.ok) {
                throw new Error("Error al obtener los artículos faltantes");
            }

            const data : DTOArticulo[] = await response.json();
            setArticulos(data);
            console.log("Artículos faltantes:", data);
        }

        filtrarPorPuntoPedido ? fetchArticulosAReponer() : fetchArticulosFaltantes();
    }, []);

 
  // Aplicar filtros
  let articulosFiltrados : DTOArticulo[] = []
  if (filtrarPorPuntoPedido) {
    //artículos por debajo del punto de pedido
    articulosFiltrados = (articulos ?? []).filter((articulo) => articulo.stock < articulo.puntoPedido)
  } else if (filtrarPorStockSeguridad) {
    //artículos por debajo del stock de seguridad
    articulosFiltrados = (articulos ?? []).filter((articulo) => articulo.stock < articulo.stockSeguridad)
  }



  // Calcular estadísticas
  const totalArticulos = articulosAReponer.length
  const valorTotalInventario = articulosAReponer.reduce(
    (total, articulo) => total + articulo.precioUnitario * articulo.stock,
    0,
  )
  const articulosCriticos = articulos?.filter((articulo) => articulo.stock < articulo.stockSeguridad).length
  const articulosBajos = articulos?.filter(
    (articulo) => articulo.stock >= articulo.stockSeguridad && articulo.stock < articulo.puntoPedido,
  ).length

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <div className="container mx-auto py-8 px-4">
        {/* Back button */}
        <div className="mb-8">
          <Link
            href="/maestro-articulos"
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a Maestro de Artículos
          </Link>

          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-100 mb-2">Artículos a Reponer / Faltantes</h1>
            <p className="text-slate-400">Lista de artículos que están por debajo del punto de pedido o debajo del stock de seguridad</p>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Checkbox
              id="filtrar-punto-pedido"
              checked={filtrarPorPuntoPedido}
              onCheckedChange={() => {
                setFiltrarPorPuntoPedido(true)
                setFiltrarPorStockSeguridad(false)}}
              className="border-slate-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
            />
            <label htmlFor="filtrar-punto-pedido" className="text-slate-300 cursor-pointer select-none">
              Mostrar solo artículos por debajo del punto de pedido
            </label>
          </div>
          <div className="flex items-center gap-3">
            <Checkbox
              id="filtrar-stock-seguridad"
              checked={filtrarPorStockSeguridad}
              onCheckedChange={() => {
                setFiltrarPorStockSeguridad(true)
                setFiltrarPorPuntoPedido(false)
              }}
              className="border-slate-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
            />
            <label htmlFor="filtrar-stock-seguridad" className="text-slate-300 cursor-pointer select-none">
              Mostrar solo artículos por debajo del stock de seguridad
            </label>
          </div>
        </div>
      
      

        {/* Tabla de artículos a reponer */}

        <Card className="bg-slate-800 border-slate-700 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-900 to-slate-800 rounded-t-lg">
            <CardTitle className="text-2xl text-blue-100 flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              Artículos que Necesitan Reposición
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="rounded-lg overflow-hidden border border-slate-700">
              {articulosFiltrados.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-700 hover:bg-slate-700 border-slate-600">
                    <TableHead className="text-blue-200 font-semibold">ID</TableHead>
                    <TableHead className="text-blue-200 font-semibold">Nombre</TableHead>
                    <TableHead className="text-blue-200 font-semibold">Precio Unitario</TableHead>
                    <TableHead className="text-blue-200 font-semibold">Stock</TableHead>
                    <TableHead className="text-blue-200 font-semibold">Punto Pedido</TableHead>
                    <TableHead className="text-blue-200 font-semibold">Stock Seguridad</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {articulosFiltrados?.map((articulo, index) => (
                    <TableRow
                      key={articulo.id}
                      className={`
                        ${index % 2 === 0 ? "bg-slate-800" : "bg-slate-750"} 
                        hover:bg-slate-700 border-slate-600 transition-colors
                      `}
                    >
                      <TableCell className="text-slate-300 font-mono">{articulo.id}</TableCell>
                      <TableCell className="text-slate-100 font-medium">{articulo.nombreArt}</TableCell>
                      <TableCell className="text-green-400 font-semibold">
                        ${articulo.precioUnitario.toFixed(2)}
                      </TableCell>
                      <TableCell
                        className={`font-semibold ${
                          articulo.stock < articulo.stockSeguridad
                            ? "text-red-400"
                            : articulo.stock < articulo.puntoPedido
                              ? "text-yellow-400"
                              : "text-green-400"
                        }`}
                      >
                        {articulo.stock}
                      </TableCell>
                      <TableCell className="text-blue-400 font-semibold">{articulo.puntoPedido}</TableCell>
                      <TableCell className="text-orange-400 font-semibold">{articulo.stockSeguridad}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-slate-400 py-8">
                      No hay artículos que necesiten reposición según los filtros seleccionados.
                    </TableCell>
                  </TableRow>
                )}
            </div>

            {/* Resumen de artículos */}
            <div className="mt-6 p-4 bg-slate-700 rounded-lg border border-slate-600">
              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                  <span className="text-slate-300">Total de artículos: </span>
                  <span className="text-blue-400 font-semibold">{totalArticulos}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <span className="text-slate-300">Artículos críticos: </span>
                  <span className="text-red-400 font-semibold">{articulosCriticos}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <span className="text-slate-300">Artículos bajos: </span>
                  <span className="text-yellow-400 font-semibold">{articulosBajos}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="text-slate-300">Valor total del inventario: </span>
                  <span className="text-green-400 font-semibold">${valorTotalInventario.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Leyenda de colores */}
            <div className="mt-4 p-3 bg-slate-800 rounded-lg border border-slate-600">
              <h4 className="text-slate-200 font-medium mb-2">Leyenda de Stock:</h4>
              <div className="flex flex-wrap gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <span className="text-slate-300">Crítico (&lt; stock de seguridad)</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span className="text-slate-300">Bajo (&lt; punto de pedido)</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
