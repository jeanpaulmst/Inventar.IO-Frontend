"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Plus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function AltaProveedorPage() {
  const [nombre, setNombre] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validación básica
    if (!nombre.trim()) {
      alert("Por favor, ingrese el nombre del proveedor")
      return
    }

    setIsLoading(true)

    try {
      // Aquí iría la lógica para agregar el proveedor
      console.log("Agregando proveedor:", { nombre: nombre.trim() })

      // Simulamos una llamada a la API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      alert(`Proveedor "${nombre.trim()}" agregado exitosamente`)

      // Limpiar el formulario
      setNombre("")
    } catch (error) {
      console.error("Error al agregar proveedor:", error)
      alert("Error al agregar el proveedor. Por favor, intente nuevamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <div className="container mx-auto py-8 px-4">
        {/* Header with back button */}
        <div className="mb-8">
          <Link
            href="/proveedores/ABMProveedor"
            className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a ABM Proveedor
          </Link>

          <div className="text-center">
            <h1 className="text-4xl font-bold text-slate-100 mb-4">Agregar Nuevo Proveedor</h1>
            <p className="text-slate-400 text-lg">Complete la información del nuevo proveedor</p>
          </div>
        </div>

        {/* Formulario */}
        <div className="max-w-2xl mx-auto">
          <Card className="bg-slate-800 border-slate-700 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-green-900 to-slate-800 rounded-t-lg">
              <CardTitle className="text-2xl text-green-100 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                Datos del Proveedor
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Campo Nombre */}
                <div className="space-y-2">
                  <Label htmlFor="nombre" className="text-slate-200 font-medium">
                    Nombre del Proveedor *
                  </Label>
                  <Input
                    id="nombre"
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ingrese el nombre del proveedor"
                    className="bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400 focus:border-green-500 focus:ring-green-500"
                    required
                    disabled={isLoading}
                  />
                  <p className="text-xs text-slate-400">Ingrese el nombre completo o razón social del proveedor</p>
                </div>

                {/* Información adicional */}
                <div className="p-4 bg-slate-700 rounded-lg border border-slate-600">
                  <h3 className="text-slate-200 font-medium mb-2">Información</h3>
                  <ul className="text-sm text-slate-400 space-y-1">
                    <li>• El nombre del proveedor es obligatorio</li>
                    <li>• Asegúrese de que el nombre sea único en el sistema</li>
                    <li>• Puede modificar esta información posteriormente</li>
                  </ul>
                </div>

                {/* Botón de envío */}
                <div className="flex justify-end pt-4">
                  <Button
                    type="submit"
                    disabled={isLoading || !nombre.trim()}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white flex items-center gap-2 px-6 py-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Agregando...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        Agregar Proveedor
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
              <p>• El proveedor será agregado al sistema con estado "Activo"</p>
              <p>• Podrá modificar o eliminar el proveedor desde la lista de ABM Proveedor</p>
              <p>• El proveedor estará disponible para asociar con artículos y órdenes de compra</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
