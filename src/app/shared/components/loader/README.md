# Componente Loader Genérico

## Descripción
Componente reutilizable para mostrar estados de carga en la aplicación. Incluye animaciones suaves y múltiples opciones de configuración.

## Ubicación
`src/app/shared/components/loader/loader.component.ts`

## Características
- ✅ Múltiples tamaños (small, medium, large)
- ✅ Dos modos de overlay (full, inline)
- ✅ Mensaje personalizable
- ✅ Animaciones fluidas
- ✅ Standalone component (fácil de importar)

## Uso Básico

### 1. Importar el componente
```typescript
import { LoaderComponent } from '../../../shared/components/loader/loader.component';

@Component({
  selector: 'mi-componente',
  imports: [LoaderComponent, ...],
  templateUrl: './mi-componente.component.html',
})
export class MiComponente {
  isLoading = signal<boolean>(false);
}
```

### 2. Usar en el template

#### Ejemplo básico (inline)
```html
<div style="position: relative; min-height: 200px;">
  <app-loader [isLoading]="isLoading()" />
  
  <!-- Tu contenido aquí -->
  <div>Contenido que se carga...</div>
</div>
```

#### Ejemplo con mensaje personalizado
```html
<app-loader 
  [isLoading]="isLoading()" 
  [message]="'Cargando materiales...'" 
/>
```

#### Ejemplo con tamaño grande
```html
<app-loader 
  [isLoading]="isLoading()" 
  [message]="'Procesando datos...'" 
  [size]="'large'"
/>
```

#### Ejemplo con overlay completo (pantalla completa)
```html
<app-loader 
  [isLoading]="isLoading()" 
  [message]="'Guardando información...'" 
  [overlay]="'full'"
/>
```

## Propiedades de Entrada

| Propiedad | Tipo | Valores | Default | Descripción |
|-----------|------|---------|---------|-------------|
| `isLoading` | `boolean` | `true/false` | `false` | Controla la visibilidad del loader |
| `message` | `string` | Cualquier texto | `'Cargando...'` | Mensaje a mostrar debajo del spinner |
| `size` | `string` | `'small'`, `'medium'`, `'large'` | `'medium'` | Tamaño del spinner |
| `overlay` | `string` | `'full'`, `'inline'` | `'inline'` | Tipo de overlay |

## Ejemplos de Uso en Diferentes Escenarios

### Escenario 1: Cargar datos desde el servidor
```typescript
export class OrderEntryComponent {
  isLoadingMaterials = signal<boolean>(false);

  loadMaterials(): void {
    this.isLoadingMaterials.set(true);
    
    this.materialService.getMaterials().subscribe({
      next: (response) => {
        // Procesar datos
        this.isLoadingMaterials.set(false);
      },
      error: (error) => {
        this.isLoadingMaterials.set(false);
      }
    });
  }
}
```

```html
<div class="materials-container" style="position: relative; min-height: 300px;">
  <app-loader 
    [isLoading]="isLoadingMaterials()" 
    [message]="'Cargando materiales del servidor...'"
  />
  
  <div class="materials-list">
    <!-- Lista de materiales -->
  </div>
</div>
```

### Escenario 2: Guardar datos (overlay completo)
```typescript
export class OrderEntryComponent {
  isSaving = signal<boolean>(false);

  createStockEntry(): void {
    this.isSaving.set(true);
    
    this.stockService.createStock(data).subscribe({
      next: (response) => {
        this.isSaving.set(false);
        // Mostrar mensaje de éxito
      },
      error: (error) => {
        this.isSaving.set(false);
        // Mostrar error
      }
    });
  }
}
```

```html
<!-- Loader de pantalla completa mientras se guarda -->
<app-loader 
  [isLoading]="isSaving()" 
  [message]="'Guardando información...'" 
  [overlay]="'full'"
  [size]="'large'"
/>

<form (submit)="createStockEntry()">
  <!-- Formulario -->
</form>
```

### Escenario 3: Múltiples loaders en la misma página
```typescript
export class DashboardComponent {
  isLoadingOrders = signal<boolean>(false);
  isLoadingStats = signal<boolean>(false);
  isLoadingChart = signal<boolean>(false);
}
```

```html
<div class="dashboard">
  <!-- Sección de órdenes -->
  <div class="orders-section" style="position: relative;">
    <app-loader [isLoading]="isLoadingOrders()" [size]="'small'" />
    <div>Órdenes...</div>
  </div>
  
  <!-- Sección de estadísticas -->
  <div class="stats-section" style="position: relative;">
    <app-loader [isLoading]="isLoadingStats()" [size]="'small'" />
    <div>Estadísticas...</div>
  </div>
  
  <!-- Sección de gráficos -->
  <div class="chart-section" style="position: relative;">
    <app-loader [isLoading]="isLoadingChart()" />
    <div>Gráficos...</div>
  </div>
</div>
```

## Notas Importantes

1. **Posicionamiento**: Para el modo `inline`, el contenedor padre debe tener `position: relative` para que el loader se posicione correctamente.

2. **Altura mínima**: Se recomienda establecer una altura mínima en el contenedor para evitar saltos visuales:
   ```html
   <div style="position: relative; min-height: 200px;">
     <app-loader [isLoading]="isLoading()" />
   </div>
   ```

3. **Overlay completo**: El modo `full` crea un overlay sobre toda la pantalla, ideal para operaciones críticas que bloquean toda la UI.

4. **Accesibilidad**: El loader incluye animaciones suaves que mejoran la experiencia del usuario sin ser intrusivas.

## Personalización

Si necesitas personalizar los colores o animaciones, puedes modificar el archivo CSS:
`src/app/shared/components/loader/loader.component.css`

Los colores actuales del spinner son:
- Azul: `#3b82f6`
- Púrpura: `#8b5cf6`
- Rosa: `#ec4899`
- Naranja: `#f59e0b`
