

export interface APIResponseWarehouses {
    message: string;
    data: Warehouse[];
    success: boolean;
}

export interface APIResponseWarehouseById {
    message: string;
    data: Warehouse;
    success: boolean;
}

export interface APIResponseWarehouseCreate {
    message: string;
    data: Warehouse;
    success: boolean;
}


export interface Warehouse {
    id: number;
    locationName: string;
    latitude: string;
    longitude: string;
    state?: boolean;
    created_at: Date;
    updated_at: Date;
}

export interface WarehouseCreate {
    locationName: string;
    latitude: string;
    longitude: string;
}
