export interface MaterialOrderResponse {

  message: string;
  data:    MaterialOrder[];
  success: boolean;
}


export interface MaterialOrder {
  created_at:         Date;
  updated_at:         Date;
  id:                 number;
  typeMaterial:       typeMaterial;
  code:               string;
  quantity:           number;
  unitOfMeasure:      string;
  characteristics:    string;
  estimatedDateStock: Date;
  observations:       string;
  photo:              string;
  orderId:            number | null;
}
export interface MaterialOrderCreate {
  typeMaterial:       typeMaterial;
  quantity:           number;
  unitOfMeasure:      string;
  characteristics:    string;
  estimatedDateStock: Date;
  observations:       string;
  photo:              File;
  orderId:            number;
}

export interface MaterialOrderUpdate {
  typeMaterial?:       typeMaterial;
  quantity?:           number;
  unitOfMeasure?:      string;
  characteristics?:    string;
  estimatedDateStock?: Date;
  observations?:       string;
  photo?:              File | null;
}
const enum typeMaterial {
  REPUESTOS="REPUESTOS",
    MERCADERIA="MERCADERIA",
    PRODUCTO_TERMINADO="PRODUCTO_TERMINADO",
    SALUD="SALUD",
    SEGURIDAD_MEDIO_AMBIENTE="SEGURIDAD_MEDIO_AMBIENTE",
    ACTIVOS="ACTIVOS",
    GERRAMIENTAS="GERRAMIENTAS",
    SISTEMAS="SISTEMAS"
}
