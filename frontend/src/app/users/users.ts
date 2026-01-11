import { Component, signal } from '@angular/core';
import { Sidebar } from "../sidebar/sidebar";
import { Header } from "../header/header";
import { Api } from '../service/api';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-users',
  imports: [Sidebar, Header, RouterLink],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class Users {


    companyUsers = signal<any>([])

    constructor(private api:Api){}


    getUsers() {
    this.api.getCompanyUsersAPI().subscribe({
      next: (res: any) => {
        // console.log(res);
        this.companyUsers.set(res)
      },
      error: (reason: any) => {
        alert(reason.error)
      }
    })
  }

  ngOnInit(){
    this.getUsers()
  }

}
