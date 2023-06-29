import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ResetPassword } from 'src/app/Models/resetPassword.model';
import { APIService } from 'src/app/Services/api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetForm!: FormGroup;
  errorReset: boolean = false;
  submitted: boolean = false;
  resettingPassword: boolean = false;

  emailToReset: string = '';
  emailToken: string = '';

  resetPasswordObj = new ResetPassword();

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private apiService: APIService, private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.resetForm = this.formBuilder.group({
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });

    this.activatedRoute.queryParams.subscribe(params => {
      this.emailToReset = params['email'];
      let uriToken = params['code'];

      this.emailToken = uriToken.replace(/ /g, '+');
    });
  }

  checkRequiredError(formGroup: FormGroup, field: string): boolean {
    return formGroup.controls[field].dirty && formGroup.hasError('required', field);
  }

  checkEqualsPasswords(): boolean {
    return !this.submitted && this.resetForm.controls['newPassword'].value === this.resetForm.controls['confirmPassword'].value;
  }

  validateForm(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);

      if (control instanceof FormControl) control.markAsDirty({ onlySelf: true });
      if (control instanceof FormGroup) this.validateForm(control);
    });
  }

  onResetPassword() {
    this.resettingPassword = true;
    this.submitted = true;

    if (this.resetForm.valid) {
      this.resetPasswordObj.email = this.emailToReset;
      this.resetPasswordObj.newPassword = this.resetForm.value.newPassword;
      this.resetPasswordObj.confirmPassword = this.resetForm.value.confirmPassword;
      this.resetPasswordObj.emailToken = this.emailToken;

      this.apiService.resetPassword(this.resetPasswordObj).subscribe({
        next: () => {
          this.resetForm.reset();
          this.resettingPassword = false;
          this.submitted = false;
          this.errorReset = false;
          this.router.navigate(['/login']);
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

          this.resettingPassword = false;
          this.submitted = false;
          this.errorReset = true;
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

      this.resettingPassword = false;
      this.submitted = false;
      this.errorReset = true;

      this.validateForm(this.resetForm);
    }
  }
}
