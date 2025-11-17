
export interface APIResponseWarehouse {
  message: string;
  data:    Warehouse[];
  status:  number;
  success: boolean;
}

export interface Warehouse {
  created_at:   Date;
  updated_at:   Date;
  id:           number;
  locationName: string;
  latitude:     string;
  longitude:    string;
  stocks:       any[];
}



export interface WarehouseCreateDTO {
  locationName: string;
  latitude:     string;
  longitude:    string;
}
