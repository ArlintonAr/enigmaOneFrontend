import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  computed,
  ViewChild,
  ElementRef,
} from '@angular/core';
import {
  FormBuilder,
  ɵInternalFormsSharedModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Order } from '../../interfaces/order.interface';
import { OrderService } from '../../services/orders.service';
import { MaterialOrderCreate } from '../../interfaces/materialOrder.interface';
import { ErrorAlertComponent } from '../../../shared/components/errorAlert/errorAlert.component';
import { ServiceOrderCreate } from '../../interfaces/serviceOrder.interface';
import { SuccessAlertComponent } from '../../../shared/components/exitAlert/successAlert.component';

const typeOrder = [
  {
    value: 'MATERIAL',
    id: 0,
  },
  {
    value: 'SERVICIO',
    id: 1,
  },
];
const typeMaterialOrder = [
  { value: 'REPUESTOS', id: 1 },
  { value: 'MERCADERIA', id: 2 },
  { value: 'PRODUCTO_TERMINADO', id: 3 },
  { value: 'SALUD', id: 4 },
  { value: 'SEGURIDAD_MEDIO_AMBIENTE', id: 5 },
  { value: 'ACTIVOS', id: 6 },
  { value: 'HERRAMIENTAS', id: 7 },
  { value: 'SISTEMAS', id: 8 },
];

