import {  Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SubMenu } from '../../interfaces/subMenu.interface';


@Component({
  selector: 'sub-menu-for-modules',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './subMenuForModules.component.html',

})
export class SubMenuForModulesComponent {

  subMenu = input<SubMenu[]>();



}

