"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Plus, Trash2, Send, ShoppingCart } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Articulo, ArticuloSeleccionado, DTOSugerirOrdenDetalle } from "@/types"

// Datos de ejemplo para artículos
const articulosData = [
  {
    id: 1,
    nombre: "Shampoo Axion",
    proveedorPredeterminado: { id: 1, nombre: "Distribuidora Belleza S.A." },
    proveedoresDisponibles: [
      { id: 1, nombre: "Distribuidora Belleza S.A.", precio: 1850.25 },
      { id: 2, nombre: "Cosméticos del Norte", precio: 1920.0 },
      { id: 3, nombre: "Importadora Premium", precio: 1780.75 },
    ],
  },
  {
    id: 2,
    nombre: "Laptop HP Pavilion",
    proveedorPredeterminado: { id: 4, nombre: "Tecnología Avanzada" },
    proveedoresDisponibles: [
      { id: 4, nombre: "Tecnología Avanzada", precio: 42500.0 },
      { id: 5, nombre: "Computadoras del Sur", precio: 43200.5 },
    ],
  },
  {
    id: 3,
    nombre: "Monitor LG 24ML44",
    proveedorPredeterminado: { id: 6, nombre: "Electrónica Moderna" },
    proveedoresDisponibles: [
      { id: 6, nombre: "Electrónica Moderna", precio: 11800.0 },
      { id: 7, nombre: "Monitores Express", precio: 12100.25 },
      { id: 8, nombre: "Pantallas HD", precio: 11650.0 },
    ],
  },
  {
    id: 4,
    nombre: "Resma Papel A4",
    proveedorPredeterminado: { id: 9, nombre: "Suministros Oficina Plus" },
    proveedoresDisponibles: [
      { id: 9, nombre: "Suministros Oficina Plus", precio: 450.0 },
      { id: 10, nombre: "Papelería Central", precio: 465.0 },
    ],
  },
  {
    id: 5,
    nombre: "Silla Ergonómica Pro",
    proveedorPredeterminado: { id: 11, nombre: "Muebles Confort" },
    proveedoresDisponibles: [
      { id: 11, nombre: "Muebles Confort", precio: 8750.5 },
      { id: 12, nombre: "Oficina Total", precio: 8900.0 },
      { id: 13, nombre: "Ergonomía Pro", precio: 8650.25 },
    ],
  },
  {
    id: 6,
    nombre: "Bolígrafos Pack x10",
    proveedorPredeterminado: { id: 9, nombre: "Suministros Oficina Plus" },
    proveedoresDisponibles: [
      { id: 9, nombre: "Suministros Oficina Plus", precio: 280.0 },
      { id: 14, nombre: "Escritorio y Más", precio: 295.0 },
    ],
  },
  {
    id: 7,
    nombre: "Escritorio Ejecutivo",
    proveedorPredeterminado: { id: 11, nombre: "Muebles Confort" },
    proveedoresDisponibles: [
      { id: 11, nombre: "Muebles Confort", precio: 15999.0 },
      { id: 15, nombre: "Maderas Premium", precio: 16200.0 },
    ],
  },
  {
    id: 8,
    nombre: "Grapadora Metálica",
    proveedorPredeterminado: { id: 9, nombre: "Suministros Oficina Plus" },
    proveedoresDisponibles: [
      { id: 9, nombre: "Suministros Oficina Plus", precio: 650.0 },
      { id: 16, nombre: "Herramientas de Oficina", precio: 675.0 },
    ],
  },
]

interface FilaOrden {
  id: string
  articuloId: number
  proveedorId: number
  proveedorNombre: string
  cantidad: number
  subtotal: number
  sugerenciaOrden: DTOSugerirOrdenDetalle | null
}

