import { Order } from "./order.interface";

export interface APIResponseOrdersApprovals {
  message: string;
  data:    OrderApproval[];
  status:  number;
  success: boolean;
}

export interface OrderApproval {
  created_at:   Date;
  updated_at:   Date;
  id:           number;
  orderId:      number;
  role:         string;
  status:       string;
  approverId:   number | null;
  approverName: null | string;
  approvedAt:   Date | null;
  comments:     null | string;
  stepOrder:    number;
}


//Respuesta Aprobado

export interface APICreateOrdersApprovalsResponse {
  message: string;
  data:   DataCreateOrderApprovalResponse;
  status:  number;
  success: boolean;
}

export interface DataCreateOrderApprovalResponse{
  order: Order
  approvals:OrderApproval[]
}

//cuerpo para aprobar
export interface ApprovalActionDTO{
  comments:string
}



export interface ResponseUpdateTracking {
  message: string;
  data:    boolean;
  status:  number;
  success: boolean;
}

export interface TrackingActionDTO{
  state:string,
  note:string
}
