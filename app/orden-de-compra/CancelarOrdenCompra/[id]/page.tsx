"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, XCircle, AlertTriangle, CheckCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// Interfaces para los datos
interface DTOEstadoOC {
  nombreEstado: string
}

export default function CancelarOrdenCompraPage() {
  const params = useParams()
  const router = useRouter()
  const ordenId = params.id as string

  const [estado, setEstado] = useState<DTOEstadoOC | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCancelling, setIsCancelling] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  // URLs base para los endpoints
  const API_URL_CANCELAR = "http://localhost:8080/CancelarOrdenDeCompra"

  // Cargar estado de la orden al montar el componente
  useEffect(() => {
    const fetchEstadoData = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(
          `${API_URL_CANCELAR}/getEstadoOC?idOC=${ordenId}`,
        )

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`)
        }

        const data: DTOEstadoOC = await response.json()
        setEstado(data)
        setError(null)
      } catch (err) {
        console.error("Error al obtener estado de la orden:", err)
        setError(err instanceof Error ? err.message : "Error desconocido")
      } finally {
        setIsLoading(false)
      }
    }

    if (ordenId) {
      fetchEstadoData()
    }
  }, [ordenId])

  const handleCancelar = async () => {
    if (!estado) return

    setIsCancelling(true)

    try {
      const response = await fetch(`${API_URL_CANCELAR}/cancelarOrden?idOC=${ordenId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      alert(`Orden de compra #${ordenId} cancelada exitosamente`)
      router.push("/orden-de-compra/OrdenesCompra")
    } catch (error) {
      console.error("Error al cancelar orden de compra:", error)
      alert(`Error al cancelar la orden: ${error instanceof Error ? error.message : "Error desconocido"}`)
    } finally {
      setIsCancelling(false)
      setShowConfirmDialog(false)
    }
  }

  const canCancel = estado?.nombreEstado === "Pendiente"

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-red-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-400">Verificando estado de la orden...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !estado) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-400 text-2xl">⚠</span>
            </div>
            <h3 className="text-xl font-semibold text-slate-300 mb-2">Error al cargar orden</h3>
            <p className="text-slate-400 mb-4">{error || "Orden no encontrada"}</p>
            <Link href="/orden-de-compra/OrdenesCompra">
              <Button className="bg-green-600 hover:bg-green-700">Volver a Órdenes de Compra</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      {/* Header con botón de volver */}
      <div className="mb-8">
        <Link
          href="/orden-de-compra/OrdenesCompra"
          className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a Órdenes de Compra
        </Link>

        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-100 mb-4">Cancelar Orden de Compra</h1>
          <p className="text-slate-400 text-lg">
            Revisando: <span className="text-green-400 font-medium">Orden #{ordenId}</span>
          </p>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-2xl mx-auto">
        <Card className="bg-slate-800 border-slate-700 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-red-900 to-slate-800 rounded-t-lg">
            <CardTitle className="text-2xl text-red-100 flex items-center gap-2">
              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
              Estado de la Orden
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {/* Estado actual */}
            <div className="mb-6 p-4 bg-slate-700 rounded-lg border border-slate-600">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-6 h-6 text-blue-400" />
                <h3 className="text-lg font-semibold text-slate-200">Estado Actual</h3>
              </div>
              <div className="flex items-center gap-3">
                <Badge
                  className={`${
                    estado.nombreEstado === "Pendiente"
                      ? "bg-yellow-600 text-slate-900"
                      : estado.nombreEstado === "Enviada"
                      ? "bg-orange-600 text-white"
                      : estado.nombreEstado === "Finalizada"
                      ? "bg-green-600 text-white"
                      : "bg-red-600 text-white"
                  }`}
                >
                  {estado.nombreEstado}
                </Badge>
                <span className="text-slate-400 text-sm">
                  Orden #{ordenId}
                </span>
              </div>
            </div>

            {/* Verificación de cancelación */}
            {canCancel ? (
              <div className="mb-6 p-4 bg-yellow-900/20 border border-yellow-600/30 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-400" />
                  <h3 className="text-yellow-200 font-medium">Orden Cancelable</h3>
                </div>
                <p className="text-yellow-200 text-sm">
                  Esta orden está en estado "Pendiente" y puede ser cancelada. 
                  Al cancelar, la orden cambiará su estado a "Cancelada" y no podrá ser modificada.
                </p>
              </div>
            ) : (
              <div className="mb-6 p-4 bg-red-900/20 border border-red-600/30 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <XCircle className="w-5 h-5 text-red-400" />
                  <h3 className="text-red-200 font-medium">Orden No Cancelable</h3>
                </div>
                <p className="text-red-200 text-sm">
                  Esta orden no puede ser cancelada porque su estado actual es "{estado.nombreEstado}". 
                  Solo las órdenes en estado "Pendiente" pueden ser canceladas.
                </p>
              </div>
            )}

            {/* Información adicional */}
            <div className="p-4 bg-slate-700 rounded-lg border border-slate-600 mb-6">
              <h3 className="text-slate-200 font-medium mb-2">Información sobre Cancelación</h3>
              <ul className="text-sm text-slate-400 space-y-1">
                <li>• Solo las órdenes en estado "Pendiente" pueden ser canceladas</li>
                <li>• Al cancelar, la orden cambiará su estado a "Cancelada"</li>
                <li>• Una vez cancelada, la orden no podrá ser modificada</li>
                <li>• Los artículos de la orden volverán a estar disponibles</li>
                <li>• La cancelación es irreversible</li>
              </ul>
            </div>

            {/* Botón de cancelación */}
            <div className="flex justify-end pt-4">
              <Button
                onClick={() => setShowConfirmDialog(true)}
                disabled={!canCancel || isCancelling}
                className="bg-red-600 hover:bg-red-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white flex items-center gap-2 px-6 py-2"
              >
                {isCancelling ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Cancelando...
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4" />
                    Cancelar Orden
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Diálogo de confirmación */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent className="bg-slate-800 border-slate-700 text-slate-100">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-400 flex items-center gap-2">
              <XCircle className="w-5 h-5" />
              Confirmar Cancelación
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-300">
              ¿Está seguro que desea cancelar la orden de compra #{ordenId}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <div className="p-3 bg-red-900/20 border border-red-600/30 rounded-lg">
              <p className="text-red-200 text-sm">
                <strong>Advertencia:</strong> Esta acción es irreversible. La orden cambiará su estado a "Cancelada" y no podrá ser modificada.
              </p>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelar}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Confirmar Cancelación
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 