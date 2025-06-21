"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Save } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

// Tipos
interface Articulo {
  id: number
  costoAlmacenamiento: number
  descripcionArt: string
  fhBajaArticulo: string | null
  inventarioMaxArticulo: number
  nombre: string
  precioUnitario: number
  stock: number
}

interface DTOABMArticulo {
  costoAlmacenamiento: number
  demanda: number
  descripcionArt: string
  inventarioMaxArticulo: number
  nombre: string
  precioUnitario: number
  stock: number
}

export default function ModificarArticuloPage() {
  const params = useParams()
  const router = useRouter()
  const articuloId = params.id as string

  const [articulo, setArticulo] = useState<Articulo | null>(null)
  const [formData, setFormData] = useState<DTOABMArticulo>({
    costoAlmacenamiento: 0,
    demanda: 0,
    descripcionArt: "",
    inventarioMaxArticulo: 0,
    nombre: "",
    precioUnitario: 0,
    stock: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [errors, setErrors] = useState<Partial<DTOABMArticulo>>({})

  // Cargar datos del artículo
  useEffect(() => {
    const fetchArticulo = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`http://localhost:8080/ABMArticulo/getArticulo?id=${articuloId}`)

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`)
        }

        const data: Articulo = await response.json()
        setArticulo(data)

        // Llenar el formulario con los datos del artículo
        setFormData({
          costoAlmacenamiento: data.costoAlmacenamiento,
          demanda: 0, // Este campo no viene en la respuesta, se mantiene en 0
          descripcionArt: data.descripcionArt,
          inventarioMaxArticulo: data.inventarioMaxArticulo,
          nombre: data.nombre,
          precioUnitario: data.precioUnitario,
          stock: data.stock,
        })

        setError(null)
      } catch (err) {
        console.error("Error al cargar artículo:", err)
        setError(err instanceof Error ? err.message : "Error desconocido")
      } finally {
        setIsLoading(false)
      }
    }

    if (articuloId) {
      fetchArticulo()
    }
  }, [articuloId])

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
    setIsSaving(true)

    try {
      // Crear el objeto Articulo completo con el ID incluido
      const articuloModificado = {
        id: articulo!.id, // Incluir el ID del artículo
        costoAlmacenamiento: formData.costoAlmacenamiento,
        descripcionArt: formData.descripcionArt,
        fhBajaArticulo: articulo!.fhBajaArticulo, // Mantener la fecha de baja original
        inventarioMaxArticulo: formData.inventarioMaxArticulo,
        nombre: formData.nombre,
        precioUnitario: formData.precioUnitario,
        stock: formData.stock,
      }

      const response = await fetch("http://localhost:8080/ABMArticulo/modificar", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(articuloModificado),
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      alert(`Artículo "${formData.nombre}" modificado exitosamente`)
      router.push("/maestro-articulos/ABMArticulo")
    } catch (error) {
      console.error("Error al modificar artículo:", error)
      alert(`Error al modificar el artículo: ${error instanceof Error ? error.message : "Error desconocido"}`)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-400">Cargando artículo...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !articulo) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-400 text-2xl">⚠</span>
            </div>
            <h3 className="text-xl font-semibold text-slate-300 mb-2">Error al cargar artículo</h3>
            <p className="text-slate-400 mb-4">{error || "Artículo no encontrado"}</p>
            <Link href="/maestro-articulos/ABMArticulo">
              <Button className="bg-blue-600 hover:bg-blue-700">Volver a ABM Artículo</Button>
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
          href="/maestro-articulos/ABMArticulo"
          className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a ABM Artículo
        </Link>

        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-100 mb-4">Modificar Artículo</h1>
          <p className="text-slate-400 text-lg">
            Editando: <span className="text-blue-400 font-medium">{articulo.nombre}</span> (ID: {articulo.id})
          </p>
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
                    disabled={isSaving}
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
                    disabled={isSaving}
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
                    disabled={isSaving}
                  />
                  {errors.costoAlmacenamiento && <p className="text-red-400 text-sm">{errors.costoAlmacenamiento}</p>}
                </div>

                {/* Stock */}
                <div className="space-y-2">
                  <Label htmlFor="stock" className="text-slate-200 font-medium">
                    Stock
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
                    disabled={isSaving}
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
                    disabled={isSaving}
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
                    disabled={isSaving}
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
                  disabled={isSaving}
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
                  disabled={isSaving}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white flex items-center gap-2 px-6 py-2"
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Modificar Artículo
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Información adicional */}
        <div className="mt-6 p-4 bg-slate-800 rounded-lg border border-slate-700">
          <h4 className="text-slate-200 font-medium mb-2">Información del artículo original</h4>
          <div className="text-sm text-slate-400 space-y-1">
            <p>• ID: {articulo.id}</p>
            <p>• Fecha de baja: {articulo.fhBajaArticulo || "Activo"}</p>
            <p>• Los cambios se aplicarán inmediatamente al confirmar</p>
          </div>
        </div>
      </div>
    </div>
  )
}
