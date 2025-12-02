import { Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { OrderEntryComponent } from '../../../stock/components/orderEntry/orderEntry.component';
import { ListOrdersComponent } from '../../../orders/components/listOrders/listOrders.component';
import { OrdersComponent } from '../../../orders/pages/orders/orders.component';
import { Order } from '../../../orders/interfaces/order.interface';
import { OrderService } from '../../../orders/services/orders.service';
import { RouterLink } from '@angular/router';
import { DashboardStats, MovementSummary } from '../../interfaces/dashboard.interfaces';
import { MovementService } from '../../../movements/services/movements.service';
import { StockService } from '../../../stock/services/stock.service';
import { EmployeesService } from '../../../employees/services/employees.service';
import { forkJoin, catchError, of } from 'rxjs';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'dashboard-pricipal-page',
  imports: [OrderEntryComponent, ListOrdersComponent, RouterLink, DatePipe],
  templateUrl: './pricipalPage.component.html',

})
export class PricipalPageComponent implements OnInit {

  @ViewChild(OrderEntryComponent) orderEntryComponent!: OrderEntryComponent
  @ViewChild(OrdersComponent) ordersComponent!: OrdersComponent
  @ViewChild('openListOrders') openListOrders!: ElementRef<HTMLDialogElement>;

  private ordersService = inject(OrderService)
  private movementService = inject(MovementService)
  private stockService = inject(StockService)
  private employeesService = inject(EmployeesService)

  // Signals for dynamic data
  listOrders = signal<Order[]>([])
  recentOrders = signal<Order[]>([])
  dashboardStats = signal<DashboardStats>({
    totalStock: 0,
    activeOrders: 0,
    totalEmployees: 0,
    completedOrders: 0,
    pendingOrders: 0,
    totalProducts: 0
  })
  movementSummary = signal<MovementSummary>({
    entries: 0,
    exits: 0,
    balance: 0,
    entriesChange: 0,
    exitsChange: 0
  })
  isLoading = signal<boolean>(true)

  ngOnInit(): void {
    this.loadAllDashboardData();
  }

  loadAllDashboardData() {
    this.isLoading.set(true);

    forkJoin({
      orders: this.ordersService.getAllOrders().pipe(
        catchError(err => {
          console.error('Error loading orders:', err);
          return of({ data: [], success: false, message: 'Error', status: 500 });
        })
      ),
      movements: this.movementService.getAllMovements().pipe(
        catchError(err => {
          console.error('Error loading movements:', err);
          return of({ data: [], success: false, message: 'Error', status: 500 });
        })
      ),
      stock: this.stockService.getAllStock().pipe(
        catchError(err => {
          console.error('Error loading stock:', err);
          return of({ data: [], success: false, message: 'Error', status: 500 });
        })
      ),
      employees: this.employeesService.getAllEmployees().pipe(
        catchError(err => {
          console.error('Error loading employees:', err);
          return of([]);
        })
      )
    }).subscribe({
      next: ({ orders, movements, stock, employees }) => {
        // Process recent orders
        if (orders.success && orders.data) {
          this.recentOrders.set(orders.data.slice(0, 5));
        }

        // Process dashboard stats
        const activeOrders = orders.data?.filter(o =>
          o.currentTrackingState !== 'COMPLETADO' && o.currentTrackingState !== 'CANCELADO'
        ).length || 0;

        const completedOrders = orders.data?.filter(o =>
          o.currentTrackingState === 'COMPLETADO'
        ).length || 0;

        const pendingOrders = orders.data?.filter(o =>
          o.approvalStatus === 'PENDING'
        ).length || 0;

        this.dashboardStats.set({
          totalStock: stock.data?.reduce((sum, s) => sum + s.quantity, 0) || 0,
          activeOrders: activeOrders,
          totalEmployees: Array.isArray(employees) ? employees.length : 0,
          completedOrders: completedOrders,
          pendingOrders: pendingOrders,
          totalProducts: stock.data?.length || 0
        });

        // Process movement summary
        if (movements.data) {
          this.calculateMovementSummary(movements.data);
        }
      },
      complete: () => {
        this.isLoading.set(false);
      }
    });
  }

  private calculateMovementSummary(movements: any[]) {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    // Movimientos de esta semana
    const thisWeek = movements.filter(m =>
      new Date(m.created_at) >= oneWeekAgo
    );

    // Movimientos de la semana pasada
    const lastWeek = movements.filter(m => {
      const date = new Date(m.created_at);
      return date >= twoWeeksAgo && date < oneWeekAgo;
    });

    const entriesThisWeek = thisWeek.filter(m => m.returnable === 'ENTRADA').length;
    const exitsThisWeek = thisWeek.filter(m => m.returnable === 'SALIDA').length;

    const entriesLastWeek = lastWeek.filter(m => m.returnable === 'ENTRADA').length;
    const exitsLastWeek = lastWeek.filter(m => m.returnable === 'SALIDA').length;

    const entriesChange = entriesLastWeek > 0
      ? ((entriesThisWeek - entriesLastWeek) / entriesLastWeek) * 100
      : 0;

    const exitsChange = exitsLastWeek > 0
      ? ((exitsThisWeek - exitsLastWeek) / exitsLastWeek) * 100
      : 0;

    this.movementSummary.set({
      entries: entriesThisWeek,
      exits: exitsThisWeek,
      balance: entriesThisWeek - exitsThisWeek,
      entriesChange: Math.round(entriesChange),
      exitsChange: Math.round(exitsChange)
    });
  }

  getOrderItemsCount(order: Order): number {
    const materialCount = order.materialOrders?.length || 0;
    const serviceCount = order.serviceOrders?.length || 0;
    return materialCount + serviceCount;
  }

  getTrackingBadgeClass(state: string | undefined): string {
    if (!state) return 'badge-ghost';

    const stateMap: Record<string, string> = {
      'EN_RUTA': 'badge-warning',
      'ALMACEN': 'badge-success',
      'PROCESANDO': 'badge-info',
      'COMPLETADO': 'badge-success',
      'CANCELADO': 'badge-error'
    };

    return stateMap[state] || 'badge-ghost';
  }

  getTrackingStateLabel(state: string | undefined): string {
    if (!state) return 'Sin estado';

    const labelMap: Record<string, string> = {
      'EN_RUTA': 'En Ruta',
      'ALMACEN': 'Almacén',
      'PROCESANDO': 'Procesando',
      'COMPLETADO': 'Completado',
      'CANCELADO': 'Cancelado'
    };

    return labelMap[state] || state;
  }

  openOrderEntryModal() {
    this.orderEntryComponent.openModal()
  }

  openModalListOrders() {
    this.ordersService.getAllOrders()
      .subscribe((response) => {
        this.listOrders.set(response.data)
      })
    this.openListOrders.nativeElement.showModal()
  }

  closeModalListOrders() {
    this.openListOrders.nativeElement.close()
  }

}
