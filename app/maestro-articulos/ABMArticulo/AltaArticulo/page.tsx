"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Plus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

// DTO para el alta de artículo
interface DTOABMArticulo {
  costoAlmacenamiento: number
  demanda: number
  descripcionArt: string
  inventarioMaxArticulo: number
  nombre: string
  precioUnitario: number
  stock: number
}

export default function AltaArticuloPage() {
  const [formData, setFormData] = useState<DTOABMArticulo>({
    costoAlmacenamiento: 0,
    demanda: 0,
    descripcionArt: "",
    inventarioMaxArticulo: 0,
    nombre: "",
    precioUnitario: 0,
    stock: 0,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Partial<DTOABMArticulo>>({})

  const handleInputChange = (field: keyof DTOABMArticulo, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }))
    }
  }
  /*
  const validateForm = (): boolean => {
    const newErrors: Partial<DTOABMArticulo> = {}

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio"
    }

    if (!formData.descripcionArt.trim()) {
      newErrors.descripcionArt = "La descripción es obligatoria"
    }

    if (formData.precioUnitario <= 0) {
      newErrors.precioUnitario = "El precio unitario debe ser mayor a 0"
    }

    if (formData.costoAlmacenamiento < 0) {
      newErrors.costoAlmacenamiento = "El costo de almacenamiento no puede ser negativo"
    }

    if (formData.stock < 0) {
      newErrors.stock = "El stock no puede ser negativo"
    }

    if (formData.inventarioMaxArticulo <= 0) {
      newErrors.inventarioMaxArticulo = "El inventario máximo debe ser mayor a 0"
    }

    if (formData.demanda < 0) {
      newErrors.demanda = "La demanda no puede ser negativa"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    /*
    if (!validateForm()) {
      return
    }
    */

    setIsLoading(true)

    try {
      const response = await fetch("http://localhost:8080/ABMArticulo/alta", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      alert(`Artículo "${formData.nombre}" creado exitosamente`)

      // Limpiar el formulario
      setFormData({
        costoAlmacenamiento: 0,
        demanda: 0,
        descripcionArt: "",
        inventarioMaxArticulo: 0,
        nombre: "",
        precioUnitario: 0,
        stock: 0,
      })
    } catch (error) {
      console.error("Error al crear artículo:", error)
      alert(`Error al crear el artículo: ${error instanceof Error ? error.message : "Error desconocido"}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      {/* Header con botón de volver */}
      <div className="mb-8">
        <Link
          href="/maestro-articulos/ABMArticulo"
          className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a ABM Artículo
        </Link>

        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-100 mb-4">Agregar Nuevo Artículo</h1>
          <p className="text-slate-400 text-lg">Complete la información del nuevo artículo</p>
        </div>
      </div>

      {/* Formulario */}
      <div className="max-w-4xl mx-auto">
        <Card className="bg-slate-800 border-slate-700 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-900 to-slate-800 rounded-t-lg">
            <CardTitle className="text-2xl text-blue-100 flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              Datos del Artículo
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Grid de campos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nombre */}
                <div className="space-y-2">
                  <Label htmlFor="nombre" className="text-slate-200 font-medium">
                    Nombre del Artículo *
                  </Label>
                  <Input
                    id="nombre"
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => handleInputChange("nombre", e.target.value)}
                    placeholder="Ingrese el nombre del artículo"
                    className={`bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500 ${
                      errors.nombre ? "border-red-500" : ""
                    }`}
                    disabled={isLoading}
                  />
                  {errors.nombre && <p className="text-red-400 text-sm">{errors.nombre}</p>}
                </div>

                {/* Precio Unitario */}
                <div className="space-y-2">
                  <Label htmlFor="precioUnitario" className="text-slate-200 font-medium">
                    Precio Unitario *
                  </Label>
                  <Input
                    id="precioUnitario"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.precioUnitario}
                    onChange={(e) => handleInputChange("precioUnitario", Number.parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    className={`bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500 ${
                      errors.precioUnitario ? "border-red-500" : ""
                    }`}
                    disabled={isLoading}
                  />
                  {errors.precioUnitario && <p className="text-red-400 text-sm">{errors.precioUnitario}</p>}
                </div>

                {/* Costo Almacenamiento */}
                <div className="space-y-2">
                  <Label htmlFor="costoAlmacenamiento" className="text-slate-200 font-medium">
                    Costo de Almacenamiento
                  </Label>
                  <Input
                    id="costoAlmacenamiento"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.costoAlmacenamiento}
                    onChange={(e) => handleInputChange("costoAlmacenamiento", Number.parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    className={`bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500 ${
                      errors.costoAlmacenamiento ? "border-red-500" : ""
                    }`}
                    disabled={isLoading}
                  />
                  {errors.costoAlmacenamiento && <p className="text-red-400 text-sm">{errors.costoAlmacenamiento}</p>}
                </div>

                {/* Stock */}
                <div className="space-y-2">
                  <Label htmlFor="stock" className="text-slate-200 font-medium">
                    Stock Inicial
                  </Label>
                  <Input
                    id="stock"
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => handleInputChange("stock", Number.parseInt(e.target.value) || 0)}
                    placeholder="0"
                    className={`bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500 ${
                      errors.stock ? "border-red-500" : ""
                    }`}
                    disabled={isLoading}
                  />
                  {errors.stock && <p className="text-red-400 text-sm">{errors.stock}</p>}
                </div>

                {/* Inventario Máximo */}
                <div className="space-y-2">
                  <Label htmlFor="inventarioMaxArticulo" className="text-slate-200 font-medium">
                    Inventario Máximo *
                  </Label>
                  <Input
                    id="inventarioMaxArticulo"
                    type="number"
                    min="1"
                    value={formData.inventarioMaxArticulo}
                    onChange={(e) => handleInputChange("inventarioMaxArticulo", Number.parseInt(e.target.value) || 0)}
                    placeholder="0"
                    className={`bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500 ${
                      errors.inventarioMaxArticulo ? "border-red-500" : ""
                    }`}
                    disabled={isLoading}
                  />
                  {errors.inventarioMaxArticulo && (
                    <p className="text-red-400 text-sm">{errors.inventarioMaxArticulo}</p>
                  )}
                </div>

                {/* Demanda */}
                <div className="space-y-2">
                  <Label htmlFor="demanda" className="text-slate-200 font-medium">
                    Demanda
                  </Label>
                  <Input
                    id="demanda"
                    type="number"
                    min="0"
                    value={formData.demanda}
                    onChange={(e) => handleInputChange("demanda", Number.parseInt(e.target.value) || 0)}
                    placeholder="0"
                    className={`bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500 ${
                      errors.demanda ? "border-red-500" : ""
                    }`}
                    disabled={isLoading}
                  />
                  {errors.demanda && <p className="text-red-400 text-sm">{errors.demanda}</p>}
                </div>
              </div>

              {/* Descripción - Campo completo */}
              <div className="space-y-2">
                <Label htmlFor="descripcionArt" className="text-slate-200 font-medium">
                  Descripción del Artículo *
                </Label>
                <Textarea
                  id="descripcionArt"
                  value={formData.descripcionArt}
                  onChange={(e) => handleInputChange("descripcionArt", e.target.value)}
                  placeholder="Ingrese una descripción detallada del artículo"
                  className={`bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500 min-h-[100px] ${
                    errors.descripcionArt ? "border-red-500" : ""
                  }`}
                  disabled={isLoading}
                />
                {errors.descripcionArt && <p className="text-red-400 text-sm">{errors.descripcionArt}</p>}
              </div>

              {/* Información adicional */}
              <div className="p-4 bg-slate-700 rounded-lg border border-slate-600">
                <h3 className="text-slate-200 font-medium mb-2">Información</h3>
                <ul className="text-sm text-slate-400 space-y-1">
                  <li>• Los campos marcados con (*) son obligatorios</li>
                  <li>• El precio unitario debe ser mayor a 0</li>
                  <li>• El inventario máximo debe ser mayor a 0</li>
                  <li>• Los valores numéricos no pueden ser negativos</li>
                </ul>
              </div>

              {/* Botón de envío */}
              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  disabled={isLoading}
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
                      Crear Artículo
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
            <p>• El artículo será agregado al sistema con estado "Activo"</p>
            <p>• Podrá modificar o eliminar el artículo desde la lista de ABM Artículo</p>
            <p>• El artículo estará disponible para asociar con proveedores y órdenes de compra</p>
            <p>• Se registrará la fecha y hora de creación automáticamente</p>
          </div>
        </div>
      </div>
    </div>
  )
}
