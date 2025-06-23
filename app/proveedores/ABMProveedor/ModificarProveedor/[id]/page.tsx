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

// Interfaz para el proveedor
interface Proveedor {
  idProveedor: number
  nombreProveedor: string
  fhBajaProveedor: string | null
}

interface DTOProveedor {
  nombreProveedor: string
}

export default function ModificarProveedorPage() {
  const params = useParams()
  const router = useRouter()
  const proveedorId = params.id as string

  const [proveedor, setProveedor] = useState<Proveedor | null>(null)
  const [formData, setFormData] = useState<DTOProveedor>({
    nombreProveedor: "",
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [errors, setErrors] = useState<Partial<DTOProveedor>>({})

  // URLs base para los endpoints
  const API_URL = process.env.NEXT_PUBLIC_API_URL

  // Cargar datos del proveedor al montar el componente
  useEffect(() => {
    const fetchProveedorData = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(
          `${API_URL}/ABMProveedor/getDatosProveedor?idProveedor=${proveedorId}`,
        )

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`)
        }

        const data: any = await response.json()
        
        setProveedor({
          idProveedor: data.idProveedor,
          nombreProveedor: data.nombreProveedor,
          fhBajaProveedor: data.fhBajaProveedor,
        })
        setFormData({
          nombreProveedor: data.nombreProveedor,
        })
        setError(null)
      } catch (err) {
        console.error("Error al obtener datos del proveedor:", err)
        setError(err instanceof Error ? err.message : "Error desconocido")
      } finally {
        setIsLoading(false)
      }
    }

    if (proveedorId) {
      fetchProveedorData()
    }
  }, [proveedorId])

  const handleInputChange = (field: keyof DTOProveedor, value: string) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validación básica
    if (!formData.nombreProveedor.trim()) {
      setErrors({ nombreProveedor: "El nombre del proveedor es obligatorio" })
      return
    }

    setIsSaving(true)

    try {
      // Crear el objeto DTOProveedor para enviar
      const dtoProveedor = {
        idProveedor: proveedor!.idProveedor,
        nombreProveedor: formData.nombreProveedor.trim(),
        fhBajaProveedor: proveedor!.fhBajaProveedor,
        dadoBaja: proveedor!.fhBajaProveedor !== null,
      }

      const response = await fetch(`${API_URL}/ABMProveedor/confirmar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dtoProveedor),
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      alert(`Proveedor "${formData.nombreProveedor.trim()}" modificado exitosamente`)
      router.push("/proveedores/ABMProveedor")
    } catch (error) {
      console.error("Error al modificar proveedor:", error)
      alert(`Error al modificar el proveedor: ${error instanceof Error ? error.message : "Error desconocido"}`)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-green-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-400">Cargando proveedor...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !proveedor) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-400 text-2xl">⚠</span>
            </div>
            <h3 className="text-xl font-semibold text-slate-300 mb-2">Error al cargar proveedor</h3>
            <p className="text-slate-400 mb-4">{error || "Proveedor no encontrado"}</p>
            <Link href="/proveedores/ABMProveedor">
              <Button className="bg-green-600 hover:bg-green-700">Volver a ABM Proveedor</Button>
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
          href="/proveedores/ABMProveedor"
          className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a ABM Proveedor
        </Link>

        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-100 mb-4">Modificar Proveedor</h1>
          <p className="text-slate-400 text-lg">
            Editando: <span className="text-green-400 font-medium">{proveedor.nombreProveedor}</span> (ID: {proveedor.idProveedor})
          </p>
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
                <Label htmlFor="nombreProveedor" className="text-slate-200 font-medium">
                  Nombre del Proveedor *
                </Label>
                <Input
                  id="nombreProveedor"
                  type="text"
                  value={formData.nombreProveedor}
                  onChange={(e) => handleInputChange("nombreProveedor", e.target.value)}
                  placeholder="Ingrese el nombre del proveedor"
                  className={`bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400 focus:border-green-500 focus:ring-green-500 ${
                    errors.nombreProveedor ? "border-red-500" : ""
                  }`}
                  disabled={isSaving}
                />
                {errors.nombreProveedor && <p className="text-red-400 text-sm">{errors.nombreProveedor}</p>}
              </div>

              {/* Información adicional */}
              <div className="p-4 bg-slate-700 rounded-lg border border-slate-600">
                <h3 className="text-slate-200 font-medium mb-2">Información</h3>
                <ul className="text-sm text-slate-400 space-y-1">
                  <li>• Los campos marcados con (*) son obligatorios</li>
                  <li>• El nombre del proveedor debe ser único</li>
                  <li>• Los cambios se aplicarán inmediatamente al confirmar</li>
                </ul>
              </div>

              {/* Botón de envío */}
              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white flex items-center gap-2 px-6 py-2"
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Modificar Proveedor
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Información adicional */}
        <div className="mt-6 p-4 bg-slate-800 rounded-lg border border-slate-700">
          <h4 className="text-slate-200 font-medium mb-2">Información del proveedor original</h4>
          <div className="text-sm text-slate-400 space-y-1">
            <p>• ID: {proveedor.idProveedor}</p>
            <p>• Fecha de baja: {proveedor.fhBajaProveedor || "Activo"}</p>
            <p>• Los cambios se aplicarán inmediatamente al confirmar</p>
          </div>
        </div>
      </div>
    </div>
  )
} 