"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, DollarSign, Users, FileText, Plus } from "lucide-react"
import { useRouter } from "next/navigation"

// Tipos
interface DTOVenta {
  id: number
  monto: number
  fechaAlta: string
  cantidadArticulos: number
}


export default function VentasPage() {
  const [ventas, setVentas] = useState<DTOVenta[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const API_URL = process.env.NEXT_PUBLIC_API_URL

  // Cargar ventas desde la API
  useEffect(() => {
    const fetchVentas = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${API_URL}/generarVenta/traerTodos`)
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`)
        }

        const data: DTOVenta[] = await response.json()
        setVentas(data || [])
                
        setError(null)
      } catch (err) {
        console.error("Error al cargar ventas:", err)
        setError(err instanceof Error ? err.message : "Error desconocido")
      } finally {
        setLoading(false)
      }
    }

    fetchVentas()
  }, [API_URL])

  const handleNuevaVenta = () => {
    router.push('/ventas/GenerarVenta')
  }

  if (loading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-400">Cargando ventas...</p>
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
            <h3 className="text-xl font-semibold text-slate-300 mb-2">Error al cargar ventas</h3>
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
      {/* Header con botón de nueva venta */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Ventas</h1>
          <p className="text-slate-400 text-lg">Módulo de ventas y gestión comercial</p>
        </div>
        <Button
          onClick={handleNuevaVenta}
          className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nueva Venta
        </Button>
      </div>

      {/* Lista de ventas recientes */}
      <Card className="bg-slate-800 border-slate-700 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-green-900 to-slate-800 rounded-t-lg">
          <CardTitle className="text-xl text-green-100 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            Ventas Recientes
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {ventas.length > 0 ? (
            <div className="space-y-4">
              {ventas.slice(0, 5).map((venta) => (
                <div key={venta.id} className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-slate-100 font-medium">Venta #{venta.id}</p>
                      <p className="text-slate-400 text-sm">
                        {new Date(venta.fechaAlta).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-green-400 font-semibold">${venta.monto.toFixed(2)}</p>
                    <p className="text-slate-400 text-sm">{venta.cantidadArticulos} artículos</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <TrendingUp className="h-16 w-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-300 mb-2">No hay ventas registradas</h3>
              <p className="text-slate-400 mb-4">
                Comience creando su primera venta para ver las estadísticas aquí.
              </p>
              <Button onClick={handleNuevaVenta} className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                Crear Primera Venta
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
