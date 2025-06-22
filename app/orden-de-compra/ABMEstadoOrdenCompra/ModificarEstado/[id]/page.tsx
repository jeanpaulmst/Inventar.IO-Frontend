"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
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

// DTO para modificar estado
interface DTOModificarEstado {
  id: number;
  nuevoNombre: string;
}

export default function ModificarEstadoPage() {
  const router = useRouter();
  const params = useParams();
  const estadoId = Number.parseInt(params.id as string);

  const [estado, setEstado] = useState<EstadoOrdenCompra | null>(null);
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Función para obtener el estado específico
  const fetchEstado = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:8080/ABMEstadoOrdenCompra/getEstados?soloVigentes=false`
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const raw: Array<{
        idEOC: number;
        fhBajaEOC: string | null;
        nombreEstado: string;
        dadoBaja: boolean;
      }> = await response.json();

      const estadoEncontrado = raw.find((e) => e.idEOC === estadoId);

      if (!estadoEncontrado) {
        throw new Error("Estado no encontrado");
      }

      const estadoData: EstadoOrdenCompra = {
        id: estadoEncontrado.idEOC,
        nombreEstado: estadoEncontrado.nombreEstado,
        fechaHoraBaja: estadoEncontrado.fhBajaEOC,
      };

      setEstado(estadoData);
      setNuevoNombre(estadoData.nombreEstado);
      setError(null);
    } catch (err) {
      console.error("Error al obtener estado:", err);
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (estadoId) {
      fetchEstado();
    }
  }, [estadoId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nuevoNombre.trim()) {
      alert("El nombre del estado es obligatorio");
      return;
    }

    if (!estado) return;

    setSaving(true);
    try {
      const dto: DTOModificarEstado = {
        id: estado.id,
        nuevoNombre: nuevoNombre.trim(),
      };

      const response = await fetch(
        "http://localhost:8080/ABMEstadoOrdenCompra/modificar",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dto),
        }
      );

      if (response.ok) {
        alert(`Estado "${estado.nombreEstado}" modificado exitosamente`);
        router.push("/orden-de-compra/ABMEstadoOrdenCompra");
      } else {
        const errorText = await response.text();
        throw new Error(errorText || "Error al modificar el estado");
      }
    } catch (error) {
      console.error("Error al modificar estado:", error);
      alert(
        `Error al modificar el estado: ${
          error instanceof Error ? error.message : "Error desconocido"
        }`
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push("/orden-de-compra/ABMEstadoOrdenCompra");
  };

  if (loading) {
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
            <Link href="/orden-compra/abm-estado-orden">
              <Button className="bg-purple-600 hover:bg-purple-700">
                Volver al listado
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Link href="/orden-de-compra/ABMEstadoOrdenCompra">
            <Button
              variant="outline"
              size="sm"
              className="bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-slate-100">
              Modificar Estado de Orden de Compra
            </h1>
            <p className="text-slate-400">Editar información del estado</p>
          </div>
        </div>
      </div>

      {/* Formulario */}
      <Card className="bg-slate-800 border-slate-700 shadow-xl max-w-2xl">
        <CardHeader className="bg-gradient-to-r from-blue-900 to-slate-800 rounded-t-lg">
          <CardTitle className="text-2xl text-blue-100 flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            Datos del Estado
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* ID (solo lectura) */}
            <div className="space-y-2">
              <Label htmlFor="id" className="text-slate-300 font-medium">
                ID del Estado
              </Label>
              <Input
                id="id"
                type="text"
                value={estado.id}
                disabled
                className="bg-slate-700 border-slate-600 text-slate-400 cursor-not-allowed"
              />
            </div>

            {/* Nombre actual (solo lectura) */}
            <div className="space-y-2">
              <Label
                htmlFor="nombreActual"
                className="text-slate-300 font-medium"
              >
                Nombre Actual
              </Label>
              <Input
                id="nombreActual"
                type="text"
                value={estado.nombreEstado}
                disabled
                className="bg-slate-700 border-slate-600 text-slate-400 cursor-not-allowed"
              />
            </div>

            {/* Nuevo nombre */}
            <div className="space-y-2">
              <Label
                htmlFor="nuevoNombre"
                className="text-slate-300 font-medium"
              >
                Nuevo Nombre <span className="text-red-400">*</span>
              </Label>
              <Input
                id="nuevoNombre"
                type="text"
                value={nuevoNombre}
                onChange={(e) => setNuevoNombre(e.target.value)}
                placeholder="Ingrese el nuevo nombre del estado"
                className="bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500"
                maxLength={100}
                required
              />
              <p className="text-xs text-slate-400">Máximo 100 caracteres</p>
            </div>

            {/* Estado */}
            <div className="space-y-2">
              <Label className="text-slate-300 font-medium">Estado</Label>
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    estado.fechaHoraBaja ? "bg-red-400" : "bg-green-400"
                  }`}
                ></div>
                <span
                  className={
                    estado.fechaHoraBaja ? "text-red-400" : "text-green-400"
                  }
                >
                  {estado.fechaHoraBaja
                    ? `Dado de baja: ${estado.fechaHoraBaja}`
                    : "Activo"}
                </span>
              </div>
            </div>

            {/* Botones */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6">
              <Button
                type="submit"
                disabled={
                  saving ||
                  !nuevoNombre.trim() ||
                  nuevoNombre.trim() === estado.nombreEstado
                }
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Guardar Cambios
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={saving}
                className="bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600"
              >
                Cancelar
              </Button>
            </div>
          </form>

          {/* Información adicional */}
          <div className="mt-6 p-4 bg-slate-700 rounded-lg border border-slate-600">
            <h4 className="text-slate-300 font-medium mb-2">Información</h4>
            <ul className="text-sm text-slate-400 space-y-1">
              <li>• El nombre del estado debe ser único en el sistema</li>
              <li>• Los cambios se aplicarán inmediatamente</li>
              <li>• No se puede modificar un estado que esté dado de baja</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
