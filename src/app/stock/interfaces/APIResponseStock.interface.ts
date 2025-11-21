export interface APIResponseStock {
  message: string;
  data: Stock[];
  status: number
  success: boolean;

}
export interface APIResponseStockCreate {
  message: string;
  data: Stock;
  status: number
  success: boolean;

}

export interface Stock {
  created_at: Date;
  updated_at: Date;
  id: number;
  code: string;
  quantity: number;
  unitOfMeasure: string;
  description: string;
  characteristics: string;
  entryDate: Date;
  accordingType: string;
  messageAccordingType: string;
  photo: string;
  movements: any[];
  warehouseId: number;
  orderGuides: string
  orderId: number
}


export interface StockCreate {

  code: string;
  quantity: number;
  unitOfMeasure: string;
  description: string;
  characteristics: string;
  entryDate: Date;
  accordingType: string;
  messageAccordingType: string;
  photo?: File | null;

  orderId: string


}

export interface StockUpdate {

  quantity?: number;
  unitOfMeasure?: string;
  description?: string;
  characteristics?: string;
  entryDate?: Date;
  accordingType?: string;
  messageAccordingType?: string;

}

export interface StockUpdatedResponse {
  message: string;
  data: StockResponseUpdated;
  success: boolean;
}

export interface StockResponseUpdated {
  created_at: Date;
  updated_at: Date;
  id: number;
  code: string;
  quantity: number;
  unitOfMeasure: string;
  description: string;
  characteristics: string;
  entryDate: Date;
  accordingType: string;
  messageAccordingType: string;
  photo: string;
  movements: any[];
  warehouseId: number;
  orderGuides: string;
  orderId: number;
  orders: any[];
}

export interface StockDeletedResponse {
  message: string
  data: null
  success: boolean
}
