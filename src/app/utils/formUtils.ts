import {  FormGroup, ValidationErrors } from "@angular/forms";



export class FormUtils {


  static getTextError(errors: ValidationErrors) {

    for (const key of Object.keys(errors)) {
      switch (key) {
        case ('required'):
          return 'Este campo es requerido.'

        case 'min':
          return `El valor mínimo es ${errors['min'].minLength}.`

        case 'minlength':
          return `Mínimo de ${errors['minlength'].requiredLength} caracteres.`;

        case 'email':
          return `El valor ingresado no es un correo electrónico`;

    /*     case 'emailTaken':
          return `El correo electrónico ya está siendo usado por otro usuario`; */


        default:
          return `Error de validacion no controlado ${key}`
      }
    }

    return null

  }

  static isValidField(form: FormGroup, fieldName: string): boolean | null {

    return (!!form.controls[fieldName].errors && form.controls[fieldName].touched)

  }

  static getFieldError(form: FormGroup, fieldName: string): string | null {
    if (!form.controls[fieldName]) return '';

    const errors = form.controls[fieldName].errors ?? {};
    return FormUtils.getTextError(errors);

  }

}
