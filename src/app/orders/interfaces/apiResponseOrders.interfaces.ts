import { Order } from "./order.interface";

export interface APIResponseOrders {
  message: string;
  data:    Order[];
  status:  number;
  success: boolean;
}
export interface APIResponseOrder {
  message: string;
  data:    Order;
  success: boolean;
}


export interface APIResponseOrdersCreate {
  message: string;
  data:    Order;
  status:  number;
  success: boolean;
}

