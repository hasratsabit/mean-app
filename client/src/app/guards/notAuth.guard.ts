import { Injectable } from "@angular/core";
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "../services/auth.service";

@Injectable()
export class NotAuthGuard implements CanActivate {
	constructor(
		private authService: AuthService,
		private router: Router
	) {}

	// This checks if the user is loggedIn. If not, it will restrict the routes.
	canActivate() {
		if(this.authService.loggedIn()){
			this.router.navigate(['/']);
			return false;
		}else{
			return true;
		}
	}
}
