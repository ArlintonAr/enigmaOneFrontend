
import { Injectable, signal } from '@angular/core';

@Injectable({providedIn: 'root'})
export class EmployeeEventService {

  isEmployeeUpdated = signal<boolean>(false)

  constructor() { }


  employeeUpdated(isUpdated:boolean){
    this.isEmployeeUpdated.set(isUpdated)
  }
}
