import { CanActivateFn, Router } from '@angular/router';
import { DefaultService } from '../Services/default.service';
import { inject } from '@angular/core';
import Swal from 'sweetalert2';

export const AuthGuard: CanActivateFn = () => {
  const service = inject(DefaultService);
  const router = inject(Router);

  if (service.isLoggedIn()) return true;

  Swal.fire({
    icon: 'warning',
    title: 'You are not logged in!',
    text: 'Please log in to continue.',
    confirmButtonText: 'Log In',
    background: '#212529',
    color: '#fff',
    confirmButtonColor: '#0b5ed7'
  }).then((result) => {
    if (result.isConfirmed) {
      router.navigate(['/login']);
    }
  });
  
  router.navigate(['']);
  return false;
};
