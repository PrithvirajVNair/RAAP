import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from "@angular/router";
import { Api } from '../service/api';

@Component({
  selector: 'app-register',
  imports: [RouterLink,ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {

  registerForm: FormGroup

  constructor(private fb:FormBuilder,private api:Api, private router:Router){
    this.registerForm = this.fb.group({
      username:["",[Validators.required,Validators.pattern("[a-zA-Z0-9]*")]],
      email:["",[Validators.required,Validators.email]],
      password:["",[Validators.required,Validators.pattern("[a-zA-Z0-9]*")]]
    })
  }

  register(){
    if(this.registerForm.valid){
      const username = this.registerForm.value.username
      const email = this.registerForm.value.email
      const password = this.registerForm.value.password
      this.api.registerUserAPI({username,email,password}).subscribe({
        next:(res:any)=>{
            alert(res.message)
            this.router.navigateByUrl('/login')
        },
        error:(reason:any)=>{
          if(reason.status==409){
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
