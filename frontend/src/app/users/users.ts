import { Component, signal } from '@angular/core';
import { Sidebar } from '../sidebar/sidebar';
import { Header } from '../header/header';
import { Api } from '../service/api';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-users',
  imports: [Sidebar, Header, RouterLink, ReactiveFormsModule],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class Users {
  userForm: FormGroup;
  addUserToggle: boolean = false;
  companyUsers = signal<any>([]);
  user: any = {}

  constructor(
    private api: Api,
    private fb: FormBuilder,
  ) {
    this.userForm = this.fb.group({
      email: ['', [Validators.required]],
      role: ['', [Validators.required]],
    });
  }

  inviteUser() {
    if (this.userForm.valid) {
      const email = this.userForm.value.email;
      const role = this.userForm.value.role;
      console.log(email, role);
      this.api.createInviteAPI({ email, role }).subscribe({
        next: (res: any) => {
          console.log(res);
          alert(res);
          location.reload();
        },
        error: (reason: any) => {
          console.log(reason);
          alert(reason.error);
        },
      });
    }
  }

  toggleAddUser() {
    if (this.addUserToggle) {
      this.addUserToggle = false;
    } else {
      this.addUserToggle = true;
    }
  }

  getUsers() {
    this.api.getCompanyUsersAPI().subscribe({
      next: (res: any) => {
        // console.log(res);
        this.companyUsers.set(res);
      },
      error: (reason: any) => {
        alert(reason.error);
      },
    });
  }

  ngOnInit() {
    this.getUsers();
    this.user=JSON.parse(sessionStorage.getItem("user") || "")
    console.log(this.user);
    
  }
}
