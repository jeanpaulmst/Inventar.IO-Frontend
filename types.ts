//Todos los DTO

//CU1_GenerarVenta
export interface DTOGenerarVenta {
    detalles : DTODetalleGenerarVenta[]
    total : number
}
export interface DTODetalleGenerarVenta {
    articuloID : number
    cantidad : number
    subTotal : number
}

//CU2_ListarProductosAReponer -- CU3_ListarProductosFaltantes
export interface DTOArticulo {
  id: number;
  costoAlmacenamiento: number;
  nombreArt: string;
  descripcionArt: string;
  fhBajaArticulo: Date | null;
  inventarioMaxArticulo: number;
  loteOptimo: number;
  precioUnitario: number;
  proximaRevision: Date | null;
  puntoPedido: number;
  stock: number;
  stockSeguridad: number;
  tiempoFijo: number;
}

//CU4_ModificarOrdenDeCompra


//CU11_ListarArticuloXProveedores
export interface DTOProveedor {
  idProv: number
  nombreProveedor: string
  fhBajaProveedor: string
}

export interface DTOArticuloProv {

    idArticulo : number
    nombreArticulo : string
    modeloInventario : string
    isPredeterminado : boolean
    descripcionArticulo : string
    precioUnitario : number
    costoUnitario : number
    demoraEntrega : number
    costoPedido : number
    stock : number

}

//CU12_AjustarInventario
export interface DTOAjustarInventario {
    nombre: string
    cantidad: number
}

//CU14_ABMProveedor
export interface DTOProveedor {
  idProv: number
  nombreProveedor: string
  fhBajaProveedor: string
}

//CU16_ABMEstadoOrdenCompra
export interface DTOABMEstadoOrdenCompra {
  idEOC: number
  nombreEstado: string
  fhBajaEOC: number | null
}

//CU18_CalcularCGI
export interface DTOTablaArticulo {
    id: number  
    nombre: string
    descripcionArt: string
    stock: number
}

export interface DTOCalcularCGI {
    nombreArticulo: string
    datosCGI : DTODatosCGI[]
}

export interface DTODatosCGI {
    nombreProveedor : string
    nombreTipoModelo : string
    cgi : number
    costoCompra : number
    costoPedido : number
    costoAlmacenamiento : number
    predeterminado: boolean
}