import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-loader',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './loader.component.html',
    styleUrls: ['./loader.component.css']
})
export class LoaderComponent {
    // Señal de entrada para controlar la visibilidad del loader
    isLoading = input<boolean>(false);

    // Mensaje personalizable opcional
    message = input<string>('Cargando...');

    // Tamaño del loader: 'small', 'medium', 'large'
    size = input<'small' | 'medium' | 'large'>('medium');

    // Tipo de overlay: 'full' (pantalla completa) o 'inline' (dentro del contenedor)
    overlay = input<'full' | 'inline'>('inline');
}
