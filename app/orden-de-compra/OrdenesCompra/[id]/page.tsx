"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { DTOModificarOrdenCompra } from "@/types"

export default function ModificarOrdenCompraPage() {
  const [orden, setOrden] = useState<DTOModificarOrdenCompra | null>(null)
  const [cantidades, setCantidades] = useState<number[]>([])
  const [proveedoresSeleccionados, setProveedoresSeleccionados] = useState<number[]>([])
  const BASE_URL = "http://localhost:8080/ModificarOrdenCompra"
  const params = useParams()
  const router = useRouter()
  const idOC = Number(params.id)
  const [confirmado, setConfirmado] = useState(false)

  useEffect(() => {
    fetch(`${BASE_URL}/getDatosOC?idOC=${idOC}`)
      .then(res => res.json())
      .then((data: DTOModificarOrdenCompra) => {
        setOrden(data)
        setCantidades(data.detallesOC.map(d => d.cantidad))

        const seleccionados = data.detallesOC.map(detalle => {
          const proveedorActual = data.proveedores.find(
            p => p.nombreProveedor === detalle.nombreProveedor
          )
          return proveedorActual?.idProveedor ?? 0
        })

        setProveedoresSeleccionados(seleccionados)
      })
  }, [])

  const handleConfirmar = () => {
    if (!orden) return

    const detallesMod = orden.detallesOC.map((detalle, index) => ({
      idOCDetalle: detalle.idOCDetalle,
      cantidad: cantidades[index],
      idProveedor: proveedoresSeleccionados[index],
    }))

    const hayPorDebajoDelPuntoPedido = orden.detallesOC.some((detalle, index) => {
    return cantidades[index] < detalle.puntoPedido})

    if (hayPorDebajoDelPuntoPedido && !confirmado) {
        const continuar = window.confirm("Hay cantidades por debajo del punto de pedido del artículo. ¿Está seguro de continuar?")
        if (!continuar) return
        setConfirmado(true)
        return
    }

    const datosModificados = {
      idOC: orden.idOC,
      detallesMod,
    }

    fetch(`${BASE_URL}/confirmar`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(datosModificados)
  })
    .then(async res => {
      if (res.ok) {
        alert("Orden de compra modificada correctamente.")
        router.back()
      } else {
        const texto = await res.text()
        alert("Error al modificar la orden:\n" + texto)
      }
    })
  }

  if (!orden) return <p>Cargando...</p>

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Modificar Orden #{orden.idOC}</h1>

      {orden.detallesOC.map((detalle, index) => {
        const proveedorPredeterminado = detalle.predeterminado

        return (
          <Card key={index}>
            <CardContent className="p-4 space-y-4">
              <p><strong>Artículo:</strong> {detalle.nombreArt}</p>
              <p><strong>Subtotal:</strong> ${detalle.subTotal.toFixed(2)}</p>
              <p><strong>Costo Unitario:</strong> ${detalle.costoUnitario.toFixed(2)}</p>
              <p><strong>Costo Pedido:</strong> ${detalle.costoPedido.toFixed(2)}</p>
              <p><strong>Costo Almacenamiento:</strong> ${detalle.costoAlmacenamientoArt.toFixed(2)}</p>

              <div className="flex items-center gap-2">
                <label className="w-32">Cantidad:</label>
                <Input
                  type="number"
                  value={cantidades[index]}
                  onChange={(e) => {
                    const nuevasCantidades = [...cantidades]
                    nuevasCantidades[index] = parseInt(e.target.value)
                    setCantidades(nuevasCantidades)
                  }}
                  className="w-32"
                />
              </div>

              <div>
                <label className="font-medium">Proveedor:</label>
                <Select
                  value={proveedoresSeleccionados[index]?.toString()}
                  onValueChange={(value) => {
                    const nuevosSeleccionados = [...proveedoresSeleccionados]
                    nuevosSeleccionados[index] = parseInt(value)
                    setProveedoresSeleccionados(nuevosSeleccionados)
                  }}
                >
                  <SelectTrigger className="w-[400px] mt-1">
                    <SelectValue placeholder="Seleccionar proveedor" />
                  </SelectTrigger>
                  <SelectContent>
                    {orden.proveedores.map((prov) => {
                      const esPredeterminado =
                        prov.nombreProveedor === detalle.nombreProveedor && detalle.predeterminado

                      return (
                        <SelectItem
                          key={`${index}-${prov.idProveedor}`}
                          value={prov.idProveedor.toString()}
                          className="flex flex-col items-start gap-0"
                        >
                          <div className="flex gap-2 items-center">
                            <span className={esPredeterminado ? "text-yellow-500 font-semibold" : ""}>
                              {prov.nombreProveedor}
                            </span>
                            {esPredeterminado && (
                              <span className="text-yellow-500 text-sm font-semibold">
                                (Predeterminado)
                              </span>
                            )}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            Costo Unitario: ${prov.costoUnitario.toFixed(2)} | Costo Pedido: ${prov.costoPedido.toFixed(2)}
                          </span>
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )
      })}

      <div className="flex gap-4">
        <Button onClick={handleConfirmar} className="bg-green-600 hover:bg-green-700">
          Confirmar Cambios
        </Button>
        <Button variant="destructive" onClick={() => router.back()}>
          Cancelar
        </Button>
      </div>
    </div>
  )
}
