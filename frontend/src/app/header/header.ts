import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  toggleInviteValue: boolean = false
  toggleProfileValue: boolean = false

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
