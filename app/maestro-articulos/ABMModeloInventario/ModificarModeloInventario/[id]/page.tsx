"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, Edit } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Interfaz actualizada para el modelo de inventario
interface DTOABMModeloInventario {
  idMI: number
  nombreMI: string
  fhBajaMI: string | null
}

export default function ModificarModeloInventarioPage() {
  const params = useParams()
  const idMI = params.id as string

  const [modelo, setModelo] = useState<DTOABMModeloInventario | null>(null)
  const [nombre, setNombre] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Cargar datos del modelo al montar el componente
  useEffect(() => {
    const fetchModeloData = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(
          `http://localhost:8080/ABMModeloInventario/getDatosModelo?idModeloInventario=${idMI}`,
        )

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`)
        }

        const data: DTOABMModeloInventario = await response.json()
        setModelo(data)
        setNombre(data.nombreMI)
        setError(null)
      } catch (err) {
        console.error("Error al obtener datos del modelo:", err)
        setError(err instanceof Error ? err.message : "Error desconocido")
      } finally {
        setIsLoading(false)
      }
    }

    if (idMI) {
      fetchModeloData()
    }
  }, [idMI])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validación básica
    if (!nombre.trim()) {
      alert("Por favor, ingrese el nombre del modelo de inventario")
      return
    }

    if (!modelo) {
      alert("Error: No se pudieron cargar los datos del modelo")
      return
    }

    setIsSubmitting(true)

    try {
      // Crear el objeto DTO completo para enviar
      const modeloActualizado: DTOABMModeloInventario = {
        ...modelo,
        nombreMI: nombre.trim(),
      }

      const response = await fetch("http://localhost:8080/ABMModeloInventario/modificarModelo", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(modeloActualizado),
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      alert(`Modelo de inventario "${nombre.trim()}" modificado exitosamente`)

      // Actualizar el estado local
      setModelo(modeloActualizado)
    } catch (error) {
      console.error("Error al modificar modelo de inventario:", error)
      alert(`Error al modificar el modelo: ${error instanceof Error ? error.message : "Error desconocido"}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Estado de carga
  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-400">Cargando datos del modelo de inventario...</p>
          </div>
        </div>
      </div>
    )
  }

  // Estado de error
  if (error) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="mb-8">
          <Link
            href="/maestro-articulos/ABMModeloInventario"
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a ABM Modelo de Inventario
          </Link>
        </div>

        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-400 text-2xl">⚠</span>
            </div>
            <h3 className="text-xl font-semibold text-slate-300 mb-2">Error al cargar modelo</h3>
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
      {/* Header con botón de volver */}
      <div className="mb-8">
        <Link
          href="/maestro-articulos/ABMModeloInventario"
          className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a ABM Modelo de Inventario
        </Link>

        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-100 mb-4">Modificar Modelo de Inventario</h1>
          <p className="text-slate-400 text-lg">Modifique la información del modelo de inventario</p>
        </div>
      </div>

      {/* Formulario */}
      <div className="max-w-2xl mx-auto">
        <Card className="bg-slate-800 border-slate-700 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-900 to-slate-800 rounded-t-lg">
            <CardTitle className="text-2xl text-blue-100 flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              Datos del Modelo de Inventario
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {/* Información del modelo */}
            <div className="mb-6 p-4 bg-slate-700 rounded-lg border border-slate-600">
              <h3 className="text-slate-200 font-medium mb-2">Información del Modelo</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-400">ID:</span>
                  <span className="text-slate-100 font-mono ml-2">{modelo?.idMI}</span>
                </div>
                <div>
                  <span className="text-slate-400">Estado:</span>
                  <span className={`ml-2 ${modelo?.fhBajaMI ? "text-red-400" : "text-green-400"}`}>
                    {modelo?.fhBajaMI ? `Dado de baja: ${modelo.fhBajaMI}` : "Activo"}
                  </span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Campo Nombre */}
              <div className="space-y-2">
                <Label htmlFor="nombre" className="text-slate-200 font-medium">
                  Nombre del Modelo de Inventario *
                </Label>
                <Input
                  id="nombre"
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ingrese el nombre del modelo de inventario"
                  className="bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500"
                  required
                  disabled={isSubmitting}
                />
                <p className="text-xs text-slate-400">
                  Modifique el nombre descriptivo para el modelo de inventario (ej: "Tiempo Fijo", "Lote Fijo", etc.)
                </p>
              </div>

              {/* Información adicional */}
              <div className="p-4 bg-slate-700 rounded-lg border border-slate-600">
                <h3 className="text-slate-200 font-medium mb-2">Información</h3>
                <ul className="text-sm text-slate-400 space-y-1">
                  <li>• El nombre del modelo de inventario es obligatorio</li>
                  <li>• Asegúrese de que el nombre sea único en el sistema</li>
                  <li>• Use nombres descriptivos como "Tiempo Fijo", "Lote Fijo", "Just in Time", etc.</li>
                  <li>• Los cambios se aplicarán inmediatamente al confirmar</li>
                </ul>
              </div>

              {/* Botón de envío */}
              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting || !nombre.trim() || nombre.trim() === modelo?.nombreMI}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white flex items-center gap-2 px-6 py-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Modificando...
                    </>
                  ) : (
                    <>
                      <Edit className="w-4 h-4" />
                      Modificar Modelo Inventario
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Información adicional */}
        <div className="mt-6 p-4 bg-slate-800 rounded-lg border border-slate-700">
          <h4 className="text-slate-200 font-medium mb-2">¿Qué sucede después?</h4>
          <div className="text-sm text-slate-400 space-y-1">
            <p>• Los cambios se aplicarán inmediatamente en el sistema</p>
            <p>• El modelo modificado estará disponible para asociar con artículos</p>
            <p>• Se registrará la fecha y hora de modificación automáticamente</p>
            <p>• Puede volver a la lista para ver todos los modelos actualizados</p>
          </div>
        </div>
      </div>
    </div>
  )
}
