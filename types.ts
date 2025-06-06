//Todos los DTO

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