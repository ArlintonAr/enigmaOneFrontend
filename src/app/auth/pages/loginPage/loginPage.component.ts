import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ErrorAlertComponent } from '../../../shared/components/errorAlert/errorAlert.component';

@Component({
  selector: 'auth-login-page',
  imports: [RouterLink, ReactiveFormsModule,ErrorAlertComponent],
  templateUrl: './loginPage.component.html',

})
export class LoginPageComponent {

  fb = inject(FormBuilder)

  hasError = signal<boolean>(false);
  hasNameError = signal<string>('');
  isPosting = signal<boolean>(false);
  router = inject(Router);

  authService = inject(AuthService);




  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  clouseAlert(){
    this.hasError.set(false);
  }

  login() {

    if (this.loginForm.invalid) {
      this.hasError.set(true);
      return;
    }
    const { email, password } = this.loginForm.value;


    this.authService.login(email!, password!).subscribe(
      (isAuthenticated) => {
        if (isAuthenticated) {
          this.router.navigateByUrl('/dashboard');
          return;
        }
        this.hasError.set(true);
        this.hasNameError.set('Credenciales incorrectas!');
      }
    )
  }

  closeAlert(){
    this.hasError.set(false);
    this.hasNameError.set('');
  }

}
