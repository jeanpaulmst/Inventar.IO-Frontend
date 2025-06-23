"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

// Interfaz para el estado de orden de compra
interface EstadoOrdenCompra {
  id: number;
  nombreEstado: string;
  fechaHoraBaja: string | null;
}

interface DTOEstadoOrdenCompra {
  nombreEstado: string;
}

export default function ModificarEstadoOrdenCompraPage() {
  const params = useParams();
  const router = useRouter();
  const estadoId = params.id as string;

  const [estado, setEstado] = useState<EstadoOrdenCompra | null>(null);
  const [formData, setFormData] = useState<DTOEstadoOrdenCompra>({
    nombreEstado: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<DTOEstadoOrdenCompra>>({});

  // URLs base para los endpoints
  const API_URL_ESTADOS = "http://localhost:8080/ABMEstadoOrdenCompra";

  // Cargar datos del estado al montar el componente
  useEffect(() => {
    const fetchEstadoData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${API_URL_ESTADOS}/getDatosEstado?idEstadoOrdenCompra=${estadoId}`
        );

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data: any = await response.json();

        setEstado({
          id: data.idEOC,
          nombreEstado: data.nombreEstado,
          fechaHoraBaja: data.fhBajaEOC,
        });
        setFormData({
          nombreEstado: data.nombreEstado,
        });
        setError(null);
      } catch (err) {
        console.error("Error al obtener datos del estado:", err);
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setIsLoading(false);
      }
    };

    if (estadoId) {
      fetchEstadoData();
    }
  }, [estadoId]);

  const handleInputChange = (
    field: keyof DTOEstadoOrdenCompra,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validación básica
    if (!formData.nombreEstado.trim()) {
      setErrors({ nombreEstado: "El nombre del estado es obligatorio" });
      return;
    }

    setIsSaving(true);

    try {
      // Crear el objeto DTOModificarEstado para enviar
      const dtoModificar = {
        id: estado!.id,
        nuevoNombre: formData.nombreEstado.trim(),
      };

      const response = await fetch(`${API_URL_ESTADOS}/modificar`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dtoModificar),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error: ${errorData.mensaje}`);
      }

      alert(`Estado "${formData.nombreEstado.trim()}" modificado exitosamente`);
      router.push("/orden-de-compra/ABMEstadoOrdenCompra");
    } catch (error) {
      console.error("Error al modificar estado:", error);
      alert(
        `Error al modificar el estado: ${
          error instanceof Error ? error.message : "Error desconocido"
        }`
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-400">Cargando estado...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !estado) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-400 text-2xl">⚠</span>
            </div>
            <h3 className="text-xl font-semibold text-slate-300 mb-2">
              Error al cargar estado
            </h3>
            <p className="text-slate-400 mb-4">
              {error || "Estado no encontrado"}
            </p>
            <Link href="/orden-de-compra/ABMEstadoOrdenCompra">
              <Button className="bg-purple-600 hover:bg-purple-700">
                Volver a ABM Estado Orden de Compra
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      {/* Header con botón de volver */}
      <div className="mb-8">
        <Link
          href="/orden-de-compra/ABMEstadoOrdenCompra"
          className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a ABM Estado Orden de Compra
        </Link>

        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-100 mb-4">
            Modificar Estado de Orden de Compra
          </h1>
          <p className="text-slate-400 text-lg">
            Editando:{" "}
            <span className="text-purple-400 font-medium">
              {estado.nombreEstado}
            </span>{" "}
            (ID: {estado.id})
          </p>
        </div>
      </div>

      {/* Formulario */}
      <div className="max-w-2xl mx-auto">
        <Card className="bg-slate-800 border-slate-700 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-purple-900 to-slate-800 rounded-t-lg">
            <CardTitle className="text-2xl text-purple-100 flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              Datos del Estado de Orden de Compra
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Campo Nombre */}
              <div className="space-y-2">
                <Label
                  htmlFor="nombreEstado"
                  className="text-slate-200 font-medium"
                >
                  Nombre del Estado *
                </Label>
                <Input
                  id="nombreEstado"
                  type="text"
                  value={formData.nombreEstado}
                  onChange={(e) =>
                    handleInputChange("nombreEstado", e.target.value)
                  }
                  placeholder="Ingrese el nombre del estado"
                  className={`bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400 focus:border-purple-500 focus:ring-purple-500 ${
                    errors.nombreEstado ? "border-red-500" : ""
                  }`}
                  disabled={isSaving}
                />
                {errors.nombreEstado && (
                  <p className="text-red-400 text-sm">{errors.nombreEstado}</p>
                )}
              </div>

              {/* Información adicional */}
              <div className="p-4 bg-slate-700 rounded-lg border border-slate-600">
                <h3 className="text-slate-200 font-medium mb-2">Información</h3>
                <ul className="text-sm text-slate-400 space-y-1">
                  <li>• Los campos marcados con (*) son obligatorios</li>
                  <li>• El nombre del estado debe ser único</li>
                  <li>
                    • Los cambios se aplicarán inmediatamente al confirmar
                  </li>
                </ul>
              </div>

              {/* Botón de envío */}
              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="bg-purple-600 hover:bg-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white flex items-center gap-2 px-6 py-2"
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Modificar Estado
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Información adicional */}
        <div className="mt-6 p-4 bg-slate-800 rounded-lg border border-slate-700">
          <h4 className="text-slate-200 font-medium mb-2">
            Información del estado original
          </h4>
          <div className="text-sm text-slate-400 space-y-1">
            <p>• ID: {estado.id}</p>
            <p>• Fecha de baja: {estado.fechaHoraBaja || "Activo"}</p>
            <p>• Los cambios se aplicarán inmediatamente al confirmar</p>
          </div>
        </div>
      </div>
    </div>
  );
}
