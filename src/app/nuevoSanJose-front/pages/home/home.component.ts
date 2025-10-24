import {  Component, inject } from '@angular/core';
import { MenuComponent } from "../../components/menu/menu.component";
import { MenuStartComponent } from "../../components/menuStart/menuStart.component";
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'nuevoSanJose-home',
  imports: [MenuComponent, MenuStartComponent,RouterLink],
  templateUrl: './home.component.html',

})
export class HomeComponent {


  router = inject(Router)

  changeTheme(event: any) {
    const checked = event.target.checked;
    document.documentElement.setAttribute('data-theme', checked ? 'synthwave' : 'light');
  }



}
