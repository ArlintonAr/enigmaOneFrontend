import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ConfigurationService } from '../../services/configuration.service';
import { Position, PositionCreate } from '../../interfaces/APIResponsePosition';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-positions',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './positions.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Positions {

  private configurationService = inject(ConfigurationService);
  private fb = inject(FormBuilder);

  // Signals for state management
  listPositions = signal<Position[]>([]);
  isLoading = signal<boolean>(false);
  errorMessage = signal<string>('');
  showModal = signal<boolean>(false);
  isEditMode = signal<boolean>(false);
  selectedPositionId = signal<number | null>(null);

  // Delete confirmation modal
  showDeleteModal = signal<boolean>(false);
  positionToDelete = signal<Position | null>(null);

  // Form
  positionForm: FormGroup;

  constructor() {
    this.positionForm = this.fb.group({
      positionName: ['', [Validators.required, Validators.minLength(3)]]
    });

    this.getAllPositions();
  }

  // Get all positions
  getAllPositions(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.configurationService.getAllPositions().subscribe({
      next: (response) => {
        this.listPositions.set(response.data || []);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error fetching positions:', error);
        this.errorMessage.set('Error al cargar las posiciones');
        this.isLoading.set(false);
      }
    });
  }

  // Search position by ID
  searchPositionById(term: string): void {
    if (term === '') {
      this.getAllPositions();
      return;
    }

    const id = Number(term);
    if (isNaN(id)) {
      this.errorMessage.set('ID inválido');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.configurationService.getPositionById(id).subscribe({
      next: (response) => {
        if (response.data) {
          this.listPositions.set([response.data]);
        } else {
          this.listPositions.set([]);
          this.errorMessage.set('Posición no encontrada');
        }
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error fetching position by ID:', error);
        this.errorMessage.set('Error al buscar la posición');
        this.listPositions.set([]);
        this.isLoading.set(false);
      }
    });
  }

  // Open modal for create
  openCreateModal(): void {
    this.isEditMode.set(false);
    this.selectedPositionId.set(null);
    this.positionForm.reset();
    this.showModal.set(true);
  }

  // Open modal for edit
  openEditModal(position: Position): void {
    this.isEditMode.set(true);
    this.selectedPositionId.set(position.id);
    this.positionForm.patchValue({
      positionName: position.positionName
    });
    this.showModal.set(true);
  }

  // Close modal
  closeModal(): void {
    this.showModal.set(false);
    this.positionForm.reset();
    this.errorMessage.set('');
  }

  // Submit form (create or update)
  onSubmit(): void {
    if (this.positionForm.invalid) {
      this.errorMessage.set('Por favor complete todos los campos requeridos');
      return;
    }

    const positionData: PositionCreate = {
      positionName: this.positionForm.value.positionName
    };

    if (this.isEditMode()) {
      this.updatePosition(positionData);
    } else {
      this.createPosition(positionData);
    }
  }

  // Create position
  createPosition(position: PositionCreate): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.configurationService.createPosition(position).subscribe({
      next: (response) => {
        console.log('Position created:', response);
        this.isLoading.set(false);
        this.closeModal();
        this.getAllPositions();
      },
      error: (error) => {
        console.error('Error creating position:', error);
        this.errorMessage.set('Error al crear la posición');
        this.isLoading.set(false);
      }
    });
  }

  // Update position
  updatePosition(position: PositionCreate): void {
    const id = this.selectedPositionId();
    if (!id) return;

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.configurationService.updatePosition(id, position).subscribe({
      next: (response) => {
        console.log('Position updated:', response);
        this.isLoading.set(false);
        this.closeModal();
        this.getAllPositions();
      },
      error: (error) => {
        console.error('Error updating position:', error);
        this.errorMessage.set('Error al actualizar la posición');
        this.isLoading.set(false);
      }
    });
  }

  // Open delete confirmation modal
  openDeleteModal(position: Position): void {
    this.positionToDelete.set(position);
    this.showDeleteModal.set(true);
  }

  // Close delete confirmation modal
  closeDeleteModal(): void {
    this.showDeleteModal.set(false);
    this.positionToDelete.set(null);
  }

  // Confirm and delete position
  confirmDelete(): void {
    const position = this.positionToDelete();
    if (!position) return;

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.configurationService.deletePosition(position.id).subscribe({
      next: (response) => {
        console.log('Position deleted:', response);
        this.isLoading.set(false);
        this.closeDeleteModal();
        this.getAllPositions();
      },
      error: (error) => {
        console.error('Error deleting position:', error);
        this.errorMessage.set('Error al eliminar la posición');
        this.isLoading.set(false);
        this.closeDeleteModal();
      }
    });
  }
}
