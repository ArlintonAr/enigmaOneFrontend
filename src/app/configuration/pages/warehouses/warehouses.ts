import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ConfigurationService } from '../../services/configuration.service';
import { Warehouse, WarehouseCreate } from '../../interfaces/APIResponseWarehouse';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-warehouses',
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './warehouses.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Warehouses {

    private configurationService = inject(ConfigurationService);
    private fb = inject(FormBuilder);

    // Signals for state management
    listWarehouses = signal<Warehouse[]>([]);
    isLoading = signal<boolean>(false);
    errorMessage = signal<string>('');
    showModal = signal<boolean>(false);
    isEditMode = signal<boolean>(false);
    selectedWarehouseId = signal<number | null>(null);

    // Delete confirmation modal
    showDeleteModal = signal<boolean>(false);
    warehouseToDelete = signal<Warehouse | null>(null);

    // Form
    warehouseForm: FormGroup;

    constructor() {
        this.warehouseForm = this.fb.group({
            locationName: ['', [Validators.required, Validators.minLength(3)]],
            latitude: [''],
            longitude: ['']
        });

        this.getAllWarehouses();
    }

    // Get all warehouses
    getAllWarehouses(): void {
        this.isLoading.set(true);
        this.errorMessage.set('');

        this.configurationService.getAllWarehouses().subscribe({
            next: (response) => {
                this.listWarehouses.set(response.data || []);
                this.isLoading.set(false);
            },
            error: (error) => {
                console.error('Error fetching warehouses:', error);
                this.errorMessage.set('Error al cargar los almacenes');
                this.isLoading.set(false);
            }
        });
    }

    // Search warehouse by ID
    searchWarehouseById(term: string): void {
        if (term === '') {
            this.getAllWarehouses();
            return;
        }

        const id = Number(term);
        if (isNaN(id)) {
            this.errorMessage.set('ID inválido');
            return;
        }

        this.isLoading.set(true);
        this.errorMessage.set('');

        this.configurationService.getWarehouseById(id).subscribe({
            next: (response) => {
                if (response.data) {
                    this.listWarehouses.set([response.data]);
                } else {
                    this.listWarehouses.set([]);
                    this.errorMessage.set('Almacén no encontrado');
                }
                this.isLoading.set(false);
            },
            error: (error) => {
                console.error('Error fetching warehouse by ID:', error);
                this.errorMessage.set('Error al buscar el almacén');
                this.listWarehouses.set([]);
                this.isLoading.set(false);
            }
        });
    }

    // Open modal for create
    openCreateModal(): void {
        this.isEditMode.set(false);
        this.selectedWarehouseId.set(null);
        this.warehouseForm.reset();
        this.showModal.set(true);
    }

    // Open modal for edit
    openEditModal(warehouse: Warehouse): void {
        this.isEditMode.set(true);
        this.selectedWarehouseId.set(warehouse.id);
        this.warehouseForm.patchValue({
            locationName: warehouse.locationName,
            latitude: warehouse.latitude,
            longitude: warehouse.longitude
        });
        this.showModal.set(true);
    }

    // Close modal
    closeModal(): void {
        this.showModal.set(false);
        this.warehouseForm.reset();
        this.errorMessage.set('');
    }

    // Submit form (create or update)
    onSubmit(): void {
        if (this.warehouseForm.invalid) {
            this.errorMessage.set('Por favor complete todos los campos requeridos');
            return;
        }

        const warehouseData: WarehouseCreate = {
            locationName: this.warehouseForm.value.locationName,
            latitude: this.warehouseForm.value.latitude || '',
            longitude: this.warehouseForm.value.longitude || ''
        };

        if (this.isEditMode()) {
            this.updateWarehouse(warehouseData);
        } else {
            this.createWarehouse(warehouseData);
        }
    }

    // Create warehouse
    createWarehouse(warehouse: WarehouseCreate): void {
        this.isLoading.set(true);
        this.errorMessage.set('');

        this.configurationService.createWarehouse(warehouse).subscribe({
            next: (response) => {
                console.log('Warehouse created:', response);
                this.isLoading.set(false);
                this.closeModal();
                this.getAllWarehouses();
            },
            error: (error) => {
                console.error('Error creating warehouse:', error);
                this.errorMessage.set('Error al crear el almacén');
                this.isLoading.set(false);
            }
        });
    }

    // Update warehouse
    updateWarehouse(warehouse: WarehouseCreate): void {
        const id = this.selectedWarehouseId();
        if (!id) return;

        this.isLoading.set(true);
        this.errorMessage.set('');

        this.configurationService.updateWarehouse(id, warehouse).subscribe({
            next: (response) => {
                console.log('Warehouse updated:', response);
                this.isLoading.set(false);
                this.closeModal();
                this.getAllWarehouses();
            },
            error: (error) => {
                console.error('Error updating warehouse:', error);
                this.errorMessage.set('Error al actualizar el almacén');
                this.isLoading.set(false);
            }
        });
    }

    // Open delete confirmation modal
    openDeleteModal(warehouse: Warehouse): void {
        this.warehouseToDelete.set(warehouse);
        this.showDeleteModal.set(true);
    }

    // Close delete confirmation modal
    closeDeleteModal(): void {
        this.showDeleteModal.set(false);
        this.warehouseToDelete.set(null);
    }

    // Confirm and delete warehouse
    confirmDelete(): void {
        const warehouse = this.warehouseToDelete();
        if (!warehouse) return;

        this.isLoading.set(true);
        this.errorMessage.set('');

        this.configurationService.deleteWarehouse(warehouse.id).subscribe({
            next: (response) => {
                console.log('Warehouse deleted:', response);
                this.isLoading.set(false);
                this.closeDeleteModal();
                this.getAllWarehouses();
            },
            error: (error) => {
                console.error('Error deleting warehouse:', error);
                this.errorMessage.set('Error al eliminar el almacén');
                this.isLoading.set(false);
                this.closeDeleteModal();
            }
        });
    }
}
