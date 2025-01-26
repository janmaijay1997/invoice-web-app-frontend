import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { extractRolesFromToken } from 'src/app/utils/jwt-util';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // Get roles from the token
    const userRoles = extractRolesFromToken();
    
    // Get the required roles for this route
    const requiredRoles = route.data['roles'] as string[];

    // Check if the user has at least one required role
    const hasAccess = requiredRoles.some(role => userRoles.includes(role));

    if (!hasAccess) {
      // Redirect to an unauthorized page or the login page
      this.router.navigate(['/unauthorized']);
      return false;
    }

    return true;
  }
}
