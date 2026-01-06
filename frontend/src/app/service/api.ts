import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Api {

  server_url = "http://localhost:3000"

  constructor(private http: HttpClient) { }

  //register user
  registerUserAPI(reqBody: any) {
    return this.http.post(`${this.server_url}/user-register`, reqBody)
  }

  //register user
  loginUserAPI(reqBody: any) {
    return this.http.post(`${this.server_url}/user-login`, reqBody)
  }

}
