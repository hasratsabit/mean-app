import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from "@angular/http";
import "rxjs/add/operator/map";

@Injectable()
export class AuthService {
  // The backend url
  domain = "http://localhost:8080";
  constructor(
    // Assign the http to a variable
    private http: Http
  ) { }

  registeUser(user) {
    return this.http.post(this.domain + '/authentication/register', user).map(res => res.json());
  }

  // This requrest is created to check username in database instantly.
  findUsername(username) {
    return this.http.get(this.domain + '/authentication/checkUsername/' + username).map(res => res.json());
  }

  // This requrest is created to check email in database instantly.
  findEmail(email) {
    return this.http.get(this.domain + '/authentication/checkEmail/' + email).map(res => res.json());
  }
}
