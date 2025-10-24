

export interface ServiceOrderResponseUpdated {
  message: string;
  data:    ServiceOrder;
  success: boolean;
}


export interface ServiceOrderCreate {
  characteristics: string;
  deliveryDate:   Date;
  orderId:        number;
}
export interface ServiceOrderUpdate {
  characteristics?: string;
  deliveryDate?:    Date ;
}
export interface ServiceOrderResponse {
  message: string;
  data:    ServiceOrder[];
  success: boolean;
}

export interface ServiceOrder {
  created_at:      Date;
  updated_at:      Date;
  id:              number;
  code:            string;
  characteristics: string;
  deliveryDate:    Date;
  orderId:         number;
}
