import { ChangeDetectionStrategy, Component, EventEmitter, input, Output } from '@angular/core';

@Component({
  selector: 'success-alert',
  imports: [],
  templateUrl: './successAlert.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuccessAlertComponent {

  @Output() close = new EventEmitter<void>()

  messageSuccess = input<string>('');


  onClose(){
    this.close.emit();
  }

 }