export default function GenerarOrdenDeCompraPage() {
  const [filasOrden, setFilasOrden] = useState<FilaOrden[]>([])
  const [articulos, setArticulos] = useState<Articulo[]>([]) // Inicializar con datos de ejemplo
  const [articuloSeleccionado, setArticuloSeleccionado] = useState<ArticuloSeleccionado | null>(null) //Guarda el ID del articulo seleccionado en un momento dado
  const [articulosSeleccionados, setArticulosSeleccionados] = useState<ArticuloSeleccionado[]>([])
  const [sugerenciaOrden, setSugerenciaOrden] = useState<DTOSugerirOrdenDetalle | null>(null)

  //Busqueda de todos los articulo para mostrarlos en el selector de articulo
  useEffect(() => {
    const fetchArticulos = async () => {

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/GenerarOrdenCompra/traerArticulos`)
        if (!response.ok) {
            console.error("Error fetching articulos:", response.statusText)
            return
        }
        const data = await response.json()
        setArticulos(data)
        console.log("Artículos fetched:", data)
    }
    fetchArticulos()
  }, [])

  const fetchProveedores = async (articuloId : number) : Promise<DTOSugerirOrdenDetalle | null>=> {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/GenerarOrdenCompra/sugerirOrden?idArticulo=${articuloId}`)
        if (!response.ok) {
            console.error("Error fetching proveedores:", response.statusText)
            return null
        }
        const data : DTOSugerirOrdenDetalle = await response.json()
        const artSeleccionado = {
            articuloId: articuloId,
            sugerenciaOrden: data
        }
        setArticuloSeleccionado(artSeleccionado)
        setArticulosSeleccionados((prev) => [...prev, artSeleccionado])
        return data
    }

  const agregarFila = () => {
    const nuevaFila: FilaOrden = {
      id: Date.now().toString(),
      articuloId: 0,
      proveedorId: 0,
      proveedorNombre: "",
      cantidad: 1,
      subtotal: 0,
      sugerenciaOrden: null
    }
    setFilasOrden([...filasOrden, nuevaFila])
  }

  const eliminarFila = (id: string) => {
    setFilasOrden(filasOrden.filter((fila) => fila.id !== id))
  }

const actualizarFila = async (id: string, campo: keyof FilaOrden, valor: any) => {
  let nuevaSugerencia: DTOSugerirOrdenDetalle | null = null;

  // Si se está cambiando el artículo, obtenemos la sugerencia de proveedores
  if (campo === "articuloId") {
    const articulo = articulos.find((art) => art.id === Number(valor));
    if (!articulo) {
      console.log("No existe este articulo!!!");
      return;
    }

    nuevaSugerencia = await fetchProveedores(articulo.id);
  }

  setFilasOrden(
    filasOrden.map((fila) => {
      if (fila.id === id) {
        const filaActualizada = { ...fila, [campo]: valor };

        // Si se cambió el artículo, actualizamos sugerencia y proveedor predeterminado
        if (campo === "articuloId" && nuevaSugerencia) {
          filaActualizada.sugerenciaOrden = nuevaSugerencia;
          const proveedorPredeterminado = nuevaSugerencia.proveedores.find((prov) => prov.predeterminado);
          filaActualizada.proveedorId = proveedorPredeterminado?.proveedorId ?? 0;
          filaActualizada.proveedorNombre = proveedorPredeterminado?.nombreProvedor ?? "";
          filaActualizada.cantidad = nuevaSugerencia.cantidadPredeterminada;

        } else {
          // Si no se cambió el artículo, mantenemos la sugerencia anterior
          filaActualizada.sugerenciaOrden = fila.sugerenciaOrden;
        }

        /* Si elige otro proveedor que no sea el predeterminado, que la cantidad a pedir sea 1*/
        if(campo === "proveedorId"){
            const idProvPredetermiando = fila.sugerenciaOrden?.proveedores.find((prov) => prov.predeterminado === true)?.proveedorId
            if(valor !== idProvPredetermiando){
                filaActualizada.cantidad = 1;
            }else{
                filaActualizada.cantidad = fila.sugerenciaOrden?.cantidadPredeterminada?? 1;
            }
        }

        // Calcular subtotal automáticamente
        if (["articuloId", "proveedorId", "cantidad"].includes(campo)) {
          const articulo = articulosData.find((art) => art.id === filaActualizada.articuloId);
          if (articulo && filaActualizada.proveedorId && filaActualizada.cantidad > 0) {
            const proveedor = articulo.proveedoresDisponibles.find((prov) => prov.id === filaActualizada.proveedorId);
            if (proveedor) {
              filaActualizada.subtotal = proveedor.precio * filaActualizada.cantidad;
            }
          }
        }

        return filaActualizada;
      }
      return fila;
    })
  );
};


  const calcularTotal = () => {
    return filasOrden.reduce((total, fila) => total + fila.subtotal, 0)
  }

  const generarOrdenesDeCompra = () => {
    if (filasOrden.length === 0) {
      alert("Debe agregar al menos un artículo a la orden")
      return
    }

    // Validar que todas las filas estén completas
    const filasIncompletas = filasOrden.filter((fila) => fila.articuloId === 0 || fila.proveedorId === 0)
    if (filasIncompletas.length > 0) {
      alert("Todas las filas deben tener artículo y proveedor seleccionados")
      return
    }

    // Agrupar por proveedor
    const ordenesPorProveedor = filasOrden.reduce(
      (acc, fila) => {
        const proveedorId = fila.proveedorId
        if (!acc[proveedorId]) {
          acc[proveedorId] = []
        }
        acc[proveedorId].push(fila)
        return acc
      },
      {} as Record<number, FilaOrden[]>,
    )

    //Iterar el Record ordenesPorProveedor para llenar los DTO de ordenes de compra
    
        

    console.log("ordenesXprov: ", ordenesPorProveedor)

    const cantidadOrdenes = Object.keys(ordenesPorProveedor).length
    const totalGeneral = calcularTotal()

    console.log("Generando órdenes de compra por proveedor:", ordenesPorProveedor)

    alert(
      `¡Órdenes de compra generadas exitosamente!\n\n` +
        `Cantidad de órdenes: ${cantidadOrdenes}\n` +
        `Total general: $${totalGeneral.toFixed(2)}\n\n` +
        `Se ha creado una orden separada para cada proveedor.`,
    )

    setFilasOrden([])
  }
  /*
  const obtenerArticulo = (articuloId: number) => {
    return articulos.find((art) => art.id === articuloId)
  }
  */
  const obtenerProveedorInfo = (articuloId: number) => {
    
    const fetchProveedores = async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/GenerarOrdenCompra/sugerirOrden?idArticulo=${articuloId}`)
        if (!response.ok) {
            console.error("Error fetching proveedores:", response.statusText)
            return
        }
        const data : DTOSugerirOrdenDetalle = await response.json()
        const artSeleccionado = {
            articuloId: articuloId,
            sugerenciaOrden: data
        }
        setArticuloSeleccionado(artSeleccionado)
        setArticulosSeleccionados((prev) => [...prev, artSeleccionado])
    }
    fetchProveedores()
    
    return null
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/orden-de-compra/GestionDeOrdenes"
          className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a Gestión de Órdenes
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Generar Orden de Compra</h1>
          <p className="text-slate-400">Crear nuevas órdenes de compra por proveedor</p>
        </div>
      </div>

      {/* Botón agregar artículo */}
      <div className="flex justify-start mb-6">
        <Button onClick={agregarFila} className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Agregar Artículo
        </Button>
      </div>

      {/* Tabla de artículos */}
      <Card className="bg-slate-800 border-slate-700 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-purple-900 to-slate-800 rounded-t-lg">
          <CardTitle className="text-2xl text-purple-100 flex items-center gap-2">
            <ShoppingCart className="w-6 h-6" />
            Artículos en Órdenes
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {filasOrden.length > 0 ? (
            <div className="rounded-lg overflow-hidden border border-slate-700 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-700 hover:bg-slate-700 border-slate-600">
                    <TableHead className="text-purple-200 font-semibold">Artículo</TableHead>
                    <TableHead className="text-purple-200 font-semibold">Proveedor</TableHead>
                    <TableHead className="text-purple-200 font-semibold">Cantidad</TableHead>
                    <TableHead className="text-purple-200 font-semibold">Subtotal</TableHead>
                    <TableHead className="text-purple-200 font-semibold text-center">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filasOrden.map((fila, index) => {

                    return (
                      <TableRow
                        key={fila.id}
                        className={`
                          ${index % 2 === 0 ? "bg-slate-800" : "bg-slate-750"} 
                          hover:bg-slate-700 border-slate-600 transition-colors
                        `}
                      >
                        <TableCell className="min-w-[250px]">
                          <Select
                            value={fila.articuloId.toString()}
                            onValueChange={(value) => {
                                actualizarFila(fila.id, "articuloId", Number(value))
                                obtenerProveedorInfo(Number(value))
                            }}
                          >
                            <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-100">
                              <SelectValue placeholder="Seleccionar artículo" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-700 border-slate-600">
                              {articulos.map((articulo) => (
                                <SelectItem
                                  key={articulo.id}
                                  value={articulo.id.toString()}
                                  className="text-slate-100 focus:bg-purple-600 focus:text-white"
                                >
                                  {articulo.nombre}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="min-w-[200px]">
                          <Select
                            value={fila.proveedorId.toString()}
                            onValueChange={(value) => actualizarFila(fila.id, "proveedorId", Number(value))}
                            disabled={!fila.articuloId}
                          >
                            <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-100">
                              <SelectValue placeholder="Seleccionar proveedor" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-700 border-slate-600">
                              {fila.sugerenciaOrden?.proveedores.map((prov) => (
                                <SelectItem
                                  key={prov.proveedorId}
                                  value={prov.proveedorId.toString()}
                                  className="text-slate-100 focus:bg-purple-600 focus:text-white"
                                >
                                  {prov.predeterminado ? prov.nombreProvedor + " (Predeterminado)" : prov.nombreProvedor}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="1"
                            value={fila.cantidad}
                            onChange={(e) => actualizarFila(fila.id, "cantidad", Number(e.target.value))}
                            className="bg-slate-700 border-slate-600 text-slate-100 w-20"
                          />
                        </TableCell>
                        <TableCell className="text-green-400 font-semibold">${fila.subtotal.toFixed(2)}</TableCell>
                        <TableCell>
                          <div className="flex justify-center">
                            <Button
                              onClick={() => eliminarFila(fila.id)}
                              size="sm"
                              variant="destructive"
                              className="bg-red-600 hover:bg-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8">
              <ShoppingCart className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-300 mb-2">No hay artículos en las órdenes</h3>
              <p className="text-slate-400 mb-4">Agregue artículos usando el botón "Agregar Artículo"</p>
            </div>
          )}

          {/* Total */}
          {filasOrden.length > 0 && (
            <div className="mt-6 p-4 bg-slate-700 rounded-lg border border-slate-600">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium text-slate-200">Total General:</span>
                <span className="text-2xl font-bold text-green-400">${calcularTotal().toFixed(2)}</span>
              </div>
              <p className="text-sm text-slate-400 mt-2">
                Se generará una orden separada para cada proveedor seleccionado
              </p>
            </div>
          )}

          {/* Botón generar órdenes */}
          {filasOrden.length > 0 && (
            <div className="mt-6 flex justify-end">
              <Button
                onClick={generarOrdenesDeCompra}
                className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 px-6 py-3"
              >
                <Send className="w-5 h-5" />
                Generar Órdenes de Compra
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
