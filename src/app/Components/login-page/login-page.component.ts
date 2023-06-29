import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DefaultService } from 'src/app/Services/default.service';
import { APIService } from 'src/app/Services/api.service';

import Swal from 'sweetalert2';
import { User } from 'src/app/Models/user.model';
import { TokenApi } from 'src/app/Models/tokenApi.model';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
  select: string = '';

  submitted: boolean = false;

  inLogIn: boolean = false;
  loggingIn: boolean = false;
  loginForm!: FormGroup;
  errorLogIn: boolean = false;

  forgotPassword: boolean = false;
  resettingPassword: boolean = false;
  resetForm!: FormGroup;
  errorReset: boolean = false;

  inSignUp: boolean = false;
  signingUp: boolean = false;
  signupForm!: FormGroup;
  errorSignUp: boolean = false;

  constructor(private formBuilder: FormBuilder, private router: Router, private service: DefaultService, private apiService: APIService) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd && (event.url === '/login')) {
        this.inLogIn = true;
        this.inSignUp = false;
        this.forgotPassword = false;
      }
      if (event instanceof NavigationEnd && (event.url === '/forgotpassword')) {
        this.forgotPassword = true;
        this.inLogIn = false;
        this.inSignUp = false;
      }
      if (event instanceof NavigationEnd && (event.url === '/signup')) {
        this.inSignUp = true;
        this.inLogIn = false;
        this.forgotPassword = false;
      }
    });
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      usernameLogIn: ['', Validators.required],
      passwordLogIn: ['', Validators.required]
    });

    this.resetForm = this.formBuilder.group({
      emailReset: ['', [Validators.required, Validators.email]]
    });

    this.signupForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      emailSignUp: ['', [Validators.required, Validators.email]],
      usernameSignUp: ['', Validators.required],
      passwordSignUp: ['', Validators.required],
      companyName: [''],
      jobPosition: ['']
    });
  }

  checkRequiredError(formGroup: FormGroup, field: string): boolean {
    return formGroup.controls[field].dirty && formGroup.hasError('required', field);
  }

  validateForm(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);

      if (control instanceof FormControl) control.markAsDirty({ onlySelf: true });
      if (control instanceof FormGroup) this.validateForm(control);
    });
  }

  tryLogIn(user: User): void {
    this.apiService.login(user).subscribe({
      next: (response: TokenApi) => {
        this.service.storeToken(response.accessToken);
        this.service.storeRefreshToken(response.refreshToken);
        this.service.setLoggedOut(false);
        const tokenPayload = this.service.decodeToken();
        this.service.setRole(tokenPayload.role);
        window.location.href = '/search'; // TODO: Usare router.navigate ma facendo funzionare la sezione feedbacks senza refresh
        this.submitted = false;
        this.loggingIn = false;
        this.errorLogIn = false;
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          background: '#212529',
          color: '#fff',
          text: 'Wrong username or password! Please try again.',
          focusConfirm: false,
          confirmButtonColor: '#0b5ed7'
        });
        this.errorLogIn = true;
        this.submitted = false;
        this.loggingIn = false;
      }
    });
  }

  onLogin(): void {
    this.submitted = true;
    this.loggingIn = true;

    const user: User = {
      username: this.loginForm.value.usernameLogIn,
      password: this.loginForm.value.passwordLogIn
    };

    if (this.loginForm.valid) {
      this.tryLogIn(user);
    }

    else {
      Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        background: '#212529',
        color: '#fff',
        text: 'All fields must be filled! Please try again.',
        focusConfirm: false,
        confirmButtonColor: '#0b5ed7'
      });

      this.validateForm(this.loginForm);
      this.loggingIn = false;
    }
  }


  onResetPassword(): void {
    this.submitted = true;
    this.resettingPassword = true;

    if (this.resetForm.valid) {
      this.apiService.sendResetPasswordLink(this.resetForm.value.emailReset).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Email sent!',
            background: '#212529',
            color: '#fff',
            confirmButtonColor: '#0b5ed7',
            text: 'Check your email for further instructions to reset your password.',
          });

          this.router.navigate(['/login']);
          this.resetForm.reset();
          this.submitted = false;
          this.errorReset = false;
        },
        error: () => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            background: '#212529',
            color: '#fff',
            text: 'Something went wrong! Please try again.',
            focusConfirm: false,
            confirmButtonColor: '#0b5ed7'
          });

          this.errorReset = true;
          this.submitted = false;
          this.resettingPassword = false;
        }
      });
    }

    else {
      const errorType = this.resetForm.controls['emailReset'].errors!;
      Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        background: '#212529',
        color: '#fff',
        text: errorType['required'] ? 'Email is required! Please try again.' : 'Email is invalid! Please try again.',
        focusConfirm: false,
        confirmButtonColor: '#0b5ed7'
      });

      this.validateForm(this.resetForm);
      this.resettingPassword = false;
    }

  }

  setSelect(e: Event): void {
    this.select = (e.target as HTMLInputElement).value;
    this.signupForm.reset();
    this.submitted = false;

    if (this.select === 'company') {
      this.signupForm.get('companyName')!.addValidators(Validators.required);
      this.signupForm.get('companyName')!.updateValueAndValidity();
      this.signupForm.get('jobPosition')!.clearValidators();
      this.signupForm.get('jobPosition')!.updateValueAndValidity();

    }

    if (this.select === 'job') {
      this.signupForm.get('jobPosition')!.addValidators(Validators.required);
      this.signupForm.get('jobPosition')!.updateValueAndValidity();
      this.signupForm.get('companyName')!.clearValidators();
      this.signupForm.get('companyName')!.updateValueAndValidity();
    }
  }

  onSignup(): void {
    this.submitted = true;
    this.signingUp = true;

    const user: User = {
      username: this.signupForm.value.usernameSignUp,
      firstName: this.signupForm.value.firstName,
      lastName: this.signupForm.value.lastName,
      email: this.signupForm.value.emailSignUp,
      password: this.signupForm.value.passwordSignUp,
      companyName: this.signupForm.value.companyName,
      position: this.signupForm.value.jobPosition
    };

    if (this.signupForm.valid) {
      this.apiService.signup(user).subscribe({
        next: () => {
          this.tryLogIn(user);
          this.errorSignUp = false;
        },
        error: () => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            background: '#212529',
            color: '#fff',
            text: 'This user already exists! Please create a new one.',
            focusConfirm: false,
            confirmButtonColor: '#0b5ed7'
          });
          this.errorSignUp = true;
          this.signingUp = false;
        }
      });
    }

    else {
      Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        background: '#212529',
        color: '#fff',
        text: 'All fields must be filled! Please try again.',
        focusConfirm: false,
        confirmButtonColor: '#0b5ed7'
      });

      this.validateForm(this.signupForm);
      this.signingUp = false;
    }
  }
}
