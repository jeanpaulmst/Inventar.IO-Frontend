"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

type ArticuloData = {
  nombre: string
  cantidad: number
}

export default function AjustarInventarioPage() {
  const params = useParams()
  const router = useRouter()
  const idArticulo = Number(params.id)

  const [data, setData] = useState<ArticuloData | null>(null)
  const [stock, setStock] = useState("")
  const [loading, setLoading] = useState(true)
  const [resultado, setResultado] = useState<null | boolean>(null)
  const [confirmacionForzada, setConfirmacionForzada] = useState(false)
  const [errorMensaje, setErrorMensaje] = useState<string | null>(null)



  useEffect(() => {
    const fetchData = async () => {
      if (!idArticulo) return

      try {
        const response = await fetch(`http://localhost:8080/AjustarInventario/getArticulo?idArticulo=${idArticulo}`)
        if (!response.ok) throw new Error("Error al traer el artículo")
        const json: ArticuloData = await response.json()
        setData(json)
        setStock(json.cantidad.toString())
      } catch (error) {
        console.error("Error:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [idArticulo])

    const handleConfirmar = async () => {
      setErrorMensaje(null)
  try {
    const response = await fetch(
      `http://localhost:8080/AjustarInventario/confirmar?idArticulo=${idArticulo}&stock=${stock}&forzarConfirmacion=${confirmacionForzada}`,
      {
        method: "POST",
      }
    )
    if (!response.ok) {
      const errorData = await response.json()
      setErrorMensaje(errorData.mensaje || "Ocurrió un error al confirmar")
      return
    }

    const res = await response.json()

    setResultado(res)

    if (!res) {
      // Stock correcto, sin necesidad de orden de compra
      setTimeout(() => {
        router.back()
      }, 1000)
    } else if (!confirmacionForzada) {
      // Stock bajo punto de pedido y es la primera vez
      setConfirmacionForzada(true)
    } else {
      // Segunda vez, confirmar aunque esté bajo punto de pedido
      setTimeout(() => {
        router.back()
      }, 1000)
    }
  } catch (error) {
    console.error("Error:", error)
  }
}

  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-3xl font-bold text-slate-100">Ajustar Inventario</h1>

      {loading ? (
        <div className="flex items-center gap-2 text-slate-300">
          <Loader2 className="animate-spin h-5 w-5" />
          Cargando artículo...
        </div>
      ) : data ? (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="bg-slate-700 rounded-t-md">
            <CardTitle className="text-blue-100 text-xl">Artículo: {data.nombre}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 pt-4">
            <div className="text-slate-300">Stock actual: {data.cantidad}</div>
            <Input
                type="number"
                value={stock}
                onChange={(e) => {
                    setStock(e.target.value)
                    setConfirmacionForzada(false)
                }}
                className="w-32 text-slate-900"
                />
            <Button
              onClick={handleConfirmar}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold w-fit"
            >
              Confirmar Ajuste
            </Button>

            {errorMensaje && (
              <div className="text-red-500 font-medium mt-2">
                {errorMensaje}
              </div>
            )}

            {resultado !== null && (
              <div className={`p-3 rounded-md font-medium ${resultado ? "bg-yellow-600 text-yellow-100" : "bg-green-700 text-green-100"}`}>
                {resultado
                  ? "Se debe generar una Orden de Compra (stock por debajo del punto de pedido)"
                  : "Stock ajustado correctamente (sin necesidad de compra)"}
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="text-red-500">No se encontró el artículo</div>
      )}
    </div>
  )
}