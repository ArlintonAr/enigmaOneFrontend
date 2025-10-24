

export interface Movement{
  id:                         number;
  type:                       string;
  quantity:                   string;
  returnable:                 string;
  transactionCode:            string;
  materialRequesterFirstName: string;
  materialRequesterLastName:  string;
  returnDate:                 Date;
  employeeFirstName:          string;
  employeeLastName:           string;
  detailEntryMaterials:       any[];
  detailExitMaterials:        any[];

  created_at:                 Date;
  updated_at:                 Date;
}

export interface MovementAllResponse {
  message: string;
  data:    Movement[];
  status:  number;
  success: boolean;
}


export interface DetailEMaterial {
  created_at:             Date;
  updated_at:             Date;
  id:                     number;
  destinationMaterial:    string;
  transactionCode:        string;
  employeeNameRequerter:  string;
  employeeNameAuthorized: string;
  movementId:             number;
  stockId:                number;
  quantity:               number;
}




// src/app/models/movement.models.ts

export type ReturnableType = 'SALIDA' | 'ENTRADA' ;
export type MovementType = 'RETORNABLE' | 'NO_RETORNABLE' ;


export interface MovementCreateDTO {
  type: MovementType;
  returnable: ReturnableType;          // 'SALIDA' o 'ENTRADA'
  materialRequesterId: number;
  returnDate?:Date
  // Uno u otro según tipo:
  detailExitMaterials?: DetailCreateDTO[];
  detailEntryMaterials?: DetailCreateDTO[];
}
export interface DetailCreateDTO {
  stockId: number;
  quantity: number;
  destinationMaterial:string
}

export interface DetailResponse {
  id: number;
  stockId: number;
  quantity: number;
  voucherNumber?: string;
  transactionCode?: string;
  employeeRecives?: string;
  destinationMaterial?: string;
  // optionally include stock summary
  stock?: {
    id: number;
    code: string;
    quantity: number;
    description?: string;
  };
}

export interface MovementResponse {
  id: number;
  transactionCode: string;
  quantity: number; // total (calculado por backend)
  type?: MovementType;
  returnable: ReturnableType;
  materialRequesterId?: number;
  materialRequerterFirstName?: string;
  materialRequerterLastName?: string;
  detailExitMaterials?: DetailResponse[];
  detailEntryMaterials?: DetailResponse[];
  createdAt?: string;
}

export interface APIMovementResponse {
  message: string;
  success?: boolean;
  data?: MovementResponse;
}

/* // si tu backend usa ApiResponseTest con code
export interface ApiResponseTest<T> {
  message: string;
  data?: T;
  code?: number;
}
 */





