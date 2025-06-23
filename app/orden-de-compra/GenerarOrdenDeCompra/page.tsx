"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Send,
  ShoppingCart,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import type {
  Articulo,
  ArticuloSeleccionado,
  DTOSugerirOrdenDetalle,
} from "@/types";

interface FilaOrden {
  id: string;
  articuloId: number;
  proveedorId: number;
  proveedorNombre: string;
  cantidad: number;
  subtotal: number;
  sugerenciaOrden: DTOSugerirOrdenDetalle | null;
  articuloProveedorId: number;
}

interface DetalleOrden {
  cantidad: number;
  subTotal: number;
  articuloProveedorId: number;
}

interface RespuestaNuevaOrden {
  ordenesDeCompra: any[] | null;
  nombresPedidos: string[];
}

export default function GenerarOrdenDeCompraPage() {
  const [filasOrden, setFilasOrden] = useState<FilaOrden[]>([]);
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [articuloSeleccionado, setArticuloSeleccionado] =
    useState<ArticuloSeleccionado | null>(null);
  const [articulosSeleccionados, setArticulosSeleccionados] = useState<
    ArticuloSeleccionado[]
  >([]);
  const [sugerenciaOrden, setSugerenciaOrden] =
    useState<DTOSugerirOrdenDetalle | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [productosExistentes, setProductosExistentes] = useState<string[]>([]);
  const [detallesPendientes, setDetallesPendientes] = useState<DetalleOrden[]>(
    []
  );

  const BASE_URL = "http://localhost:8080/GenerarOrdenCompra";

  // Busqueda de todos los articulos para mostrarlos en el selector de articulo
  useEffect(() => {
    const fetchArticulos = async () => {
      try {
        const response = await fetch(`${BASE_URL}/traerArticulos`);
        if (!response.ok) {
          console.error("Error fetching articulos:", response.statusText);
          return;
        }
        const data = await response.json();
        setArticulos(data);
        console.log("Artículos fetched:", data);
      } catch (error) {
        console.error("Error al cargar artículos:", error);
      }
    };
    fetchArticulos();
  }, []);

  const fetchProveedores = async (
    articuloId: number
  ): Promise<DTOSugerirOrdenDetalle | null> => {
    try {
      const response = await fetch(
        `${BASE_URL}/sugerirOrden?idArticulo=${articuloId}`
      );
      if (!response.ok) {
        console.error("Error fetching proveedores:", response.statusText);
        return null;
      }
      const data: DTOSugerirOrdenDetalle = await response.json();
      const artSeleccionado = {
        articuloId: articuloId,
        sugerenciaOrden: data,
      };
      setArticuloSeleccionado(artSeleccionado);
      setArticulosSeleccionados((prev) => [...prev, artSeleccionado]);
      return data;
    } catch (error) {
      console.error("Error al obtener proveedores:", error);
      return null;
    }
  };

  const agregarFila = () => {
    const nuevaFila: FilaOrden = {
      id: Date.now().toString(),
      articuloId: 0,
      proveedorId: 0,
      proveedorNombre: "",
      cantidad: 1,
      subtotal: 0,
      sugerenciaOrden: null,
      articuloProveedorId: 0,
    };
    setFilasOrden([...filasOrden, nuevaFila]);
  };

  const eliminarFila = (id: string) => {
    setFilasOrden(filasOrden.filter((fila) => fila.id !== id));
  };

  const actualizarFila = async (
    id: string,
    campo: keyof FilaOrden,
    valor: any
  ) => {
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
            const proveedorPredeterminado = nuevaSugerencia.proveedores.find(
              (prov) => prov.predeterminado
            );
            if (proveedorPredeterminado) {
              filaActualizada.proveedorId = proveedorPredeterminado.proveedorId;
              filaActualizada.proveedorNombre =
                proveedorPredeterminado.nombreProvedor;
              filaActualizada.cantidad = nuevaSugerencia.cantidadPredeterminada;
              filaActualizada.articuloProveedorId =
                proveedorPredeterminado.articuloProveedorId;
            } else {
              // Si no hay proveedor predeterminado, limpiar valores
              filaActualizada.proveedorId = 0;
              filaActualizada.proveedorNombre = "";
              filaActualizada.cantidad = 1;
              filaActualizada.articuloProveedorId = 0;
            }
          } else {
            // Si no se cambió el artículo, mantenemos la sugerencia anterior
            filaActualizada.sugerenciaOrden = fila.sugerenciaOrden;
          }

          // Si elige otro proveedor que no sea el predeterminado
          if (campo === "proveedorId") {
            const idProvPredeterminado = fila.sugerenciaOrden?.proveedores.find(
              (prov) => prov.predeterminado === true
            )?.proveedorId;

            if (valor !== idProvPredeterminado) {
              filaActualizada.cantidad = 1;
            } else {
              filaActualizada.cantidad =
                fila.sugerenciaOrden?.cantidadPredeterminada ?? 1;
            }

            // Actualizar nombre del proveedor y articuloProveedorId
            const proveedorSeleccionado =
              fila.sugerenciaOrden?.proveedores.find(
                (prov) => prov.proveedorId === Number(valor)
              );
            if (proveedorSeleccionado) {
              filaActualizada.proveedorNombre =
                proveedorSeleccionado.nombreProvedor;
              filaActualizada.articuloProveedorId =
                proveedorSeleccionado.articuloProveedorId;
            } else {
              filaActualizada.proveedorNombre = "";
              filaActualizada.articuloProveedorId = 0;
            }
          }

          // Calcular subtotal automáticamente
          if (["articuloId", "proveedorId", "cantidad"].includes(campo)) {
            if (
              filaActualizada.sugerenciaOrden &&
              filaActualizada.proveedorId &&
              filaActualizada.cantidad > 0
            ) {
              const proveedor =
                filaActualizada.sugerenciaOrden.proveedores.find(
                  (prov) => prov.proveedorId === filaActualizada.proveedorId
                );
              if (proveedor) {
                filaActualizada.subtotal =
                  proveedor.costoUnitario * filaActualizada.cantidad;
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
    return filasOrden.reduce((total, fila) => total + fila.subtotal, 0);
  };

  const generarOrdenesDeCompra = async (confirmacion = false) => {
    if (filasOrden.length === 0) {
      alert("Debe agregar al menos un artículo a la orden");
      return;
    }

    // Validar que todas las filas estén completas
    const filasIncompletas = filasOrden.filter(
      (fila) =>
        fila.articuloId === 0 || fila.proveedorId === 0 || fila.cantidad <= 0
    );
    if (filasIncompletas.length > 0) {
      alert(
        "Todas las filas deben tener artículo, proveedor seleccionados y cantidad mayor a 0"
      );
      return;
    }

    // Validar que todas las filas tengan articuloProveedorId
    const filasSinArticuloProveedor = filasOrden.filter(
      (fila) => !fila.articuloProveedorId || fila.articuloProveedorId === 0
    );
    if (filasSinArticuloProveedor.length > 0) {
      alert(
        "Error: No se pudo obtener la relación artículo-proveedor. Verifique las selecciones."
      );
      return;
    }

    // Preparar los detalles para el endpoint
    const detalles: DetalleOrden[] = filasOrden.map((fila) => ({
      cantidad: fila.cantidad,
      subTotal: fila.subtotal,
      articuloProveedorId: fila.articuloProveedorId,
    }));

    const requestBody = {
      detalles: detalles,
      confirmacion: confirmacion,
    };

    console.log(
      "Enviando datos al backend:",
      JSON.stringify(requestBody, null, 2)
    );

    try {
      const response = await fetch(
        "http://localhost:8080/GenerarOrdenCompra/nuevaOrden",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        alert(
          `Error al generar la orden de compra: ${response.status} - ${errorText}`
        );
        return;
      }

      const data: RespuestaNuevaOrden = await response.json();
      console.log("Response data:", data);

      // Si hay productos existentes y no es una confirmación, mostrar modal
      if (
        data.nombresPedidos &&
        data.nombresPedidos.length > 0 &&
        !confirmacion
      ) {
        setProductosExistentes(data.nombresPedidos);
        setDetallesPendientes(detalles);
        setShowConfirmModal(true);
      } else {
        // Éxito - mostrar mensaje y limpiar formulario
        alert("¡Orden de compra generada exitosamente!");
        setFilasOrden([]);
      }
    } catch (error) {
      console.error("Error al generar órdenes:", error);
      alert(
        `Error al generar las órdenes de compra: ${
          error instanceof Error ? error.message : "Error de conexión"
        }`
      );
    }
  };

  const confirmarGeneracion = async () => {
    setShowConfirmModal(false);
    await generarOrdenesDeCompra(true);
  };

  const cancelarGeneracion = () => {
    setShowConfirmModal(false);
    setProductosExistentes([]);
    setDetallesPendientes([]);
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/orden-de-compra/OrdenesCompra"
          className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a Gestión de Órdenes
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-100">
            Generar Orden de Compra
          </h1>
          <p className="text-slate-400">
            Crear nuevas órdenes de compra por proveedor
          </p>
        </div>
      </div>

      {/* Botón agregar artículo */}
      <div className="flex justify-start mb-6">
        <Button
          onClick={agregarFila}
          className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
        >
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
                    <TableHead className="text-purple-200 font-semibold">
                      Artículo
                    </TableHead>
                    <TableHead className="text-purple-200 font-semibold">
                      Proveedor
                    </TableHead>
                    <TableHead className="text-purple-200 font-semibold">
                      Cantidad
                    </TableHead>
                    <TableHead className="text-purple-200 font-semibold">
                      Subtotal
                    </TableHead>
                    <TableHead className="text-purple-200 font-semibold text-center">
                      Acciones
                    </TableHead>
                    <TableHead className="text-purple-200 font-semibold">
                      Debug Info
                    </TableHead>
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
                              actualizarFila(
                                fila.id,
                                "articuloId",
                                Number(value)
                              );
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
                            onValueChange={(value) =>
                              actualizarFila(
                                fila.id,
                                "proveedorId",
                                Number(value)
                              )
                            }
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
                                  {prov.predeterminado
                                    ? `${prov.nombreProvedor} (Predeterminado)`
                                    : prov.nombreProvedor}
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
                            onChange={(e) =>
                              actualizarFila(
                                fila.id,
                                "cantidad",
                                Number(e.target.value)
                              )
                            }
                            className="bg-slate-700 border-slate-600 text-slate-100 w-20"
                          />
                        </TableCell>
                        <TableCell className="text-green-400 font-semibold">
                          ${fila.subtotal.toFixed(2)}
                        </TableCell>
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
                        <TableCell className="text-xs text-slate-400">
                          ID: {fila.articuloProveedorId || "No asignado"}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8">
              <ShoppingCart className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-300 mb-2">
                No hay artículos en las órdenes
              </h3>
              <p className="text-slate-400 mb-4">
                Agregue artículos usando el botón "Agregar Artículo"
              </p>
            </div>
          )}

          {/* Total */}
          {filasOrden.length > 0 && (
            <div className="mt-6 p-4 bg-slate-700 rounded-lg border border-slate-600">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium text-slate-200">
                  Total General:
                </span>
                <span className="text-2xl font-bold text-green-400">
                  ${calcularTotal().toFixed(2)}
                </span>
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
                onClick={() => generarOrdenesDeCompra(false)}
                className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 px-6 py-3"
              >
                <Send className="w-5 h-5" />
                Generar Órdenes de Compra
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de confirmación */}
      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent className="bg-slate-800 border-slate-700 text-slate-100">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-yellow-400">
              <AlertTriangle className="w-5 h-5" />
              Productos con órdenes existentes
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-slate-300 mb-4">
              Ya existen órdenes de compra para los siguientes productos:
            </p>
            <ul className="list-disc list-inside text-slate-200 bg-slate-700 p-4 rounded-lg">
              {productosExistentes.map((producto, index) => (
                <li key={index}>{producto}</li>
              ))}
            </ul>
            <p className="text-slate-400 mt-4">
              ¿Desea continuar con la generación de la orden?
            </p>
          </div>
          <DialogFooter className="gap-2">
            <Button
              onClick={cancelarGeneracion}
              variant="outline"
              className="bg-slate-700 border-slate-600"
            >
              Cancelar
            </Button>
            <Button
              onClick={confirmarGeneracion}
              className="bg-green-600 hover:bg-green-700"
            >
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
