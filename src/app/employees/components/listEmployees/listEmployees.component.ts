import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { EmployeeResponse } from '../../interfaces/employeeResponse.interface';
import { RemoveHyphenPipe } from '../../pipes/removeHyphen.pipe';
import { NoPhotoPipe } from '../../pipes/noPhoto.pipe';
import { DetailEmployeeComponent } from "../detailEmployee/detailEmployee.component";
import { ToUpperCaseFirstLetterPipe } from '../../pipes/toUpperCaseFirstLetter.pipe';

@Component({
  selector: 'list-employees',
  imports: [RemoveHyphenPipe, NoPhotoPipe, DetailEmployeeComponent,ToUpperCaseFirstLetterPipe],
  templateUrl: './listEmployees.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListEmployeesComponent {

  public employeesList = input.required<EmployeeResponse[]>();


}
