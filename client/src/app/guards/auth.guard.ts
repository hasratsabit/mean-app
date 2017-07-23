import { Injectable } from "@angular/core";
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "../services/auth.service";

@Injectable()
export class AuthGuard implements CanActivate {

	redirectUrl;

	constructor(
		private authService: AuthService,
		private router: Router
	) {}

	// This checks if the user is loggedIn. If not, it will restrict the routes.
	canActivate(
		// This allows the user to go the link they were initially trying.
		router: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
		) {
		if(this.authService.loggedIn()){
			return true;
		}else{
			// This allows the user to go the link they were initially trying.
			this.redirectUrl = state.url;
			this.router.navigate(['/login']);
			return false;
		}
	}
}
