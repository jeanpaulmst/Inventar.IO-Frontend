"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function NuevoEstadoPage() {
  const [nombreEstado, setNombreEstado] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validación básica
    if (!nombreEstado.trim()) {
      alert("Por favor, ingrese el nombre del estado");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `http://localhost:8080/ABMEstadoOrdenCompra/altaEstado?nombreEstado=${encodeURIComponent(
          nombreEstado.trim()
        )}`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      alert(`Estado "${nombreEstado.trim()}" agregado exitosamente`);

      // Limpiar el formulario
      setNombreEstado("");
    } catch (error) {
      console.error("Error al agregar estado:", error);
      alert(
        `Error al agregar el estado: ${
          error instanceof Error ? error.message : "Error desconocido"
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      {/* Header con botón de volver */}
      <div className="mb-8">
        <Link
          href="/orden-de-compra/ABMEstadoOrdenCompra"
          className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a ABM Estado Orden
        </Link>

        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-100 mb-4">
            Agregar Nuevo Estado
          </h1>
          <p className="text-slate-400 text-lg">
            Complete la información del nuevo estado de orden de compra
          </p>
        </div>
      </div>

      {/* Formulario */}
      <div className="max-w-2xl mx-auto">
        <Card className="bg-slate-800 border-slate-700 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-purple-900 to-slate-800 rounded-t-lg">
            <CardTitle className="text-2xl text-purple-100 flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              Datos del Estado
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Campo Nombre Estado */}
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
                  value={nombreEstado}
                  onChange={(e) => setNombreEstado(e.target.value)}
                  placeholder="Ingrese el nombre del estado"
                  className="bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400 focus:border-purple-500 focus:ring-purple-500"
                  required
                  disabled={isLoading}
                />
                <p className="text-xs text-slate-400">
                  Ingrese un nombre descriptivo para el estado de la orden de
                  compra
                </p>
              </div>

              {/* Información adicional */}
              <div className="p-4 bg-slate-700 rounded-lg border border-slate-600">
                <h3 className="text-slate-200 font-medium mb-2">Información</h3>
                <ul className="text-sm text-slate-400 space-y-1">
                  <li>• El nombre del estado es obligatorio</li>
                  <li>• Asegúrese de que el nombre sea único en el sistema</li>
                  <li>
                    • Use nombres descriptivos como "En Proceso", "Aprobado",
                    etc.
                  </li>
                  <li>• Puede modificar esta información posteriormente</li>
                </ul>
              </div>

              {/* Botón de envío */}
              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  disabled={isLoading || !nombreEstado.trim()}
                  className="bg-purple-600 hover:bg-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white flex items-center gap-2 px-6 py-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Agregando...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Agregar Estado
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
            ¿Qué sucede después?
          </h4>
          <div className="text-sm text-slate-400 space-y-1">
            <p>• El estado será agregado al sistema con estado "Activo"</p>
            <p>
              • Podrá modificar o eliminar el estado desde la lista de ABM
              Estado Orden
            </p>
            <p>
              • El estado estará disponible para asignar a órdenes de compra
            </p>
            <p>• Se registrará la fecha y hora de creación automáticamente</p>
          </div>
        </div>
      </div>
    </div>
  );
}
