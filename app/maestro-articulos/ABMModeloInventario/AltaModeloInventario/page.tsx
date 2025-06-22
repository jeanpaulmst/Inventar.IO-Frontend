"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Plus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function AltaModeloInventarioPage() {
  const [nombre, setNombre] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validación básica
    if (!nombre.trim()) {
      alert("Por favor, ingrese el nombre del modelo de inventario")
      return
    }

    setIsLoading(true)

    try {
      // Usar la URL con query parameter como especificaste
      const response = await fetch(
        `http://localhost:8080/ABMModeloInventario/altaModelo?nombreModelo=${encodeURIComponent(nombre.trim())}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        },
      )

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      alert(`Modelo de inventario "${nombre.trim()}" creado exitosamente`)

      // Limpiar el formulario
      setNombre("")
    } catch (error) {
      console.error("Error al crear modelo de inventario:", error)
      alert(`Error al crear el modelo: ${error instanceof Error ? error.message : "Error desconocido"}`)
    } finally {
      setIsLoading(false)
    }
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
          <h1 className="text-4xl font-bold text-slate-100 mb-4">Agregar Nuevo Modelo de Inventario</h1>
          <p className="text-slate-400 text-lg">Complete la información del nuevo modelo de inventario</p>
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
                  disabled={isLoading}
                />
                <p className="text-xs text-slate-400">
                  Ingrese un nombre descriptivo para el modelo de inventario (ej: "Tiempo Fijo", "Lote Fijo", etc.)
                </p>
              </div>

              {/* Información adicional */}
              <div className="p-4 bg-slate-700 rounded-lg border border-slate-600">
                <h3 className="text-slate-200 font-medium mb-2">Información</h3>
                <ul className="text-sm text-slate-400 space-y-1">
                  <li>• El nombre del modelo de inventario es obligatorio</li>
                  <li>• Asegúrese de que el nombre sea único en el sistema</li>
                  <li>• Use nombres descriptivos como "Tiempo Fijo", "Lote Fijo", "Just in Time", etc.</li>
                  <li>• Puede modificar esta información posteriormente</li>
                </ul>
              </div>

              {/* Botón de envío */}
              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  disabled={isLoading || !nombre.trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white flex items-center gap-2 px-6 py-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Creando...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Crear Modelo de Inventario
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
            <p>• El modelo de inventario será agregado al sistema con estado "Activo"</p>
            <p>• Podrá modificar o eliminar el modelo desde la lista de ABM Modelo de Inventario</p>
            <p>• El modelo estará disponible para asociar con artículos</p>
            <p>• Se registrará la fecha y hora de creación automáticamente</p>
          </div>
        </div>
      </div>
    </div>
  )
}
