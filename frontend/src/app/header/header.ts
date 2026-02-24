import { Component, signal } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { Api } from '../service/api';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  toggleInviteValue: boolean = false
  toggleProfileValue: boolean = false
  invites = signal<any>([])

  constructor(private router:Router, private api:Api){}

  ngOnInit(){
    this.getInvites()
  }

  getInvites(){
    this.api.getInviteAPI().subscribe({
      next: (res: any) => {
          this.invites.set(res)          
          console.log(this.invites());
        },
        error: (reason: any) => {
          console.log(reason);

        }
    })
  }

  acceptInvite(invite: any){
    this.api.acceptInviteAPI(invite).subscribe({
      next: (res: any) => {
          alert(res)
          location.reload()
        },
        error: (reason: any) => {
          console.log(reason);
          alert(reason.error)
        }
    })
  }

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
