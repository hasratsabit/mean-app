import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  form: FormGroup;
  message;
  messageClass;
  processing = false; // This is to lock the form.
  emailValid;
  emailMessage;
  usernameValid;
  usernameMessage;
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
      this.createForm();
    }
  createForm() {
    this.form = this.formBuilder.group({
      email: ['', Validators.compose([
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(30),
        this.validateEmail
      ])],
      username: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(15),
        this.validateUsername
      ])],
      password: ['', Validators.compose([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(35),
        this.validatePassword
      ])],
      confirm: ['', Validators.required]
    }, { validator: this.matchingPassword('password', 'confirm')}); // It is placed here so we can access it wherever we want.
  }

  // Disable form after every post
  disableForm() {
    this.form.controls['email'].disable();
    this.form.controls['username'].disable();
    this.form.controls['password'].disable();
    this.form.controls['confirm'].disable();
  }

  // Enable form if error occurs
  enableForm() {
    this.form.controls['email'].enable();
    this.form.controls['username'].enable();
    this.form.controls['password'].enable();
    this.form.controls['confirm'].enable();
  }

  // Custom Validator for Email Format
  validateEmail(controls){
    const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    if(regExp.test(controls.value)){ // If passes the test
      return null // Return null for error.
    }else{
      return { 'validateEmail': true }
    }
  }

  // Custom Validator for Username Format
  validateUsername(controls){
    // Create a regular expression
    const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
    // If passes the test
    if(regExp.test(controls.value)){
      return null // Return null for error.
    }else{
      return { 'validateUsername': true }
    }
  }

  // Custom Validator for Username Format
  validatePassword(controls){
    // Create a regular expression
    const regExp = new RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/);
    // If passes the test
    if(regExp.test(controls.value)){
      return null // Return null for error.
    }else{
      return { 'validatePassword': true }
    }
  }

  matchingPassword(password, confirm){
    return (group: FormGroup) => {
      // checks if the confirm password is the same as password
      if(group.controls[password].value === group.controls[confirm].value){
        return null;
      }else{
        return {'matchingPassword': true}
      }
    }
  }

  // The Event Listener for register form.
  onRegisterSubmit() {
    this.processing = true; // When the form is submited, the submit button is locked.
    // This will disable the form after form submition
    this.disableForm();
    // Gets all the input values.
    const user = {
      username: this.form.get('username').value,
      email: this.form.get('email').value,
      password: this.form.get('password').value
    }

    // Using Service HTTP method sending request to the back end.
    this.authService.registeUser(user).subscribe(data => {
      // The error and success messages are coming from db
      if(!data.success){
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
        this.processing = false; // If there is an error, the submit button is unlocks.
        // The form is unlock
        this.enableForm();
      }else{
        this.messageClass = 'alert alert-success'; // Set the bootstrap to success
        this.message = data.message; // Give a success message to user.
        // After two second redirect user to the login page.
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      }
    })
  }

  // Function to check if e-mail is taken
  checkEmail() {
    // Function from authentication file to check if e-mail is taken
    this.authService.findEmail(this.form.get('email').value).subscribe(data => {
      // Check if success true or false was returned from API
      if (!data.success) {
        this.emailValid = false; // Return email as invalid
        this.emailMessage = data.message; // Return error message
      } else {
        this.emailValid = true; // Return email as valid
        this.emailMessage = data.message; // Return success message
      }
    });
  }

  // Function to check if username is available
  checkUsername() {
    // Function from authentication file to check if username is taken
    this.authService.findUsername(this.form.get('username').value).subscribe(data => {
      // Check if success true or success false was returned from API
      if (!data.success) {
        this.usernameValid = false; // Return username as invalid
        this.usernameMessage = data.message; // Return error message
      } else {
        this.usernameValid = true; // Return username as valid
        this.usernameMessage = data.message; // Return success message
      }
    });
  }
  ngOnInit() {
  }

}
