
import { Movement } from "../../movements/interfaces/movement.interface";
import { EmployeeResponse } from "./employeeResponse.interface";


export interface APIResponse {
  message: string;
  data:    EmployeeResponse[];
  status:  number;
  success: boolean;
}


export interface APIResponseMovements {
  message: string;
  data:    Movement[];
  status:  number;
  success: boolean;
}


export interface APIResponseCreateEmployee {
  message: string;
  data:    EmployeeResponse;
  status:  number;
  success: boolean;
}
