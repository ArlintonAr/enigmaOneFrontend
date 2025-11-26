

export interface APIResonseDepartments {
    message: string;
    data: Department[];
    success: boolean;
}

export interface APIResonseDepartmentsById {
    message: string;
    data: Department;
    success: boolean;
}
export interface APIResonseDepartmentsCreate {
    message: string;
    data: Department;
    success: boolean;
}


export interface Department {
    id: number;
    name: string;
    code: string;
    state: boolean;
    created_at: Date;
    updated_at: Date;
}

export interface DepartmentCreate {
    name: string;
    code: string;
}
