"use client"

import Link from "next/link"
import { useState } from "react"
import { Edit, X, Clock, CheckCircle, Send, Plus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

// Datos de ejemplo para órdenes de compra pendientes
const ordenesPendientes = [
  {
    id: 1001,
    nombreProveedor: "Distribuidora Belleza S.A.",
    fechaAlta: "2024-12-10 09:30:00",
    estado: "Pendiente",
  },
  {
    id: 1002,
    nombreProveedor: "Tecnología Avanzada",
    fechaAlta: "2024-12-11 14:15:00",
    estado: "Pendiente",
  },
  {
    id: 1003,
    nombreProveedor: "Electrónica Moderna",
    fechaAlta: "2024-12-12 10:45:00",
    estado: "Pendiente",
  },
  {
    id: 1004,
    nombreProveedor: "Suministros Oficina Plus",
    fechaAlta: "2024-12-12 16:20:00",
    estado: "Pendiente",
  },
  {
    id: 1005,
    nombreProveedor: "Muebles Confort",
    fechaAlta: "2024-12-13 08:00:00",
    estado: "Pendiente",
  },
]

// Datos de ejemplo para órdenes enviadas
const ordenesEnviadas = [
  {
    id: 2001,
    nombreProveedor: "Cosméticos del Norte",
    fechaAlta: "2024-12-08 11:30:00",
    estado: "Enviada",
  },
  {
    id: 2002,
    nombreProveedor: "Computadoras del Sur",
    fechaAlta: "2024-12-09 13:45:00",
    estado: "Enviada",
  },
  {
    id: 2003,
    nombreProveedor: "Monitores Express",
    fechaAlta: "2024-12-09 15:10:00",
    estado: "Enviada",
  },
  {
    id: 2004,
    nombreProveedor: "Papelería Central",
    fechaAlta: "2024-12-10 09:20:00",
    estado: "Enviada",
  },
  {
    id: 2005,
    nombreProveedor: "Importadora Premium",
    fechaAlta: "2024-12-11 12:00:00",
    estado: "Enviada",
  },
  {
    id: 2006,
    nombreProveedor: "Herramientas de Oficina",
    fechaAlta: "2024-12-11 16:30:00",
    estado: "Enviada",
  },
]

type VistaActual = "modificar-cancelar" | "finalizar"

export default function GestionDeOrdenesPage() {
  const [ordenesPendientesState, setOrdenesPendientesState] = useState(ordenesPendientes)
  const [ordenesEnviadasState, setOrdenesEnviadasState] = useState(ordenesEnviadas)
  const [vistaActual, setVistaActual] = useState<VistaActual>("modificar-cancelar")

  const handleModificar = (id: number, nombreProveedor: string) => {
    console.log(`Modificar orden ${id} del proveedor: ${nombreProveedor}`)
    alert(`Funcionalidad de modificar orden #${id} será implementada`)
  }

  const handleCancelar = (id: number, nombreProveedor: string) => {
    console.log(`Cancelar orden ${id} del proveedor: ${nombreProveedor}`)

    const confirmacion = confirm(
      `¿Está seguro que desea cancelar la orden #${id} del proveedor "${nombreProveedor}"?\n\nEsta acción no se puede deshacer.`,
    )

    if (confirmacion) {
      setOrdenesPendientesState(ordenesPendientesState.filter((orden) => orden.id !== id))
      alert(`Orden #${id} cancelada exitosamente`)
    }
  }

  const handleFinalizar = (id: number, nombreProveedor: string) => {
    console.log(`Finalizar orden ${id} del proveedor: ${nombreProveedor}`)

    const confirmacion = confirm(
      `¿Está seguro que desea finalizar la orden #${id} del proveedor "${nombreProveedor}"?\n\nEsta acción marcará la orden como completada.`,
    )

    if (confirmacion) {
      setOrdenesEnviadasState(ordenesEnviadasState.filter((orden) => orden.id !== id))
      alert(`Orden #${id} finalizada exitosamente`)
    }
  }

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

  const ordenesActuales = vistaActual === "modificar-cancelar" ? ordenesPendientesState : ordenesEnviadasState
  const tituloTabla =
    vistaActual === "modificar-cancelar" ? "Órdenes de Compra Pendientes" : "Órdenes de Compra Enviadas"

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 mb-2">Gestión de Ordenes</h1>
          <p className="text-slate-400">
            {vistaActual === "modificar-cancelar"
              ? "Administrar órdenes de compra en estado pendiente"
              : "Finalizar órdenes de compra enviadas"}
          </p>
        </div>
      </div>

      {/* Botones de vista */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <Button
          onClick={() => setVistaActual("modificar-cancelar")}
          className={`flex items-center gap-2 ${
            vistaActual === "modificar-cancelar"
              ? "bg-purple-600 hover:bg-purple-700 text-white"
              : "bg-slate-700 hover:bg-slate-600 text-slate-300"
          }`}
        >
          <Edit className="w-4 h-4" />
          Modificar/Cancelar Ordenes
        </Button>
        <Button
          onClick={() => setVistaActual("finalizar")}
          className={`flex items-center gap-2 ${
            vistaActual === "finalizar"
              ? "bg-purple-600 hover:bg-purple-700 text-white"
              : "bg-slate-700 hover:bg-slate-600 text-slate-300"
          }`}
        >
          <CheckCircle className="w-4 h-4" />
          Finalizar Ordenes
        </Button>
        <Link href="/orden-de-compra/GenerarOrdenDeCompra">
          <Button className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Generar Orden De Compra
          </Button>
        </Link>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-lg ${vistaActual === "modificar-cancelar" ? "bg-yellow-600/20" : "bg-blue-600/20"}`}
              >
                {vistaActual === "modificar-cancelar" ? (
                  <Clock className="w-5 h-5 text-yellow-400" />
                ) : (
                  <Send className="w-5 h-5 text-blue-400" />
                )}
              </div>
              <div>
                <p className="text-sm text-slate-400">
                  {vistaActual === "modificar-cancelar" ? "Órdenes Pendientes" : "Órdenes Enviadas"}
                </p>
                <p className="text-2xl font-bold text-slate-100">{ordenesActuales.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-600/20 rounded-lg">
                {vistaActual === "modificar-cancelar" ? (
                  <Edit className="w-5 h-5 text-purple-400" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-purple-400" />
                )}
              </div>
              <div>
                <p className="text-sm text-slate-400">Acciones Disponibles</p>
                <p className="text-2xl font-bold text-slate-100">
                  {vistaActual === "modificar-cancelar" ? ordenesActuales.length * 2 : ordenesActuales.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de órdenes */}
      <Card className="bg-slate-800 border-slate-700 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-purple-900 to-slate-800 rounded-t-lg">
          <CardTitle className="text-2xl text-purple-100 flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
            {tituloTabla}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {ordenesActuales.length > 0 ? (
            <>
              <div className="rounded-lg overflow-hidden border border-slate-700 overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-700 hover:bg-slate-700 border-slate-600">
                      <TableHead className="text-purple-200 font-semibold">ID</TableHead>
                      <TableHead className="text-purple-200 font-semibold">Nombre Proveedor</TableHead>
                      <TableHead className="text-purple-200 font-semibold">Fecha Alta</TableHead>
                      <TableHead className="text-purple-200 font-semibold">Estado</TableHead>
                      <TableHead className="text-purple-200 font-semibold text-center">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ordenesActuales.map((orden, index) => (
                      <TableRow
                        key={orden.id}
                        className={`
                          ${index % 2 === 0 ? "bg-slate-800" : "bg-slate-750"} 
                          hover:bg-slate-700 border-slate-600 transition-colors
                        `}
                      >
                        <TableCell className="text-slate-300 font-mono">#{orden.id}</TableCell>
                        <TableCell className="text-slate-100 font-medium">{orden.nombreProveedor}</TableCell>
                        <TableCell className="text-slate-300">{formatearFecha(orden.fechaAlta)}</TableCell>
                        <TableCell>
                          {vistaActual === "modificar-cancelar" ? (
                            <Badge className="bg-yellow-600 text-slate-900 hover:bg-yellow-700">
                              <Clock className="w-3 h-3 mr-1" />
                              {orden.estado}
                            </Badge>
                          ) : (
                            <Badge className="bg-blue-600 text-white hover:bg-blue-700">
                              <Send className="w-3 h-3 mr-1" />
                              {orden.estado}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-2">
                            {vistaActual === "modificar-cancelar" ? (
                              <>
                                <Button
                                  onClick={() => handleModificar(orden.id, orden.nombreProveedor)}
                                  size="sm"
                                  className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1"
                                >
                                  <Edit className="w-3 h-3" />
                                  Modificar
                                </Button>
                                <Button
                                  onClick={() => handleCancelar(orden.id, orden.nombreProveedor)}
                                  size="sm"
                                  variant="destructive"
                                  className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-1"
                                >
                                  <X className="w-3 h-3" />
                                  Cancelar
                                </Button>
                              </>
                            ) : (
                              <Button
                                onClick={() => handleFinalizar(orden.id, orden.nombreProveedor)}
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-1"
                              >
                                <CheckCircle className="w-3 h-3" />
                                Finalizar
                              </Button>
                            )}
                          </div>
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
                    <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                    <span className="text-slate-300">
                      Total de órdenes {vistaActual === "modificar-cancelar" ? "pendientes" : "enviadas"}:{" "}
                    </span>
                    <span className="text-purple-400 font-semibold">{ordenesActuales.length}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${vistaActual === "modificar-cancelar" ? "bg-yellow-400" : "bg-blue-400"}`}
                    ></div>
                    <span className="text-slate-300">Estado: </span>
                    <span
                      className={`font-semibold ${vistaActual === "modificar-cancelar" ? "text-yellow-400" : "text-blue-400"}`}
                    >
                      {vistaActual === "modificar-cancelar" ? "Todas pendientes" : "Todas enviadas"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span className="text-slate-300">Acciones disponibles: </span>
                    <span className="text-green-400 font-semibold">
                      {vistaActual === "modificar-cancelar" ? "Modificar y Cancelar" : "Finalizar"}
                    </span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              {vistaActual === "modificar-cancelar" ? (
                <Clock className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              ) : (
                <Send className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              )}
              <h3 className="text-xl font-semibold text-slate-300 mb-2">
                No hay órdenes {vistaActual === "modificar-cancelar" ? "pendientes" : "enviadas"}
              </h3>
              <p className="text-slate-400">
                {vistaActual === "modificar-cancelar"
                  ? "Todas las órdenes han sido procesadas o no hay órdenes registradas en estado pendiente."
                  : "No hay órdenes enviadas disponibles para finalizar."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
