import { inject } from '@angular/core';
import { CanActivateFn, NavigationEnd, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { DefaultService } from '../Services/default.service';

export const AdminGuard: CanActivateFn = () => {
  const service = inject(DefaultService);
  const router = inject(Router);

  if (service.getRoleFromToken() === 'Admin') return true;

  Swal.fire({
    icon: 'warning',
    title: 'You are not allowed to go there!',
    text: 'Only Admins can see this page.',
    confirmButtonText: 'Ok',
    background: '#212529',
    color: '#fff',
    confirmButtonColor: '#0b5ed7'
  })

  router.navigate(['/login']);
  return false;
};
