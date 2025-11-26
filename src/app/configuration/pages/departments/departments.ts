import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ConfigurationService } from '../../services/configuration.service';
import { Department, DepartmentCreate } from '../../interfaces/APIResponseDepartments';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-departments',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './departments.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Departments {

  private configurationService = inject(ConfigurationService);
  private fb = inject(FormBuilder);

  // Signals for state management
  listDepartments = signal<Department[]>([]);
  isLoading = signal<boolean>(false);
  errorMessage = signal<string>('');
  showModal = signal<boolean>(false);
  isEditMode = signal<boolean>(false);
  selectedDepartmentId = signal<number | null>(null);

  // Delete confirmation modal
  showDeleteModal = signal<boolean>(false);
  departmentToDelete = signal<Department | null>(null);

  // Form
  departmentForm: FormGroup;

  constructor() {
    this.departmentForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      code: ['', [Validators.required, Validators.minLength(2)]]
    });

    this.getAllDepartments();
  }

  // Get all departments
  getAllDepartments(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.configurationService.getAllDepartments().subscribe({
      next: (response) => {
        this.listDepartments.set(response.data || []);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error fetching departments:', error);
        this.errorMessage.set('Error al cargar los departamentos');
        this.isLoading.set(false);
      }
    });
  }

  // Search department by ID
  searchDepartmentById(term: string): void {
    if (term === '') {
      this.getAllDepartments();
      return;
    }

    const id = Number(term);
    if (isNaN(id)) {
      this.errorMessage.set('ID inválido');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.configurationService.getDepartmentById(id).subscribe({
      next: (response) => {
        if (response.data) {
          this.listDepartments.set([response.data]);
        } else {
          this.listDepartments.set([]);
          this.errorMessage.set('Departamento no encontrado');
        }
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error fetching department by ID:', error);
        this.errorMessage.set('Error al buscar el departamento');
        this.listDepartments.set([]);
        this.isLoading.set(false);
      }
    });
  }

  // Open modal for create
  openCreateModal(): void {
    this.isEditMode.set(false);
    this.selectedDepartmentId.set(null);
    this.departmentForm.reset();
    this.showModal.set(true);
  }

  // Open modal for edit
  openEditModal(department: Department): void {
    this.isEditMode.set(true);
    this.selectedDepartmentId.set(department.id);
    this.departmentForm.patchValue({
      name: department.name,
      code: department.code
    });
    this.showModal.set(true);
  }

  // Close modal
  closeModal(): void {
    this.showModal.set(false);
    this.departmentForm.reset();
    this.errorMessage.set('');
  }

  // Submit form (create or update)
  onSubmit(): void {
    if (this.departmentForm.invalid) {
      this.errorMessage.set('Por favor complete todos los campos requeridos');
      return;
    }

    const departmentData: DepartmentCreate = {
      name: this.departmentForm.value.name,
      code: this.departmentForm.value.code
    };

    if (this.isEditMode()) {
      this.updateDepartment(departmentData);
    } else {
      this.createDepartment(departmentData);
    }
  }

  // Create department
  createDepartment(department: DepartmentCreate): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.configurationService.createDepartment(department).subscribe({
      next: (response) => {
        console.log('Department created:', response);
        this.isLoading.set(false);
        this.closeModal();
        this.getAllDepartments();
      },
      error: (error) => {
        console.error('Error creating department:', error);
        this.errorMessage.set('Error al crear el departamento');
        this.isLoading.set(false);
      }
    });
  }

  // Update department
  updateDepartment(department: DepartmentCreate): void {
    const id = this.selectedDepartmentId();
    if (!id) return;

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.configurationService.updateDepartment(id, department).subscribe({
      next: (response) => {
        console.log('Department updated:', response);
        this.isLoading.set(false);
        this.closeModal();
        this.getAllDepartments();
      },
      error: (error) => {
        console.error('Error updating department:', error);
        this.errorMessage.set('Error al actualizar el departamento');
        this.isLoading.set(false);
      }
    });
  }

  // Open delete confirmation modal
  openDeleteModal(department: Department): void {
    this.departmentToDelete.set(department);
    this.showDeleteModal.set(true);
  }

  // Close delete confirmation modal
  closeDeleteModal(): void {
    this.showDeleteModal.set(false);
    this.departmentToDelete.set(null);
  }

  // Confirm and delete department
  confirmDelete(): void {
    const department = this.departmentToDelete();
    if (!department) return;

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.configurationService.deleteDepartment(department.id).subscribe({
      next: (response) => {
        console.log('Department deleted:', response);
        this.isLoading.set(false);
        this.closeDeleteModal();
        this.getAllDepartments();
      },
      error: (error) => {
        console.error('Error deleting department:', error);
        this.errorMessage.set('Error al eliminar el departamento');
        this.isLoading.set(false);
        this.closeDeleteModal();
      }
    });
  }
}

