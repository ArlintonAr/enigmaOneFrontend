

export interface APIResponseTracking {
  message: string;
  data: Tracking[];
  success: boolean;
}
export interface APIResponseTrackingById {
  message: string;
  data: Tracking;
  success: boolean;
}


export interface Tracking {
  created_at: Date;
  updated_at: Date;
  id: number;
  trackingState: string;
  orderId: number;
}

export interface TrackingUpdate {
  trackingState:TrackingState

}

export interface TrackingResponseUpdated {
  message: string;
  data: Tracking;
  success: boolean;
}


export enum TrackingState {
  pedido = "PEDIDO",
  aprobado = "APROBADO",
  rechazado = "RECHAZADO",
  ruta = "RUTA",
  almacen = "ALMACEN",
}