@Component({
  selector: 'create-order',
  imports: [
    ɵInternalFormsSharedModule,
    ReactiveFormsModule,
    ErrorAlertComponent,
    SuccessAlertComponent,
  ],
  templateUrl: './createOrder.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateOrderComponent {
  private orderSerive = inject(OrderService);
  private fb = inject(FormBuilder);

  //Usuario autenticado
  userPersistence = computed(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const convertUser = JSON.parse(user);
      return convertUser.id;
    }
    return null;
  });
  public idEmployee = signal<number | null>(this.userPersistence());

  //Fotos
  selectedPhoto = signal<File[] | null>([]);
  @ViewChild('photoInput') photoInput!: ElementRef<HTMLInputElement>;

  //Material y Orden
  typeOrderArr = typeOrder;
  typeMaterialOrderArr = typeMaterialOrder;

  //Errores Material
  hasSuccessMaterialOrder = signal<boolean>(false);
  successNameMaterialOrder = signal<string>('');

  hasErrorMaterialOrder = signal<boolean>(false);
  errorNameMaterialOrder = signal<string>('');

  //Errores Order
  hasErrorOrder = signal<boolean>(false);
  errorNameOrder = signal<string>('');

  hasSuccessOrder = signal<boolean>(false);
  successNameOrder = signal<string>('');

  //Al crear nueva solicitud guardar datos en estas variables
  public newOrder = signal<Order | null>(null);
  public idNewOrder = signal<string | null>(null);

  //Formularios
  //Nuevo Formulario para crear el material
  public formCreateOrder = this.fb.group({
    type: [this.typeOrderArr[0].value, [Validators.required]],
    estimatedDateStock: ['', [Validators.required]],
  });
  //Formulario para MATERIAL
  public formCreateMaterial = this.fb.group({
    characteristics: [''],
    observations: [''],
    quantity: [0],
    unitOfMeasure: [''],
    typeMaterial: [this.typeMaterialOrderArr[5].value, [Validators.required]], //Por defecto ACTIVOS
  });
  //Formulario para SERVICIO
  public formCreateService = this.fb.group({
    characteristics: ['', [Validators.required]],
  });

  //Guardar lista de materiales
  materialsList = signal<MaterialOrderCreate[]>([]);

  //Guardar lista de Servicios
  servicesList = signal<ServiceOrderCreate[]>([]);

  @ViewChild('createOrder') createOrderModal!: ElementRef<HTMLDialogElement>;

  constructor() {
    this.formCreateMaterial.disable();
    this.formCreateService.disable();
  }

  openModal() {
    this.createOrderModal.nativeElement.showModal();
  }

  clouseModal() {
    if (!(this.idNewOrder() == null)) {
      this.hasErrorMaterialOrder.set(true);
      this.errorNameMaterialOrder.set(
        'Para cerrar primero cancele la nueva orden.'
      );
      return;
    }
    this.createOrderModal.nativeElement.close();
    this.resetValuesForms();
  }

  createNewOrder() {
    if (!this.formCreateOrder.valid) {
      this.hasErrorOrder.set(true);
      this.errorNameOrder.set('Formulario no válido');
      return;
    }

    if (!(this.idNewOrder() == null)) {
      this.hasErrorOrder.set(true);
      this.errorNameOrder.set(
        'Termine de generar la nueva Orden, antes de generar otra.'
      );
      return;
    }

    const formValue = this.formCreateOrder.value;
    //Eliminar el tipado para cada valor de los atributos
    const orderLike: Partial<Order> = {
      ...(formValue as any),
    };

    this.orderSerive.createOrder(orderLike)
    .subscribe((response) => {
      this.newOrder.set(response.data);
      this.idNewOrder.set(response.data.id.toString());
      if (formValue.type === 'MATERIAL') {
        this.formCreateMaterial.enable();
      } else if (formValue.type === 'SERVICIO') {
        this.formCreateService.enable();
      }
      this.hasSuccessOrder.set(true);
      this.successNameOrder.set('Orden de Material creada con éxito.');
    });
  }

  createNewMaterialOrder(): void {
    const materials = this.materialsList();

    if (materials.length > 0) {
      for (let i = 0; i < materials.length; i++) {
        const material = materials[i];
        const photo = this.selectedPhoto() ? this.selectedPhoto()![i] : null;
        this.orderSerive
          .createMaterialOrder(material, photo)
          .subscribe((response) => {
            this.resetValuesForMaterialForm();
            this.resetValuesForms();
            this.materialsList.set([]);


          });
      }
    } else {
      this.hasErrorMaterialOrder.set(true);
      this.errorNameMaterialOrder.set(
        'Cree una orden y por lo menos un material para guardar Orden'
      );
      return;
    }
  }

  selectedphotoMaterial(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.selectedPhoto.update((files) => [
        ...files!,
        ...Array.from(input.files!),
      ]);
      console.log(this.selectedPhoto());
    }
  }

  cancelCreateOrderAndMaterialOrder() {
    if (!this.idNewOrder()) {
      this.hasErrorMaterialOrder.set(true);
      this.errorNameMaterialOrder.set('No existe ID para eliminar orden.');
      return;
    }
    this.orderSerive.deleteOrder(this.idNewOrder()!).subscribe((response) => {
      console.log(response);
      this.resetValuesForms();
      this.resetValuesForMaterialForm();
      this.materialsList.set([]);
      this.selectedPhoto.set([]);
    });
  }

  resetValuesForMaterialForm() {
    this.formCreateMaterial.reset({
      typeMaterial: this.typeMaterialOrderArr[5].value,
    });
  }

  resetValuesForms() {
    this.formCreateMaterial.reset({
      typeMaterial: this.typeMaterialOrderArr[5].value,
    });
    this.formCreateOrder.reset({ type: this.typeOrderArr[0].value });
    this.formCreateMaterial.disable();
    this.formCreateService.reset();
    this.formCreateService.disable();
    this.hasErrorMaterialOrder.set(false);
    this.errorNameMaterialOrder.set('');
    this.hasErrorOrder.set(false);
    this.errorNameOrder.set('');
    this.selectedPhoto.set([]);

    this.idNewOrder.set(null);
    this.newOrder.set(null);
  }

  generateListMaterials() {
    if (!this.formCreateMaterial.valid) {
      this.hasErrorMaterialOrder.set(true);
      this.errorNameMaterialOrder.set(
        'El formulario de creación de material no es válido.'
      );
      return;
    }

    const currentOrder = this.newOrder();
    if (!currentOrder) {
      this.hasErrorMaterialOrder.set(true);
      this.errorNameMaterialOrder.set('La Orden no existe!');
      return;
    }

    const newMaterial = this.formCreateMaterial.value;

    const date = this.convertDate(currentOrder.estimatedDateStock!.toString());

    const materialOrderLike: MaterialOrderCreate = {
      ...(newMaterial as any),
      orderId: currentOrder.id,
      estimatedDateStock: date,
    };
    console.log(materialOrderLike);
    this.materialsList.update((materials) => [...materials, materialOrderLike]);
    this.resetValuesForMaterialForm();

    this.photoInput.nativeElement.value = '';
  }

  /**
   * Remove a material from the current materials list by index.
   * Called from the template when the user clicks the delete button.
   */
  removeMaterial(index: number) {
    this.materialsList.update((materials) =>
      materials.filter((_, i) => i !== index)
    );
  }

  /**
   * Update a single field of a material at given index. The template can call
   * this on input change to keep the signal in sync.
   */
  updateMaterial(index: number, field: keyof MaterialOrderCreate, value: any) {
    this.materialsList.update((materials) => {
      const copy = [...materials];
      const item = { ...(copy[index] as any) };
      item[field as string] = value;
      copy[index] = item as MaterialOrderCreate;
      return copy;
    });
  }

  /**
   * Remove a service from the current services list by index.
   */
  removeService(index: number) {
    this.servicesList.update((services) =>
      services.filter((_, i) => i !== index)
    );
  }

  /**
   * Update a single field of a service at given index.
   */
  updateService(index: number, field: keyof ServiceOrderCreate, value: any) {
    this.servicesList.update((services) => {
      const copy = [...services];
      const item = { ...(copy[index] as any) };
      item[field as string] = value;
      copy[index] = item as ServiceOrderCreate;
      return copy;
    });
  }

  //Logica para SERVICIO
  generateListServices() {
    if (!this.formCreateService.valid) {
      this.hasErrorMaterialOrder.set(true);
      this.errorNameMaterialOrder.set(
        'El formulario de creación de servicio no es válido.'
      );
      return;
    }

    const currentOrder = this.newOrder();
    if (!currentOrder) {
      this.hasErrorMaterialOrder.set(true);
      this.errorNameMaterialOrder.set('La Orden no existe!');
      return;
    }

    const newService = this.formCreateService.value;

    const date = this.convertDate(currentOrder.estimatedDateStock!.toString());
    const serviceOrderLike: ServiceOrderCreate = {
      ...(newService as any),
      orderId: currentOrder.id,
      deliveryDate: date,
    };

    console.log(serviceOrderLike);
    this.servicesList.update((services) => [...services, serviceOrderLike]);
    this.resetValuesForServiceForm();
  }

  resetValuesForServiceForm() {
    this.formCreateService.reset(); //Resetear a 0 la fecha de entrega
  }

  createNewServiceOrder(): void {
    const services = this.servicesList();

    if (services.length > 0) {
      for (let i = 0; i < services.length; i++) {
        const service = services[i];
        this.orderSerive.createServiceOrder(service).subscribe((response) => {
          this.resetValuesForServiceForm();
          this.resetValuesForms();
          this.servicesList.set([]);
        });
      }
    } else {
      this.hasErrorMaterialOrder.set(true);
      this.errorNameMaterialOrder.set(
        'Cree una orden y por lo menos un servicio para guardar Orden de Servicio'
      );
      return;
    }
  }

  convertDate(dateString: string): string | null {
    if (!dateString) return null;
    // Crea el objeto Date
    const date = new Date(dateString);
    // Extrae año, mes y día
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    // Retorna en formato yyyy-MM-dd
    return `${year}-${month}-${day}`;
  }
}
