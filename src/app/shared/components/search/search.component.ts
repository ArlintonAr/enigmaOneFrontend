import { ChangeDetectionStrategy, Component, EventEmitter, input, output } from '@angular/core';

@Component({
  selector: 'app-search',
  imports: [],
  templateUrl: './search.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent {


  placeholder = input<string>('')

  onValue = output<string>(); //nueva forma moderna reemplza al: @Output() newItemEvent = new EventEmitter<string>();


  emitValue(event: string):void {
    setTimeout(() => {
      this.onValue.emit(event);
    }, 600);
  }



}
