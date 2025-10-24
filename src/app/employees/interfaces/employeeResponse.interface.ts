

export  interface EmployeeResponse {
  id:                   number;
  firstName:            string;
  lastName:             string;
  dni:                  string;
  email:                string;
  address:              string;
  cellphone:            string;
  bankAccountNumber:    string;
  bankAccountCciNumber: string;
  salary:               number;
  birthday:             Date;
  photo:                null | string;
  active:               boolean;
  departmentName:       string;
  positionName:         string;
}

export interface EmployeeUpdate {
  firstName?: string;
  lastName?: string;
  dni?: string;
  email?: string;
  password?: string;
  address?: string;
  cellphone?: string;
  bankAccountNumber?: string;
  bankAccountCciNumber?: string;
  salary?: number;
  active:boolean,
  birthday?: string; // puedes usar Date si el backend lo maneja así
  //photo?: | string; // o File si se envía una imagen
  departmentId?: number;
  positionId?: number;
}

export interface APIResponseEmployee {
  message: string;
  data:    EmployeeUpdatedResponse;
  status:  number;
  success: boolean;
}

export interface EmployeeUpdatedResponse {
  firstName:            string;
  lastName:             string;
  dni:                  null;
  email:                null;
  password:             string;
  address:              string;
  cellphone:            string;
  bankAccountNumber:    string;
  bankAccountCciNumber: string;
  salary:               number;
  birthday:             Date;
  photo:                null;
  departmentId:         number;
  positionId:           number;
}
