import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from "@angular/http";
import "rxjs/add/operator/map";
import { tokenNotExpired } from "angular2-jwt";

@Injectable()
export class AuthService {
  // The backend url
  domain = "http://localhost:8080";
  authToken;
  user;
  options;

  constructor(
    // Assign the http to a variable
    private http: Http
  ) { }

  // Function to create headers, add token, to be used in HTTP requests
  createAuthenticationHeaders() {
    this.loadToken(); // Get token so it can be attached to headers
    // Headers configuration options
    this.options = new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/json', // Format set to JSON
        'authorization': this.authToken // Attach token
      })
    });
  }

  // Function to get token from client local storage
  loadToken() {
    this.authToken = localStorage.getItem('token');; // Get token and asssign to variable to be used elsewhere
  }

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

  login(user) {
    return this.http.post(this.domain + '/authentication/login', user).map(res => res.json());
  }

  logout() {
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }

  // Store the user and token coming from backend in the browser.
  storeUserData(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }


  // Send a get request for profile.
  getProfile(){
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + '/authentication/profile', this.options).map(res => res.json());
  }

  // Function to check if user is logged in
  loggedIn() {
    return tokenNotExpired();
  }
}
