"use client"

import { use, useEffect, useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DTOProveedor, DTOArticuloProv } from "@/types"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"

// Datos de ejemplo para proveedores
const providers = [
  { id: 1, name: "Electrónica Moderna" },
  { id: 2, name: "Suministros Oficina Plus" },
  { id: 3, name: "Muebles Confort" },
]

// Datos de ejemplo para productos por proveedor
const productsByProvider = {
  1: [
    { id: 101, name: "Laptop HP", description: "Laptop HP 15.6 pulgadas 8GB RAM", price: 599.99, stock: 15 },
    { id: 102, name: "Monitor LG", description: "Monitor LG 24 pulgadas Full HD", price: 149.99, stock: 30 },
    { id: 103, name: "Teclado Logitech", description: "Teclado inalámbrico Logitech", price: 45.5, stock: 50 },
    { id: 104, name: "Mouse Óptico", description: "Mouse óptico inalámbrico", price: 22.99, stock: 100 },
    { id: 105, name: "Auriculares Sony", description: "Auriculares con cancelación de ruido", price: 89.99, stock: 25 },
  ],
  2: [
    { id: 201, name: "Resma Papel A4", description: "Resma de papel 500 hojas", price: 5.99, stock: 200 },
    { id: 202, name: "Bolígrafos Pack", description: "Pack de 10 bolígrafos azules", price: 3.5, stock: 150 },
    {
      id: 203,
      name: "Carpetas Archivadoras",
      description: "Carpetas para archivo de documentos",
      price: 2.99,
      stock: 80,
    },
    { id: 204, name: "Grapadora", description: "Grapadora metálica de oficina", price: 8.75, stock: 45 },
    { id: 205, name: "Post-it", description: "Bloc de notas adhesivas", price: 1.99, stock: 120 },
  ],
  3: [
    { id: 301, name: "Silla Ergonómica", description: "Silla de oficina ergonómica", price: 129.99, stock: 20 },
    { id: 302, name: "Escritorio", description: "Escritorio de madera 120x60cm", price: 199.5, stock: 15 },
    { id: 303, name: "Estantería", description: "Estantería de 5 niveles", price: 89.99, stock: 10 },
    { id: 304, name: "Lámpara de Escritorio", description: "Lámpara LED para escritorio", price: 34.99, stock: 30 },
    { id: 305, name: "Archivador", description: "Archivador metálico de 4 cajones", price: 149.99, stock: 8 },
  ],
}

// ##### CONCEXIÓN CON EL BACKEND #####


export default function ProviderProducts() {

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [proveedores, setProveedores] = useState<DTOProveedor[]>([])
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null)
  const [articulos, setArticulos] = useState<DTOArticuloProv[]>([]) // Cambiar el tipo según la estructura de tus artículos

  //Obtener la lista de proveedores desde el backend
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await fetch(`${API_URL}/ListarArtículoXProveedor/GetProveedores`)

        if (!response.ok) {
          throw new Error("Error al obtener los proveedores")
        }
        const data : DTOProveedor[] = await response.json()
        setProveedores(data)
        
      } catch (error) {
        console.error("Error fetching providers:", error)
      }
    }

    fetchProviders()

  }, [])

  useEffect(() => {
    console.log("Proveedores cargados:", proveedores)
  },[proveedores])


  const handleProviderChange = (value: string) => {
    setSelectedProvider(value)
    console.log("prov seleccionado: ", value)
  }

  // Obtener los articulos del proveedor seleccionado
  //const products = selectedProvider ? productsByProvider[Number.parseInt(selectedProvider)] : []
  useEffect(() => { 
    const fetchArticulos = async () => {
      if (!selectedProvider) return

      try {
        const response = await fetch(`${API_URL}/ListarArtículoXProveedor/?provId=${selectedProvider}`)

        if (!response.ok) {
          throw new Error("Error al obtener los productos del proveedor")
        }
        const data : DTOArticuloProv[] = await response.json()
        console.log("Artículos obtenidos:", data)
        setArticulos(data)
        
      } catch (error) {
        console.error("Error fetching products:", error)
      }
    }

    fetchArticulos()
  },[selectedProvider])
  

  // Obtener el nombre del proveedor seleccionado
  const providerName = selectedProvider ? providers.find((p) => p.id === Number.parseInt(selectedProvider))?.name : ""

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      {/* Back button */}
      <div className="container mx-auto px-4 pt-8">
        <Link
          href="/maestro-articulos"
          className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a Maestro de Artículos
        </Link>
      </div>

      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-100 mb-2">Sistema de Inventarios</h1>
          <p className="text-slate-400">Gestión de productos por proveedor</p>
        </div>

        {/* Card de selección de proveedor */}
        <Card className="mb-8 bg-slate-800 border-slate-700 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-900 to-slate-800 rounded-t-lg">
            <CardTitle className="text-2xl text-blue-100 flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              Selección de Proveedor
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <Select onValueChange={handleProviderChange}>
              <SelectTrigger className="w-full sm:w-[300px] bg-slate-700 border-slate-600 text-slate-100 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="Seleccione un proveedor" />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                {proveedores?.map((provider) => (
                  <SelectItem
                    key={provider.idProv}
                    value={provider.idProv.toString()}
                    className="text-slate-100 focus:bg-blue-600 focus:text-white"
                  >
                    {provider.nombreProveedor}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Tabla de productos */}
        {selectedProvider && (
          <Card className="bg-slate-800 border-slate-700 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-blue-900 to-slate-800 rounded-t-lg">
              <CardTitle className="text-xl text-blue-100 flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                Artículos del proveedor
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="rounded-lg overflow-hidden border border-slate-700">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-700 hover:bg-slate-700 border-slate-600">
                      <TableHead className="text-blue-200 font-semibold">ID</TableHead>
                      <TableHead className="text-blue-200 font-semibold">Nombre</TableHead>
                      <TableHead className="text-blue-200 font-semibold">Descripción</TableHead>
                      <TableHead className="text-blue-200 font-semibold">Precio Unitario</TableHead>
                      <TableHead className="text-blue-200 font-semibold">Stock</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {articulos.map((articulo, index) => (
                      <TableRow
                        key={articulo.idArticulo}
                        className={`
                          ${index % 2 === 0 ? "bg-slate-800" : "bg-slate-750"} 
                          hover:bg-slate-700 border-slate-600 transition-colors
                        `}
                      >
                        <TableCell className="text-slate-300 font-mono">{articulo.idArticulo}</TableCell>
                        <TableCell className="text-slate-100 font-medium">{articulo.nombreArticulo}</TableCell>
                        <TableCell className="text-slate-300">{articulo.descripcionArticulo}</TableCell>
                        <TableCell className="text-green-400 font-semibold">${articulo.costoUnitario.toFixed(2)}</TableCell>
                        <TableCell
                          className={`font-semibold ${
                            articulo.stock > 50
                              ? "text-green-400"
                              : articulo.stock > 20
                                ? "text-yellow-400"
                                : "text-red-400"
                          }`}
                        >
                          {articulo.stock}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Resumen de productos */
              <div className="mt-6 p-4 bg-slate-700 rounded-lg border border-slate-600">
                <div className="flex flex-wrap gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                    <span className="text-slate-300">Total de productos: </span>
                    <span className="text-blue-400 font-semibold">{articulos.length}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span className="text-slate-300">Valor total del inventario: </span>
                    <span className="text-green-400 font-semibold">
                      ${articulos.reduce((total, articulo) => total +  articulo.precioUnitario * articulo.stock, 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>}

            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
