// EJEMPLO DE USO DEL COMPONENTE LOADER
// Este archivo muestra cómo usar el componente loader en diferentes escenarios

import { Component, signal } from '@angular/core';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';

@Component({
    selector: 'example-component',
    standalone: true,
    imports: [LoaderComponent],
    template: `
    <!-- EJEMPLO 1: Loader inline mientras se cargan datos -->
    <div class="data-container" style="position: relative; min-height: 300px;">
      <app-loader 
        [isLoading]="isLoadingData()" 
        [message]="'Cargando datos...'"
      />
      
      @if (!isLoadingData()) {
        <div class="data-content">
          <!-- Tu contenido aquí -->
        </div>
      }
    </div>

    <!-- EJEMPLO 2: Loader pequeño en una tarjeta -->
    <div class="card" style="position: relative; min-height: 150px;">
      <app-loader 
        [isLoading]="isLoadingCard()" 
        [message]="'Cargando...'"
        [size]="'small'"
      />
      
      <div class="card-content">
        <!-- Contenido de la tarjeta -->
      </div>
    </div>

    <!-- EJEMPLO 3: Loader de pantalla completa al guardar -->
    <app-loader 
      [isLoading]="isSaving()" 
      [message]="'Guardando información...'"
      [overlay]="'full'"
      [size]="'large'"
    />

    <button (click)="saveData()">Guardar</button>
  `
})
export class ExampleComponent {
    // Señales para controlar los estados de carga
    isLoadingData = signal<boolean>(false);
    isLoadingCard = signal<boolean>(false);
    isSaving = signal<boolean>(false);

    loadData(): void {
        this.isLoadingData.set(true);

        // Simular llamada HTTP
        setTimeout(() => {
            this.isLoadingData.set(false);
        }, 2000);
    }

    saveData(): void {
        this.isSaving.set(true);

        // Simular llamada HTTP
        setTimeout(() => {
            this.isSaving.set(false);
        }, 2000);
    }
}

// EJEMPLO REAL CON SERVICIO HTTP
/*
import { inject } from '@angular/core';
import { MaterialService } from './material.service';

export class MaterialComponent {
  private materialService = inject(MaterialService);
  isLoadingMaterials = signal<boolean>(false);

  loadMaterials(): void {
    this.isLoadingMaterials.set(true);
    
    this.materialService.getMaterials().subscribe({
      next: (response) => {
        // Procesar datos
        this.materials.set(response.data);
        this.isLoadingMaterials.set(false);
      },
      error: (error) => {
        console.error('Error:', error);
        this.isLoadingMaterials.set(false);
      }
    });
  }
}
*/
