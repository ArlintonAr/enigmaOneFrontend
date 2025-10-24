import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CreateMovementComponent } from "../../components/createMovement/createMovement.component";

@Component({
  selector: 'app-management-movement',
  imports: [CreateMovementComponent],
  templateUrl: './managementMovement.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManagementMovement {


}
