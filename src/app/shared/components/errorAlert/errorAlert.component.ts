import { ChangeDetectionStrategy, Component, EventEmitter, inject, input, Output, output, Signal, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'error-alert',
  imports: [ReactiveFormsModule],
  templateUrl: './errorAlert.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorAlertComponent {


  @Output() close = new EventEmitter<void>();

  messageError = input<string>('');


  onClose(){
    this.close.emit()
  }

}
