import { Component } from '@angular/core';
import { Router, RouterLink } from "@angular/router";

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  toggleInviteValue: boolean = false
  toggleProfileValue: boolean = false

  constructor(private router:Router){}

  logout(){
    sessionStorage.clear()
    this.router.navigateByUrl('/login')
  }

  toggleInvite(){
    if(this.toggleInviteValue==false){
      this.toggleProfileValue=false
      this.toggleInviteValue=true
    }
    else{
      this.toggleProfileValue=false
      this.toggleInviteValue=false
    }
  }

  toggleProfile(){
    if(this.toggleProfileValue== false){
      this.toggleInviteValue=false
      this.toggleProfileValue=true
    }
    else{
      this.toggleInviteValue=false
      this.toggleProfileValue=false
    }
  }
}
