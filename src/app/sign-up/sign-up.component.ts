import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";

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

  constructor(private httpClient: HttpClient) { }

  ngOnInit(): void {
  }

  onChangeUsername(event: Event) {
    this.username = (event.target as HTMLInputElement).value;
  }

  onChangeEmail(event: Event) {
    this.email = (event.target as HTMLInputElement).value;
  }

  onChangePassword(event: Event) {
    this.password = (event.target as HTMLInputElement).value;
  }

  onChangePasswordRepeat(event: Event) {
    this.passwordRepeat = (event.target as HTMLInputElement).value;
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
    this.httpClient.post('/api/1.0/users', {
          username: this.username,
          email: this.email,
          password: this.password
    }).subscribe(() => {});
  }

  isDisabled() {
   return  this.password ? (this.password !== this.passwordRepeat) : true
  }

}
