import { Tracking } from "../../trackings/interfaces/ApiResponseTracking";
import { MaterialOrder } from "./materialOrder.interface";
import { ServiceOrder } from "./serviceOrder.interface";



export interface Order {
  created_at:         Date;
  updated_at:         Date;
  id:                 number;
  type:               TypeOrder;
  estimatedDateStock: Date | null;
  employeeId:         number | null;
  serviceOrders:      ServiceOrder[];
  materialOrders:     MaterialOrder[];
  trackings:          Tracking[];
  approvalStatus:      string;
  currentTrackingState:    string;
}

export enum TypeOrder {
  Material = "MATERIAL",
  Service = "SERVICIO"
}

export interface CreateOrderDto{
  type:               TypeOrder;
  estimatedDateStock: string | null;
}

export interface DeleteOrderResponse {
  message: string;
  data:    null;
  success: boolean;
}
