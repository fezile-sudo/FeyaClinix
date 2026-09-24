import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  const currentUser = authService.currentUser();

  if (!currentUser) {
    return router.createUrlTree(['/login']);
  }

  const allowedRoles = route.data['roles'] as string[] | undefined;

  if (!allowedRoles || allowedRoles.length === 0) {
    return true;
  }

  if (allowedRoles.includes(currentUser.role)) {
    return true;
  }

  return router.createUrlTree(['/access-denied']);
};

