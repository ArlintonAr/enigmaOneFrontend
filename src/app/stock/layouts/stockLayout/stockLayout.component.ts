import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
  ViewChild,
} from '@angular/core';

import { Stock } from '../../interfaces/APIResponseStock.interface';
import { StockService } from '../../services/stock.service';
import { FormBuilder } from '@angular/forms';
import { OrderEntryComponent } from '../../components/orderEntry/orderEntry.component';
import { StockEventService } from '../../services/stockEvent.service';
import { SubMenuForModulesComponent } from '../../../shared/components/SubmenuForModules/subMenuForModules.component';
import { SubMenu } from '../../../shared/interfaces/subMenu.interface';
import { RouterOutlet } from '@angular/router';
import { WarehousesList } from '../../components/warehousesList/warehousesList';

@Component({
  selector: 'app-stock-layout',
  imports: [SubMenuForModulesComponent, RouterOutlet, OrderEntryComponent],
  templateUrl: './stockLayout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StockLayoutComponent {


  subMenu: SubMenu[] = [
    {
      name: 'Gestion Almacenes',
      icon: 'fa-regular fa-circle-right',
      description: '+1',
      route: '/dashboard/almacen/stock',
    },
    {
      name: 'Movimientos',
      icon: 'fa-regular fa-circle-right',
      description: '+1',
      route: '/dashboard/almacen/movimientos',
    },
  ];


}
