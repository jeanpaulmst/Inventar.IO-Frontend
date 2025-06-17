"use client"

import Link from "next/link"
import { useState } from "react"
import { Plus, Package } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

// Datos de ejemplo para ventas generadas
const ventasGeneradas = [
  {
    id: 3001,
    monto: 15750.5,
    fechaAlta: "2024-12-15 10:30:00",
    cantidadArticulos: 3,
  },
  {
    id: 3002,
    monto: 89250.75,
    fechaAlta: "2024-12-15 14:15:00",
    cantidadArticulos: 5,
  },
  {
    id: 3003,
    monto: 2850.0,
    fechaAlta: "2024-12-15 16:45:00",
    cantidadArticulos: 2,
  },
  {
    id: 3004,
    monto: 45600.25,
    fechaAlta: "2024-12-14 09:20:00",
    cantidadArticulos: 4,
  },
  {
    id: 3005,
    monto: 12300.0,
    fechaAlta: "2024-12-14 11:50:00",
    cantidadArticulos: 1,
  },
  {
    id: 3006,
    monto: 7890.5,
    fechaAlta: "2024-12-14 15:30:00",
    cantidadArticulos: 6,
  },
  {
    id: 3007,
    monto: 156780.0,
    fechaAlta: "2024-12-13 08:45:00",
    cantidadArticulos: 8,
  },
  {
    id: 3008,
    monto: 3450.75,
    fechaAlta: "2024-12-13 12:15:00",
    cantidadArticulos: 2,
  },
  {
    id: 3009,
    monto: 67890.25,
    fechaAlta: "2024-12-13 17:00:00",
    cantidadArticulos: 7,
  },
  {
    id: 3010,
    monto: 23456.5,
    fechaAlta: "2024-12-12 13:30:00",
    cantidadArticulos: 3,
  },
]

export default function GenerarVentaPage() {
  const [ventas] = useState(ventasGeneradas)

  // Formatear fecha para mostrar
  const formatearFecha = (fechaString: string) => {
    const fecha = new Date(fechaString)
    return fecha.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Calcular estadísticas
  const totalVentas = ventas.length
  const montoTotal = ventas.reduce((total, venta) => total + venta.monto, 0)
  const promedioVenta = totalVentas > 0 ? montoTotal / totalVentas : 0
  const totalArticulos = ventas.reduce((total, venta) => total + venta.cantidadArticulos, 0)

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 bg-slate-900 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 mb-2">Generar Venta</h1>
          <p className="text-slate-400">Gestión y registro de ventas realizadas</p>
        </div>

        <Link href="/ventas/NuevaVenta">
          <Button className="bg-orange-600 hover:bg-orange-700 text-white flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Nueva Venta
          </Button>
        </Link>
      </div>

      {/* Tabla de ventas */}
      <Card className="bg-slate-800 border-slate-700 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-orange-900 to-slate-800 rounded-t-lg">
          <CardTitle className="text-2xl text-orange-100 flex items-center gap-2">
            <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
            Historial de Ventas
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 bg-slate-800">
          {ventas.length > 0 ? (
            <>
              <div className="rounded-lg overflow-hidden border border-slate-700 overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-700 hover:bg-slate-700 border-slate-600">
                      <TableHead className="text-orange-200 font-semibold">ID</TableHead>
                      <TableHead className="text-orange-200 font-semibold">Monto</TableHead>
                      <TableHead className="text-orange-200 font-semibold">Fecha Alta</TableHead>
                      <TableHead className="text-orange-200 font-semibold">Cantidad Artículos</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ventas.map((venta, index) => (
                      <TableRow
                        key={venta.id}
                        className={`
                          ${index % 2 === 0 ? "bg-slate-800" : "bg-slate-750"} 
                          hover:bg-slate-700 border-slate-600 transition-colors
                        `}
                      >
                        <TableCell className="text-slate-300 font-mono">#{venta.id}</TableCell>
                        <TableCell className="text-green-400 font-semibold text-lg">
                          ${venta.monto.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-slate-300">{formatearFecha(venta.fechaAlta)}</TableCell>
                        <TableCell>
                          <Badge
                            className={`${
                              venta.cantidadArticulos >= 5
                                ? "bg-green-600 text-white hover:bg-green-700"
                                : venta.cantidadArticulos >= 3
                                  ? "bg-yellow-600 text-slate-900 hover:bg-yellow-700"
                                  : "bg-blue-600 text-white hover:bg-blue-700"
                            }`}
                          >
                            {venta.cantidadArticulos} artículo{venta.cantidadArticulos !== 1 ? "s" : ""}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Resumen */}
              <div className="mt-6 p-4 bg-slate-700 rounded-lg border border-slate-600">
                <div className="flex flex-wrap gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                    <span className="text-slate-300">Total de ventas registradas: </span>
                    <span className="text-orange-400 font-semibold">{totalVentas}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span className="text-slate-300">Facturación total: </span>
                    <span className="text-green-400 font-semibold">${montoTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                    <span className="text-slate-300">Ticket promedio: </span>
                    <span className="text-blue-400 font-semibold">${promedioVenta.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <Package className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-300 mb-2">No hay ventas registradas</h3>
              <p className="text-slate-400 mb-4">Comience registrando su primera venta usando el botón "Nueva Venta"</p>
              <Link href="/ventas/NuevaVenta">
                <Button className="bg-orange-600 hover:bg-orange-700 text-white flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Registrar Primera Venta
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
