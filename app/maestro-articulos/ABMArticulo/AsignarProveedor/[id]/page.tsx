"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Save, Package, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

// Tipos
interface Articulo {
  id: number
  nombre: string
  descripcionArt: string
  precioUnitario: number
  stock: number
}

interface Proveedor {
  idProveedor: number
  nombreProveedor: string
  fhBajaProveedor: string | null
}

interface ModeloInventario {
  idMI: number
  nombreMI: string
}

interface DTOAsignarProveedor {
  id?: number
  articuloId: number
  proveedorId: number
  modeloInventarioId: number
  costoPedido: number
  costoUnitario: number
  demoraEntrega: number
  isPredeterminado: boolean
  stockSeguridad: number
  nivelServicio: number
  proximaRevision?: string
  tiempoFijo: number
}

export default function AsignarProveedorPage() {
  const params = useParams()
  const router = useRouter()
  const articuloId = Number(params.id)

  // Validar que el ID sea un número válido
  if (isNaN(articuloId)) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-400 text-2xl">⚠</span>
            </div>
            <h3 className="text-xl font-semibold text-slate-300 mb-2">ID de artículo inválido</h3>
            <p className="text-slate-400 mb-4">El ID del artículo no es válido.</p>
            <Button onClick={() => router.back()} className="bg-blue-600 hover:bg-blue-700">
              Volver
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const [articulos, setArticulos] = useState<Articulo[]>([])
  const [proveedores, setProveedores] = useState<Proveedor[]>([])
  const [modelosInventario, setModelosInventario] = useState<ModeloInventario[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Estado del formulario
  const [formData, setFormData] = useState<DTOAsignarProveedor>({
    articuloId: articuloId,
    proveedorId: 0,
    modeloInventarioId: 0,
    costoPedido: 0,
    costoUnitario: 0,
    demoraEntrega: 0,
    isPredeterminado: false,
    stockSeguridad: 0,
    nivelServicio: 0,
    tiempoFijo: 0,
    proximaRevision: ""
  })

  const API_URL = process.env.NEXT_PUBLIC_API_URL

  // Cargar datos iniciales
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        
        // Cargar artículos
        const articulosResponse = await fetch(`${API_URL}/ABMArticulo/getAll?soloVigentes=true`, {
          headers: {
            'Content-Type': 'application/json',
          }
        })
        if (articulosResponse.ok) {
          const articulosData = await articulosResponse.json()
          setArticulos(articulosData || [])
        } else {
          console.warn("Error al cargar artículos:", articulosResponse.status)
          setArticulos([])
        }

        // Cargar proveedores
        const proveedoresResponse = await fetch(`${API_URL}/ABMProveedor/getProveedores?soloVigentes=true`, {
          headers: {
            'Content-Type': 'application/json',
          }
        })
        if (proveedoresResponse.ok) {
          const proveedoresData = await proveedoresResponse.json()
          setProveedores(proveedoresData || [])
        } else {
          console.warn("Error al cargar proveedores:", proveedoresResponse.status)
          setProveedores([])
        }

        // Cargar modelos de inventario
        const modelosResponse = await fetch(`${API_URL}/ABMModeloInventario/getModelos?soloVigentes=true`, {
          headers: {
            'Content-Type': 'application/json',
          }
        })
        if (modelosResponse.ok) {
          const modelosData = await modelosResponse.json()
          setModelosInventario(modelosData || [])
        } else {
          console.warn("Error al cargar modelos de inventario:", modelosResponse.status)
          setModelosInventario([])
        }

        setError(null)
      } catch (err) {
        console.error("Error al cargar datos:", err)
        setError(err instanceof Error ? err.message : "Error desconocido")
      } finally {
        setLoading(false)
      }
    }

    if (articuloId && !isNaN(articuloId)) {
      loadData()
    }
  }, [articuloId, API_URL])

  const handleInputChange = (field: keyof DTOAsignarProveedor, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value === undefined || value === null ? (field === 'proximaRevision' ? "" : 0) : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.articuloId || !formData.proveedorId || !formData.modeloInventarioId) {
      alert("Por favor, seleccione un artículo, proveedor y modelo de inventario")
      return
    }

    // Validaciones específicas según el modelo
    if (isModeloTiempoFijo()) {
      if (!formData.tiempoFijo || formData.tiempoFijo <= 0) {
        alert("Para el modelo Tiempo Fijo, debe especificar un tiempo fijo válido")
        return
      }
    }

    setSaving(true)
    try {
      const dto = { ...formData }
      // Si proximaRevision está vacía, no la mandes
      if (!dto.proximaRevision) delete dto.proximaRevision
            

      console.log(JSON.stringify(dto))
      
      const response = await fetch(`${API_URL}/asignarProveedor/asignar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dto)
      })

      if (response.ok) {
        alert("Proveedor asignado exitosamente")
        router.back()
      } else {
        const errorText = await response.text()
        alert(`Error al asignar proveedor: ${errorText}`)
      }
    } catch (error) {
      console.error("Error al asignar proveedor:", error)
      alert("Error al asignar proveedor. Por favor, intente nuevamente.")
    } finally {
      setSaving(false)
    }
  }

  // Función para obtener el modelo seleccionado
  const getModeloInventarioSeleccionado = () => {
    return modelosInventario.find(modelo => modelo.idMI === formData.modeloInventarioId)
  }

  // Función para detectar si es Lote Fijo
  const isModeloLoteFijo = () => {
    const modelo = getModeloInventarioSeleccionado()
    return modelo?.nombreMI.toLowerCase().includes('lote fijo')
  }

  // Función para detectar si es Tiempo Fijo
  const isModeloTiempoFijo = () => {
    const modelo = getModeloInventarioSeleccionado()
    return modelo?.nombreMI.toLowerCase().includes('tiempo fijo')
  }

  if (loading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-400">Cargando datos...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-400 text-2xl">⚠</span>
            </div>
            <h3 className="text-xl font-semibold text-slate-300 mb-2">Error al cargar datos</h3>
            <p className="text-slate-400 mb-4">{error}</p>
            <Button onClick={() => router.back()} className="bg-blue-600 hover:bg-blue-700">
              Volver
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Obtener el artículo seleccionado para mostrar información
  const articuloSeleccionado = articulos.find(art => art.id === articuloId)

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          onClick={() => router.back()}
          variant="outline"
          className="bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Asignar Proveedor</h1>
          <p className="text-slate-400">
            Asignar proveedor al artículo: {articuloSeleccionado?.nombre || `ID: ${articuloId}`}
          </p>
        </div>
      </div>

      {/* Información del artículo seleccionado */}
      {articuloSeleccionado && (
        <Card className="bg-slate-800 border-slate-700 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-900 to-slate-800 rounded-t-lg">
            <CardTitle className="text-xl text-blue-100 flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-400" />
              Artículo Seleccionado
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-slate-400 text-sm">ID</Label>
                <p className="text-slate-100 font-mono">{articuloSeleccionado.id}</p>
              </div>
              <div>
                <Label className="text-slate-400 text-sm">Nombre</Label>
                <p className="text-slate-100 font-medium">{articuloSeleccionado.nombre}</p>
              </div>
              <div>
                <Label className="text-slate-400 text-sm">Descripción</Label>
                <p className="text-slate-300">{articuloSeleccionado.descripcionArt}</p>
              </div>
              <div>
                <Label className="text-slate-400 text-sm">Precio Unitario</Label>
                <p className="text-green-400 font-semibold">${articuloSeleccionado.precioUnitario.toFixed(2)}</p>
              </div>
              <div>
                <Label className="text-slate-400 text-sm">Stock Actual</Label>
                <p className="text-blue-400 font-semibold">{articuloSeleccionado.stock}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Formulario de asignación */}
      <Card className="bg-slate-800 border-slate-700 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-green-900 to-slate-800 rounded-t-lg">
          <CardTitle className="text-xl text-green-100 flex items-center gap-2">
            <Users className="w-5 h-5 text-green-400" />
            Datos de Asignación
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Artículo (preseleccionado y deshabilitado) */}
              <div className="space-y-2">
                <Label htmlFor="articulo" className="text-slate-200 font-medium">
                  Artículo *
                </Label>
                <Select 
                  value={formData.articuloId && formData.articuloId > 0 ? formData.articuloId.toString() : ""} 
                  onValueChange={(value) => handleInputChange('articuloId', parseInt(value))}
                  disabled={true}
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-100 focus:border-green-500 focus:ring-green-500">
                    <SelectValue placeholder="Seleccionar artículo" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    {articulos.map((articulo) => (
                      <SelectItem 
                        key={articulo.id} 
                        value={articulo.id.toString()}
                        className="text-slate-100 hover:bg-slate-600"
                      >
                        {articulo.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Proveedor */}
              <div className="space-y-2">
                <Label htmlFor="proveedor" className="text-slate-200 font-medium">
                  Proveedor *
                </Label>
                <Select 
                  value={formData.proveedorId && formData.proveedorId > 0 ? formData.proveedorId.toString() : ""} 
                  onValueChange={(value) => handleInputChange('proveedorId', parseInt(value))}
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-100 focus:border-green-500 focus:ring-green-500">
                    <SelectValue placeholder="Seleccionar proveedor" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    {proveedores.map((proveedor) => (
                      <SelectItem 
                        key={proveedor.idProveedor} 
                        value={proveedor.idProveedor.toString()}
                        className="text-slate-100 hover:bg-slate-600"
                      >
                        {proveedor.nombreProveedor}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Modelo de Inventario */}
              <div className="space-y-2">
                <Label htmlFor="modeloInventario" className="text-slate-200 font-medium">
                  Modelo de Inventario *
                </Label>
                <Select 
                  value={formData.modeloInventarioId && formData.modeloInventarioId > 0 ? formData.modeloInventarioId.toString() : ""} 
                  onValueChange={(value) => handleInputChange('modeloInventarioId', parseInt(value))}
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-100 focus:border-green-500 focus:ring-green-500">
                    <SelectValue placeholder="Seleccionar modelo" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    {modelosInventario.map((modelo) => (
                      <SelectItem 
                        key={modelo.idMI} 
                        value={modelo.idMI.toString()}
                        className="text-slate-100 hover:bg-slate-600"
                      >
                        {modelo.nombreMI}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Costo Pedido */}
              <div className="space-y-2">
                <Label htmlFor="costoPedido" className="text-slate-200 font-medium">
                  Costo de Pedido
                </Label>
                <Input
                  id="costoPedido"
                  type="number"
                  step="0.01"
                  value={formData.costoPedido}
                  onChange={(e) => handleInputChange('costoPedido', parseFloat(e.target.value) || 0)}
                  className="bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400 focus:border-green-500 focus:ring-green-500"
                  placeholder="0.00"
                />
              </div>

              {/* Costo Unitario */}
              <div className="space-y-2">
                <Label htmlFor="costoUnitario" className="text-slate-200 font-medium">
                  Costo Unitario
                </Label>
                <Input
                  id="costoUnitario"
                  type="number"
                  step="0.01"
                  value={formData.costoUnitario}
                  onChange={(e) => handleInputChange('costoUnitario', parseFloat(e.target.value) || 0)}
                  className="bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400 focus:border-green-500 focus:ring-green-500"
                  placeholder="0.00"
                />
              </div>

              {/* Demora de Entrega */}
              <div className="space-y-2">
                <Label htmlFor="demoraEntrega" className="text-slate-200 font-medium">
                  Demora de Entrega (días)
                </Label>
                <Input
                  id="demoraEntrega"
                  type="number"
                  value={formData.demoraEntrega}
                  onChange={(e) => handleInputChange('demoraEntrega', parseInt(e.target.value) || 0)}
                  className="bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400 focus:border-green-500 focus:ring-green-500"
                  placeholder="0"
                />
              </div>

              {/* Nivel de Servicio */}
              <div className="space-y-2">
                <Label htmlFor="nivelServicio" className="text-slate-200 font-medium">
                  Nivel de Servicio (%)
                </Label>
                <Input
                  id="nivelServicio"
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={formData.nivelServicio}
                  onChange={(e) => handleInputChange('nivelServicio', parseFloat(e.target.value) || 0)}
                  className="bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400 focus:border-green-500 focus:ring-green-500"
                  placeholder="0.00"
                />
              </div>

              {/* Campos específicos para Tiempo Fijo */}
              {isModeloTiempoFijo() && (
                <>
                  {/* Tiempo Fijo */}
                  <div className="space-y-2">
                    <Label htmlFor="tiempoFijo" className="text-slate-200 font-medium">
                      Tiempo Fijo (días) *
                    </Label>
                    <Input
                      id="tiempoFijo"
                      type="number"
                      value={formData.tiempoFijo}
                      onChange={(e) => handleInputChange('tiempoFijo', parseInt(e.target.value) || 0)}
                      className="bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400 focus:border-green-500 focus:ring-green-500"
                      placeholder="0"
                      required
                    />
                  </div>

                  {/* Próxima Revisión */}
                  <div className="space-y-2">
                    <Label htmlFor="proximaRevision" className="text-slate-200 font-medium">
                      Próxima Revisión
                    </Label>
                    <Input
                      id="proximaRevision"
                      type="date"
                      value={formData.proximaRevision && formData.proximaRevision.length > 0 ? formData.proximaRevision.substring(0, 10) : ""}
                      onChange={(e) => handleInputChange('proximaRevision', e.target.value ? new Date(e.target.value).toISOString() : "")}
                      className="bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                </>
              )}
            </div>

            {/* Información del modelo seleccionado */}
            {formData.modeloInventarioId > 0 && (
              <div className="p-4 bg-slate-700 rounded-lg border border-slate-600">
                <h4 className="text-slate-200 font-medium mb-2">
                  Modelo Seleccionado: {getModeloInventarioSeleccionado()?.nombreMI}
                </h4>
                {isModeloLoteFijo() && (
                  <p className="text-slate-400 text-sm">
                    Campos requeridos: Costo de pedido, Costo unitario, Demora de entrega, Nivel de servicio
                  </p>
                )}
                {isModeloTiempoFijo() && (
                  <p className="text-slate-400 text-sm">
                    Campos requeridos: Costo de pedido, Costo unitario, Demora de entrega, Nivel de servicio, Tiempo fijo, Próxima revisión
                  </p>
                )}
                {!isModeloLoteFijo() && !isModeloTiempoFijo() && (
                  <p className="text-slate-400 text-sm">
                    Todos los campos están disponibles para este modelo
                  </p>
                )}
              </div>
            )}

            {/* Checkbox Predeterminado */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isPredeterminado"
                checked={formData.isPredeterminado}
                onCheckedChange={(checked) => handleInputChange('isPredeterminado', checked as boolean)}
                className="border-slate-600 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
              />
              <Label htmlFor="isPredeterminado" className="text-slate-200 font-medium">
                Proveedor Predeterminado
              </Label>
            </div>

            {/* Botones */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={saving}
                className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Asignar Proveedor
                  </>
                )}
              </Button>
              <Button
                type="button"
                onClick={() => router.back()}
                variant="outline"
                className="bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 