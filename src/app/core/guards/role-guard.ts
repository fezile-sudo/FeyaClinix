import { inject } from '@angular/core';
import {
  CanActivateFn,
  Router
} from '@angular/router';

import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  const currentUser = authService.currentUser();

  // User is not authenticated
  if (!currentUser) {
    return router.createUrlTree(['/login']);
  }

  const allowedRoles =
    route.data['roles'] as string[] | undefined;

  // No roles specified → allow access
  if (!allowedRoles || allowedRoles.length === 0) {
    return true;
  }

  // Check whether the user's role is allowed
  if (allowedRoles.includes(currentUser.role)) {
    return true;
  }

  // User is authenticated but not authorized
  return router.createUrlTree(['/access-denied']);
};

