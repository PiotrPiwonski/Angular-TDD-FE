import { Component, OnInit } from '@angular/core';
import {UserService} from "../core/user.service";

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  username = '';
  email = '';
  password = '';
  passwordRepeat = '';
  apiProgress = false;
  signUpSuccess = false;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
  }

  onClickSignUp() {
    // fetch('/api/1.0/users', {
    //   method: 'POST',
    //   body: JSON.stringify({
    //     username: this.username,
    //     email: this.email,
    //     password: this.password
    //   }),
    //   headers: {
    //     'Content-Type': 'application/json'
    //   }
    // });
    this.apiProgress = true;
    this.userService.signUp({
      username: this.username,
      email: this.email,
      password: this.password
    }).subscribe(() => {
      this.signUpSuccess = true;
    });
  }

  isDisabled() {
   return  this.password ? (this.password !== this.passwordRepeat) : true
  }

}
