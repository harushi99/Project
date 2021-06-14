import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from './auth.service';
import {Role} from '../_models/role.model';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this.authService.currentUserValue;
    const roles = route.data.roles as Array<string>;
    if (currentUser && !roles) { // If we don't specify a role we only check for user
      // logged in so return true
      return true;
    }

    if (currentUser && roles) { // If we specify a role
      const presentRoles = currentUser.roles.filter(
          (role: Role) => roles.includes(role.name)
      );
      return presentRoles.length > 0; // If the user has one of the specified roles he get access to the route
    }


    // not logged in so redirect to login page with the return url
    this.authService.logout();
    return false;
  }
}
