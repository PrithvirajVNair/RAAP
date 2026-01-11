import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Api {

  server_url = "http://localhost:3000"

  constructor(private http: HttpClient) { }

  // appendToken in reqHeader
  appendToken() {
    let headers = new HttpHeaders()
    const token = sessionStorage.getItem("token")
    if (token) {
      headers = headers.append("Authorization", `Bearer ${token}`)
    }
    return { headers }
  }

  //register user
  registerUserAPI(reqBody: any) {
    return this.http.post(`${this.server_url}/user-register`, reqBody)
  }

  //register user
  loginUserAPI(reqBody: any) {
    return this.http.post(`${this.server_url}/user-login`, reqBody)
  }

  // create company
  createCompanyAPI(reqBody: any) {    
    return this.http.post(`${this.server_url}/create-company`, reqBody, this.appendToken())
  }

  // create risk
  createRiskAPI(reqBody: any) {
    return this.http.post(`${this.server_url}/create-risk`, reqBody, this.appendToken())
  }

  // get company
  getCompanyAPI() {
    return this.http.get(`${this.server_url}/get-company`, this.appendToken())
  }

  // get user
  getCompanyUsersAPI() {
    return this.http.get(`${this.server_url}/get-company-user`, this.appendToken())
  }

  // get user
  getCurrentUsersAPI() {
    return this.http.get(`${this.server_url}/get-current-user`, this.appendToken())
  }

  // get risk
  getCompanyRiskAPI() {
    return this.http.get(`${this.server_url}/get-risk`, this.appendToken())
  }

  // get a risk
  getACompanyRiskAPI(id:any) {
    return this.http.get(`${this.server_url}/get/${id}/risk`, this.appendToken())
  }

  // get risk
  getCompanyRiskStatusAPI() {
    return this.http.get(`${this.server_url}/get-risk-dashboard-status`, this.appendToken())
  }

}
