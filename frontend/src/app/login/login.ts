import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from "@angular/router";
import { Api } from '../service/api';

@Component({
  selector: 'app-login',
  imports: [RouterLink,ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  loginForm:FormGroup

  constructor(private fb:FormBuilder, private api:Api,private router:Router){
    this.loginForm = this.fb.group({
    email:["",[Validators.required,Validators.email]],
    password:["",[Validators.required,Validators.pattern("[a-zA-Z0-9]*")]]
    })
  }

  login(){
    if(this.loginForm.valid){
      const email = this.loginForm.value.email
      const password = this.loginForm.value.password
      this.api.loginUserAPI({email,password}).subscribe({
        next:(res:any)=>{
          console.log(res);
          sessionStorage.setItem("user",JSON.stringify(res.user))
          sessionStorage.setItem("token",res.token)
          alert(res.message)
          this.router.navigateByUrl('/home')
        },
        error:(reason:any)=>{
          if(reason.status=404){
            alert(reason.error)
          }
          else{
            alert("Something Went Wrong! Please Try Again...")
          }
        }
      })
    }
    else{
      alert("Invalid Details")
    }
  }

}
